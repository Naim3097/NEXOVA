import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { isAdminEmail } from '@/lib/admin';

export async function POST(request: NextRequest) {
  // Use service role client to bypass RLS
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Create supabase client for auth
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

    // Check if requester is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { email, subscription_plan, subscription_status } =
      await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const validPlans = ['free', 'premium', 'enterprise'];
    if (subscription_plan && !validPlans.includes(subscription_plan)) {
      return NextResponse.json(
        { error: 'Invalid subscription plan' },
        { status: 400 }
      );
    }

    const validStatuses = ['active', 'cancelled', 'past_due', 'inactive'];
    if (subscription_status && !validStatuses.includes(subscription_status)) {
      return NextResponse.json(
        { error: 'Invalid subscription status' },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: Record<string, string> = {
      updated_at: new Date().toISOString(),
    };

    if (subscription_plan) {
      updateData.subscription_plan = subscription_plan;
    }
    if (subscription_status) {
      updateData.subscription_status = subscription_status;
    }

    // Update user profile using service role
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('email', email)
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription:', error);
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${email} to ${subscription_plan || 'unchanged'} plan`,
      data: {
        email: data.email,
        subscription_plan: data.subscription_plan,
        subscription_status: data.subscription_status,
      },
    });
  } catch (error) {
    console.error('Admin update subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
