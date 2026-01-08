import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/analytics/stats?projectId=xxx&days=30
 * Get analytics statistics for a project
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
      .select('id, user_id')
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

    // Get total page views
    const { count: pageViews } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .eq('event_type', 'page_view')
      .gte('created_at', startDate.toISOString());

    // Get unique visitors (unique session_ids)
    const { data: sessionsData } = await supabase
      .from('analytics_events')
      .select('session_id')
      .eq('project_id', projectId)
      .eq('event_type', 'page_view')
      .gte('created_at', startDate.toISOString());

    const uniqueVisitors = new Set(sessionsData?.map(s => s.session_id) || []).size;

    // Get page views by date (traffic over time)
    const { data: trafficData } = await supabase
      .rpc('get_traffic_by_date', {
        p_project_id: projectId,
        p_days: days
      });

    // Get device breakdown
    const { data: deviceData } = await supabase
      .from('analytics_events')
      .select('device_type')
      .eq('project_id', projectId)
      .eq('event_type', 'page_view')
      .gte('created_at', startDate.toISOString());

    const deviceBreakdown = deviceData?.reduce((acc: any, curr) => {
      const device = curr.device_type || 'unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    // Get traffic sources (referrers)
    const { data: referrerData } = await supabase
      .from('analytics_events')
      .select('metadata')
      .eq('project_id', projectId)
      .eq('event_type', 'page_view')
      .gte('created_at', startDate.toISOString());

    const trafficSources: Record<string, number> = {};
    referrerData?.forEach((event) => {
      const referrer = event.metadata?.referrer || 'direct';
      trafficSources[referrer] = (trafficSources[referrer] || 0) + 1;
    });

    // Convert to sorted array
    const topSources = Object.entries(trafficSources)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get form submissions count
    const { count: formSubmissions } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .eq('event_type', 'form_submit')
      .gte('created_at', startDate.toISOString());

    // Calculate conversion rate
    const conversionRate = pageViews && pageViews > 0
      ? ((formSubmissions || 0) / pageViews) * 100
      : 0;

    // Get button clicks count
    const { count: buttonClicks } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .eq('event_type', 'button_click')
      .gte('created_at', startDate.toISOString());

    return NextResponse.json({
      pageViews: pageViews || 0,
      uniqueVisitors,
      formSubmissions: formSubmissions || 0,
      buttonClicks: buttonClicks || 0,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      trafficOverTime: trafficData || [],
      deviceBreakdown,
      topSources,
      dateRange: {
        start: startDate.toISOString(),
        end: new Date().toISOString(),
        days,
      },
    });
  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
