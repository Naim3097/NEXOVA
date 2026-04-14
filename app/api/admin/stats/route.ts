import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { isAdminEmail } from '@/lib/admin';
import { getSupabaseAdmin } from '@/lib/supabase/server';

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

    // Use admin client to bypass RLS for admin queries
    const adminClient = getSupabaseAdmin();

    // Get admin stats using RPC function
    const { data: stats, error: statsError } =
      await adminClient.rpc('get_admin_stats');

    if (statsError) {
      console.error('Error fetching admin stats:', statsError);

      // Fallback: fetch stats manually if RPC fails (using admin client to bypass RLS)
      const [
        { count: totalUsers },
        { count: freeUsers },
        { count: premiumUsers },
        { count: enterpriseUsers },
        { count: newHelpRequests },
        { count: totalHelpRequests },
        { count: newSignupsToday },
        { count: newSignupsWeek },
      ] = await Promise.all([
        adminClient
          .from('profiles')
          .select('*', { count: 'exact', head: true }),
        adminClient
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .or('subscription_plan.eq.free,subscription_plan.is.null'),
        adminClient
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('subscription_plan', 'premium'),
        adminClient
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('subscription_plan', 'enterprise'),
        adminClient
          .from('help_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new'),
        adminClient
          .from('help_requests')
          .select('*', { count: 'exact', head: true }),
        adminClient
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date().toISOString().split('T')[0]),
        adminClient
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte(
            'created_at',
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          ),
      ]);

      return NextResponse.json({
        success: true,
        stats: {
          total_users: totalUsers || 0,
          free_users: freeUsers || 0,
          premium_users: premiumUsers || 0,
          enterprise_users: enterpriseUsers || 0,
          new_help_requests: newHelpRequests || 0,
          total_help_requests: totalHelpRequests || 0,
          new_signups_today: newSignupsToday || 0,
          new_signups_week: newSignupsWeek || 0,
          active_subscriptions: (premiumUsers || 0) + (enterpriseUsers || 0),
          monthly_revenue: 0, // Would need billing_history query
        },
      });
    }

    return NextResponse.json({
      success: true,
      stats: stats?.[0] || stats,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
