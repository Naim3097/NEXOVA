import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

// Create a Supabase client (lazy-init to avoid build-time env var errors)
const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export const runtime = 'nodejs';

/**
 * POST /api/analytics/track
 * Track analytics events from published pages
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting to prevent database flooding
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, RATE_LIMITS.LENIENT);

    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const { project_id, event_type, session_id, device_type, metadata } = body;

    // Validate required fields
    if (!project_id || !event_type || !session_id) {
      return NextResponse.json(
        {
          error: 'Missing required fields: project_id, event_type, session_id',
        },
        { status: 400 }
      );
    }

    // Validate event type
    const validEventTypes = [
      'page_view',
      'button_click',
      'form_view',
      'form_submit',
      'page_exit',
    ];
    if (!validEventTypes.includes(event_type)) {
      return NextResponse.json(
        {
          error: `Invalid event_type. Must be one of: ${validEventTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Verify project exists
    const supabase = getSupabase();
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Insert analytics event
    const { error: insertError } = await supabase
      .from('analytics_events')
      .insert({
        project_id,
        event_type,
        session_id,
        device_type: device_type || 'unknown',
        metadata: metadata || {},
      });

    if (insertError) {
      console.error('Error inserting analytics event:', insertError);
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: 500 }
      );
    }

    // Return success (keep response minimal for performance)
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
