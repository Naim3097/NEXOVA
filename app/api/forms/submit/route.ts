import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendFormSubmissionNotification } from '@/lib/email';
import { rateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, RATE_LIMITS.MODERATE);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          resetAt: new Date(rateLimitResult.resetAt).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS.MODERATE.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { projectId, formId, data } = body;

    // Validation
    if (!projectId || !formId || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId, formId, data' },
        { status: 400 }
      );
    }

    // Get IP address for logging
    const ip = getClientIdentifier(request);

    // Validate data is an object
    if (typeof data !== 'object' || Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Form data must be an object' },
        { status: 400 }
      );
    }

    // Basic spam detection - check for suspicious patterns
    const dataString = JSON.stringify(data).toLowerCase();
    const spamPatterns = ['viagra', 'cialis', 'casino', 'lottery', 'winner'];
    const hasSpam = spamPatterns.some(pattern => dataString.includes(pattern));

    if (hasSpam) {
      return NextResponse.json(
        { error: 'Submission flagged as spam' },
        { status: 400 }
      );
    }

    // Verify project exists and get project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, name, user_id')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Save submission to database
    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .insert({
        project_id: projectId,
        form_id: formId,
        data: data,
        ip_address: ip,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Error saving submission:', submissionError);
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      );
    }

    // Send email notification to project owner (async, don't block response)
    // Get user's email from profiles
    (async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', project.user_id)
          .single();

        if (profile?.email) {
          try {
            await sendFormSubmissionNotification(profile.email, {
              projectName: project.name,
              formId: formId,
              submissionData: data,
              submittedAt: submission.created_at,
              ipAddress: ip,
            });
          } catch (err) {
            // Log error but don't fail the submission
            console.error('Failed to send email notification:', err);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user email:', err);
      }
    })();

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      submissionId: submission.id,
    });

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}
