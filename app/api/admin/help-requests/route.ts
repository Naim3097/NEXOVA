import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { isAdminEmail } from '@/lib/admin';
import { validateCsrf, CSRF_ERROR_RESPONSE } from '@/lib/csrf';

// Input validation constants
const VALID_STATUSES = [
  'new',
  'in_progress',
  'contacted',
  'resolved',
  'closed',
] as const;
const VALID_PRIORITIES = ['low', 'normal', 'high', 'urgent'] as const;
const MAX_ADMIN_NOTES_LENGTH = 5000;

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

    // Check if user is admin
    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('help_requests')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (type) {
      query = query.eq('request_type', type);
    }

    const { data: helpRequests, error, count } = await query;

    if (error) {
      console.error('Error fetching help requests:', error);
      return NextResponse.json(
        { error: 'Failed to fetch help requests' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      helpRequests,
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Admin help requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Validate CSRF protection
    if (!validateCsrf(request)) {
      return NextResponse.json(CSRF_ERROR_RESPONSE, { status: 403 });
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

    // Check if user is admin
    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, status, admin_notes, priority } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    // Validate id format (UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (typeof id !== 'string' || !uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid id format' }, { status: 400 });
    }

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate priority if provided
    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return NextResponse.json(
        {
          error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate admin_notes length if provided
    if (
      admin_notes !== undefined &&
      typeof admin_notes === 'string' &&
      admin_notes.length > MAX_ADMIN_NOTES_LENGTH
    ) {
      return NextResponse.json(
        {
          error: `Admin notes too long (max ${MAX_ADMIN_NOTES_LENGTH} characters)`,
        },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: Record<string, any> = {};

    if (status) {
      updateData.status = status;
      if (status === 'contacted') {
        updateData.contacted_at = new Date().toISOString();
      }
      if (status === 'resolved' || status === 'closed') {
        updateData.resolved_at = new Date().toISOString();
      }
    }

    if (admin_notes !== undefined) {
      updateData.admin_notes = admin_notes;
    }

    if (priority) {
      updateData.priority = priority;
    }

    // Update assigned_to with current admin
    updateData.assigned_to = user.id;

    const { data: updatedRequest, error: updateError } = await supabase
      .from('help_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating help request:', updateError);
      return NextResponse.json(
        { error: 'Failed to update help request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      helpRequest: updatedRequest,
    });
  } catch (error) {
    console.error('Admin help request update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
