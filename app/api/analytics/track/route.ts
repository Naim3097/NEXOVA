import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

/**
 * POST /api/analytics/track
 * Track analytics events from published pages
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_id, event_type, session_id, device_type, metadata } = body;

    // Validate required fields
    if (!project_id || !event_type || !session_id) {
      return NextResponse.json(
        { error: 'Missing required fields: project_id, event_type, session_id' },
        { status: 400 }
      );
    }

    // Validate event type
    const validEventTypes = ['page_view', 'button_click', 'form_view', 'form_submit', 'page_exit'];
    if (!validEventTypes.includes(event_type)) {
      return NextResponse.json(
        { error: `Invalid event_type. Must be one of: ${validEventTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
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
