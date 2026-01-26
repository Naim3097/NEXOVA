import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { validateCsrf, CSRF_ERROR_RESPONSE } from '@/lib/csrf';
import { rateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

// Input validation constants
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_PAGE_SOURCE_LENGTH = 100;

export async function POST(request: NextRequest) {
  try {
    // Validate CSRF protection
    if (!validateCsrf(request)) {
      return NextResponse.json(CSRF_ERROR_RESPONSE, { status: 403 });
    }

    // Rate limit help requests - prevent spam
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(
      `help-request:${clientId}`,
      RATE_LIMITS.MODERATE
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error:
            'Too many requests. Please wait before submitting another help request.',
        },
        { status: 429 }
      );
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { request_type, subject, message, page_source } = body;

    // Validate required fields
    if (!request_type || !message) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: request_type and message are required',
        },
        { status: 400 }
      );
    }

    // Validate request_type
    if (!['help', 'enterprise_inquiry'].includes(request_type)) {
      return NextResponse.json(
        {
          error: 'Invalid request_type. Must be "help" or "enterprise_inquiry"',
        },
        { status: 400 }
      );
    }

    // Input length validation
    if (subject && subject.length > MAX_SUBJECT_LENGTH) {
      return NextResponse.json(
        { error: `Subject too long (max ${MAX_SUBJECT_LENGTH} characters)` },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` },
        { status: 400 }
      );
    }

    if (page_source && page_source.length > MAX_PAGE_SOURCE_LENGTH) {
      return NextResponse.json(
        { error: 'Invalid page source' },
        { status: 400 }
      );
    }

    // Get user profile for snapshot data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('display_name, phone, subscription_plan')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    // Set priority based on request type
    const priority = request_type === 'enterprise_inquiry' ? 'high' : 'normal';

    // Create help request
    const { data: helpRequest, error: insertError } = await supabase
      .from('help_requests')
      .insert({
        user_id: user.id,
        request_type,
        page_source,
        subject:
          subject ||
          (request_type === 'enterprise_inquiry'
            ? 'Enterprise Plan Inquiry'
            : 'Help Request'),
        message,
        user_name:
          profile?.display_name || user.email?.split('@')[0] || 'Unknown',
        user_email: user.email,
        user_phone: profile?.phone,
        user_plan: profile?.subscription_plan || 'free',
        status: 'new',
        priority,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating help request:', insertError);
      return NextResponse.json(
        { error: 'Failed to submit help request' },
        { status: 500 }
      );
    }

    // TODO: Send email notification to admin
    // await sendAdminNotification(helpRequest);

    return NextResponse.json({
      success: true,
      helpRequest: {
        id: helpRequest.id,
        status: helpRequest.status,
        created_at: helpRequest.created_at,
      },
      message:
        request_type === 'enterprise_inquiry'
          ? 'Thank you for your interest! Our team will contact you shortly.'
          : 'Your help request has been submitted. We will get back to you soon.',
    });
  } catch (error) {
    console.error('Help request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch user's own help requests
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's help requests
    const { data: helpRequests, error: fetchError } = await supabase
      .from('help_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching help requests:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch help requests' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      helpRequests,
    });
  } catch (error) {
    console.error('Fetch help requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
