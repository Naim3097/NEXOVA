import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/analytics/export?projectId=xxx&days=30
 * Export analytics data as CSV
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const days = parseInt(searchParams.get('days') || '30');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing projectId parameter' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Verify user owns the project
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id, name')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all analytics events
    const { data: events, error: eventsError } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('project_id', projectId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (eventsError) {
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    // Generate CSV
    const csvRows: string[] = [];

    // CSV header
    csvRows.push([
      'Date',
      'Time',
      'Event Type',
      'Session ID',
      'Device Type',
      'Referrer',
      'URL',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Additional Data',
    ].join(','));

    // CSV data
    events?.forEach((event) => {
      const date = new Date(event.created_at);
      const metadata = event.metadata || {};

      csvRows.push([
        date.toISOString().split('T')[0],
        date.toISOString().split('T')[1].split('.')[0],
        event.event_type,
        event.session_id,
        event.device_type || 'unknown',
        `"${metadata.referrer || 'direct'}"`,
        `"${metadata.url || ''}"`,
        metadata.utmSource || '',
        metadata.utmMedium || '',
        metadata.utmCampaign || '',
        `"${JSON.stringify(metadata).replace(/"/g, '""')}"`,
      ].join(','));
    });

    const csv = csvRows.join('\n');
    const filename = `analytics-${project.name?.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Analytics export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
