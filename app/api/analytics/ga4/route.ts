import { NextRequest, NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';
import { createClient } from '@/lib/supabase/server';
import { cache } from '@/lib/cache';

// Helper to refresh tokens if needed
async function getValidOAuth2Client(userId: string) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('ga4_access_token, ga4_refresh_token, ga4_token_expiry')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    throw new Error('GA4 credentials not found');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/ga4/callback`
  );

  oauth2Client.setCredentials({
    access_token: profile.ga4_access_token,
    refresh_token: profile.ga4_refresh_token,
    expiry_date: profile.ga4_token_expiry ? new Date(profile.ga4_token_expiry).getTime() : undefined,
  });

  // Check if token needs refresh
  if (profile.ga4_token_expiry && new Date(profile.ga4_token_expiry) < new Date()) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);

    // Update database with new tokens
    await supabase
      .from('profiles')
      .update({
        ga4_access_token: credentials.access_token,
        ga4_token_expiry: credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : null,
      })
      .eq('id', userId);
  }

  return oauth2Client;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const dateRange = searchParams.get('dateRange') || '7d'; // 7d, 30d, 90d
    const projectId = searchParams.get('projectId');

    // Get GA4 property ID from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('ga4_property_id, ga4_connected')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !profile.ga4_connected || !profile.ga4_property_id) {
      return NextResponse.json(
        { error: 'Google Analytics not connected' },
        { status: 400 }
      );
    }

    // Generate cache key (includes property ID so cache is invalidated when property changes)
    const cacheKey = `ga4:${user.id}:${profile.ga4_property_id}:${dateRange}:${projectId || 'all'}`;

    // Check cache first (6-hour TTL for analytics data)
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json({
        success: true,
        dateRange,
        data: cachedData,
        cached: true,
      });
    }

    // Get valid OAuth client
    const oauth2Client = await getValidOAuth2Client(user.id);

    // Initialize Analytics Data API client
    const analyticsDataClient = new BetaAnalyticsDataClient({
      authClient: oauth2Client as any,
    });

    // Calculate date range
    const endDate = 'today';
    let startDate = '7daysAgo';
    if (dateRange === '30d') startDate = '30daysAgo';
    else if (dateRange === '90d') startDate = '90daysAgo';

    // If projectId is provided, get the published URL to filter by
    let pagePathFilter = null;
    if (projectId) {
      const { data: project } = await supabase
        .from('projects')
        .select('slug, published_url')
        .eq('id', projectId)
        .single();

      if (project?.slug) {
        pagePathFilter = `/p/${project.slug}`;
      }
    }

    // Prepare dimension filter for specific project
    const dimensionFilter = pagePathFilter ? {
      filter: {
        fieldName: 'pagePath',
        stringFilter: {
          matchType: 'CONTAINS' as const,
          value: pagePathFilter,
        },
      },
    } : undefined;

    // Run reports
    const [overviewReport] = await analyticsDataClient.runReport({
      property: profile.ga4_property_id,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
      ],
      dimensionFilter,
    });

    const [trafficSourcesReport] = await analyticsDataClient.runReport({
      property: profile.ga4_property_id,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
      ],
      dimensionFilter,
      limit: 10,
    });

    const [conversionsReport] = await analyticsDataClient.runReport({
      property: profile.ga4_property_id,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'eventName' }],
      metrics: [
        { name: 'eventCount' },
      ],
      dimensionFilter: {
        andGroup: {
          expressions: [
            dimensionFilter?.filter,
            {
              filter: {
                fieldName: 'eventName',
                stringFilter: {
                  matchType: 'EXACT' as const,
                  value: 'purchase',
                },
              },
            },
          ].filter(Boolean) as any,
        },
      },
    });

    // Parse overview data
    const dailyStats = overviewReport.rows?.map((row: any) => ({
      date: row.dimensionValues?.[0].value,
      users: parseInt(row.metricValues?.[0].value || '0'),
      sessions: parseInt(row.metricValues?.[1].value || '0'),
      pageViews: parseInt(row.metricValues?.[2].value || '0'),
      bounceRate: parseFloat(row.metricValues?.[3].value || '0'),
    })) || [];

    // Calculate totals
    const totalUsers = dailyStats.reduce((sum, day) => sum + day.users, 0);
    const totalSessions = dailyStats.reduce((sum, day) => sum + day.sessions, 0);
    const totalPageViews = dailyStats.reduce((sum, day) => sum + day.pageViews, 0);
    const avgBounceRate = dailyStats.length > 0
      ? dailyStats.reduce((sum, day) => sum + day.bounceRate, 0) / dailyStats.length
      : 0;

    // Parse traffic sources
    const trafficSources = trafficSourcesReport.rows?.map((row: any) => ({
      source: row.dimensionValues?.[0].value || 'Unknown',
      users: parseInt(row.metricValues?.[0].value || '0'),
      sessions: parseInt(row.metricValues?.[1].value || '0'),
    })) || [];

    // Parse conversions
    const conversions = parseInt(conversionsReport.rows?.[0]?.metricValues?.[0].value || '0');

    const responseData = {
      overview: {
        totalUsers,
        totalSessions,
        totalPageViews,
        avgBounceRate: Math.round(avgBounceRate * 100) / 100,
        conversions,
      },
      dailyStats,
      trafficSources,
    };

    // Cache the response for 6 hours (21600 seconds)
    cache.set(cacheKey, responseData, 21600);

    return NextResponse.json({
      success: true,
      dateRange,
      data: responseData,
      cached: false,
    });
  } catch (error) {
    console.error('Error fetching GA4 data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
