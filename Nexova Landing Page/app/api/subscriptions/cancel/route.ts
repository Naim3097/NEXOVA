import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { cancelLeanXSubscription } from '@/lib/leanx';

export async function POST(request: NextRequest) {
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

    // Get user's active subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .eq('plan', 'pro')
      .maybeSingle();

    if (subscriptionError || !subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Get profile for LeanX credentials
    const { data: profile } = await supabase
      .from('profiles')
      .select('leanx_api_key, leanx_secret_key')
      .eq('id', user.id)
      .single();

    // Cancel subscription with LeanX if we have a subscription ID
    if (subscription.leanx_subscription_id) {
      await cancelLeanXSubscription({
        subscription_id: subscription.leanx_subscription_id,
        leanx_api_key: process.env.LEANX_API_KEY || profile?.leanx_api_key,
        leanx_secret_key: process.env.LEANX_SECRET_KEY || profile?.leanx_secret_key,
      });
    }

    // Update subscription status
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        ended_at: subscription.current_period_end, // Will be downgraded at end of billing period
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 500 }
      );
    }

    // Update profile status (but keep plan active until period ends)
    await supabase
      .from('profiles')
      .update({
        subscription_status: 'cancelled',
        subscription_cancelled_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled. You will retain Pro features until the end of your billing period.',
      ends_at: subscription.current_period_end,
    });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
