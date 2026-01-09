import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { processLeanXSubscription } from '@/lib/leanx';
import { validateCsrf, CSRF_ERROR_RESPONSE } from '@/lib/csrf';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { plan, billing_interval, payment_method, email } = body;

    // Validate input
    if (!plan || !billing_interval || !payment_method) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (plan !== 'pro') {
      return NextResponse.json(
        { error: 'Invalid plan. Only "pro" plan requires payment.' },
        { status: 400 }
      );
    }

    if (!['monthly', 'yearly'].includes(billing_interval)) {
      return NextResponse.json(
        { error: 'Invalid billing interval' },
        { status: 400 }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Check if user already has an active pro subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('plan', 'pro')
      .in('status', ['active', 'trialing'])
      .maybeSingle();

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'You already have an active Pro subscription' },
        { status: 400 }
      );
    }

    // Calculate amount
    const amount = billing_interval === 'monthly' ? 29.0 : 290.0;

    // Process payment through LeanX
    const leanxResult = await processLeanXSubscription({
      user_id: user.id,
      plan,
      amount,
      currency: 'MYR',
      billing_interval,
      payment_method,
      email: email || user.email,
      leanx_api_key: process.env.LEANX_API_KEY || profile.leanx_api_key,
      leanx_secret_key: process.env.LEANX_SECRET_KEY || profile.leanx_secret_key,
    });

    if (!leanxResult.success) {
      return NextResponse.json(
        { error: leanxResult.error || 'Payment processing failed' },
        { status: 400 }
      );
    }

    // Calculate period dates
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date();
    if (billing_interval === 'monthly') {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    } else {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    }

    // Create subscription record
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan,
        status: 'active',
        amount,
        currency: 'MYR',
        billing_interval,
        leanx_subscription_id: leanxResult.subscription_id,
        leanx_customer_id: leanxResult.customer_id,
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }

    // Generate invoice number
    const { data: invoiceNumberData } = await supabase
      .rpc('generate_invoice_number');

    const invoiceNumber = invoiceNumberData || `INV-${Date.now()}`;

    // Create billing history record
    await supabase.from('billing_history').insert({
      user_id: user.id,
      subscription_id: subscription.id,
      invoice_number: invoiceNumber,
      description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - ${
        billing_interval === 'monthly' ? 'Monthly' : 'Yearly'
      } Subscription`,
      amount,
      currency: 'MYR',
      status: 'paid',
      payment_method: 'credit_card',
      leanx_transaction_id: leanxResult.transaction_id,
      invoice_date: new Date().toISOString(),
      paid_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      subscription,
      message: 'Subscription created successfully',
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
