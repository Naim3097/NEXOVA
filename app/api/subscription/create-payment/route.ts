import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createLeanXPayment, getLeanXBankList } from '@/lib/leanx';
import { validateCsrf, CSRF_ERROR_RESPONSE } from '@/lib/csrf';
import { rateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

const PREMIUM_PRICE = 79; // RM79 per month

export async function POST(request: NextRequest) {
  try {
    // Validate CSRF protection
    if (!validateCsrf(request)) {
      return NextResponse.json(CSRF_ERROR_RESPONSE, { status: 403 });
    }

    // Rate limit payment requests - prevent abuse
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(
      `subscription-payment:${clientId}`,
      RATE_LIMITS.STRICT
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many payment requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(
              Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)
            ),
          },
        }
      );
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
    const { plan, bankId } = body;

    // Validate plan
    if (plan !== 'premium') {
      return NextResponse.json(
        {
          error:
            'Invalid plan. Only "premium" plan is available for self-service.',
        },
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
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if user already has an active premium subscription
    if (
      profile.subscription_plan === 'premium' ||
      profile.subscription_plan === 'enterprise'
    ) {
      return NextResponse.json(
        {
          error:
            'You already have an active premium or enterprise subscription',
        },
        { status: 400 }
      );
    }

    // Get LeanX credentials from environment variables
    // Use the same credentials as the regular payment API (LEANX_AUTH_TOKEN, LEANX_COLLECTION_UUID)
    const systemAuthToken = process.env.LEANX_AUTH_TOKEN;
    const systemCollectionUuid = process.env.LEANX_COLLECTION_UUID;

    if (!systemAuthToken || !systemCollectionUuid) {
      console.error('CRITICAL: LeanX subscription credentials not configured');
      return NextResponse.json(
        {
          error:
            'Payment service temporarily unavailable. Please try again later.',
        },
        { status: 503 }
      );
    }

    // If no bankId provided, return bank list for selection
    if (!bankId) {
      const bankListResult = await getLeanXBankList(
        {
          authToken: systemAuthToken,
          collectionUuid: systemCollectionUuid,
        },
        { modelFilter: 1 } // B2C only for individual subscriptions
      );

      if (!bankListResult.success) {
        return NextResponse.json(
          { error: bankListResult.error || 'Failed to fetch bank list' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        requiresBankSelection: true,
        banks: bankListResult.banks,
        amount: PREMIUM_PRICE,
        currency: 'MYR',
      });
    }

    // Generate unique order ID
    const crypto = require('crypto');
    const randomString = crypto.randomBytes(8).toString('hex').toUpperCase();
    const orderId = `SUB-${Date.now()}-${randomString}`;

    // Create subscription record in pending state
    const currentDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Monthly subscription

    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan: 'premium',
        status: 'pending',
        amount: PREMIUM_PRICE,
        currency: 'MYR',
        billing_interval: 'monthly',
        current_period_start: currentDate.toISOString(),
        current_period_end: endDate.toISOString(),
        metadata: { order_id: orderId },
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      return NextResponse.json(
        { error: 'Failed to create subscription record' },
        { status: 500 }
      );
    }

    // Create LeanX payment
    // Use origin header so return URL matches the domain the user is on (staging vs production)
    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3001';
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || origin}/api/subscription/webhook`;
    // Return URL - user will be redirected here after payment (success or cancel)
    const returnUrl = `${origin}/dashboard/subscription?order=${orderId}`;

    console.log('[Subscription Payment] Creating LeanX payment:', {
      orderId,
      amount: PREMIUM_PRICE,
      bankId,
      customerEmail: user.email,
      customerName:
        profile.display_name || user.email?.split('@')[0] || 'Customer',
      customerPhone: profile.phone || '',
      callbackUrl,
      returnUrl,
      collectionUuid: systemCollectionUuid,
      authTokenLength: systemAuthToken?.length,
    });

    const leanxResult = await createLeanXPayment(
      {
        authToken: systemAuthToken,
        collectionUuid: systemCollectionUuid,
      },
      {
        orderId,
        amount: PREMIUM_PRICE,
        currency: 'MYR',
        productName: 'XIDE Premium Subscription',
        productDescription:
          'Monthly Premium Plan - Unlimited projects, custom domains, analytics & more',
        customerEmail: user.email,
        customerName:
          profile.display_name || user.email?.split('@')[0] || 'Customer',
        customerPhone: profile.phone || '0000000000', // LeanX requires a non-empty phone number
        callbackUrl,
        returnUrl,
        paymentServiceId: bankId,
      }
    );

    if (!leanxResult.success) {
      console.error('[Subscription Payment] LeanX payment failed:', {
        error: leanxResult.error,
        orderId,
      });

      // Update subscription to failed
      await supabase
        .from('subscriptions')
        .update({ status: 'failed' })
        .eq('id', subscription.id);

      return NextResponse.json(
        { error: leanxResult.error || 'Failed to create payment session' },
        { status: 400 }
      );
    }

    // Update subscription with LeanX transaction ID
    await supabase
      .from('subscriptions')
      .update({
        leanx_subscription_id: leanxResult.transactionId,
        metadata: {
          order_id: orderId,
          leanx_bill_no: leanxResult.transactionId,
        },
      })
      .eq('id', subscription.id);

    // Return payment URL for redirect
    return NextResponse.json({
      success: true,
      paymentUrl: leanxResult.paymentUrl,
      orderId,
      amount: PREMIUM_PRICE,
      currency: 'MYR',
    });
  } catch (error) {
    console.error('Subscription payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
