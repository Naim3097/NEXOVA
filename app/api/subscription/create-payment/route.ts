import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createLeanXPayment, getLeanXBankList } from '@/lib/leanx';
import { validateCsrf, CSRF_ERROR_RESPONSE } from '@/lib/csrf';
import { rateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { getSupabaseAdmin } from '@/lib/supabase/server';

const PREMIUM_PRICE = 79; // RM79 per month

// Helper function to validate coupon server-side
async function validateCouponForPayment(
  couponCode: string,
  userId: string,
  plan: string
): Promise<{
  valid: boolean;
  coupon?: any;
  discountAmount?: number;
  finalAmount?: number;
  message?: string;
}> {
  const adminClient = getSupabaseAdmin();
  const normalizedCode = couponCode.trim().toUpperCase();

  // Find coupon by code
  const { data: coupon, error } = await adminClient
    .from('coupons')
    .select('*')
    .eq('code', normalizedCode)
    .single();

  if (error || !coupon) {
    return { valid: false, message: 'Invalid coupon code' };
  }

  if (!coupon.is_active) {
    return { valid: false, message: 'This coupon is no longer active' };
  }

  const now = new Date();
  const validFrom = new Date(coupon.valid_from);
  const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

  if (now < validFrom) {
    return { valid: false, message: 'This coupon is not yet active' };
  }

  if (validUntil && now > validUntil) {
    return { valid: false, message: 'This coupon has expired' };
  }

  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return { valid: false, message: 'This coupon has reached its usage limit' };
  }

  if (!coupon.applicable_plans.includes(plan)) {
    return {
      valid: false,
      message: 'This coupon cannot be used for the selected plan',
    };
  }

  // Check if user has already used this coupon
  const { data: existingUse } = await adminClient
    .from('coupon_uses')
    .select('id')
    .eq('coupon_id', coupon.id)
    .eq('user_id', userId)
    .single();

  if (existingUse) {
    return { valid: false, message: 'You have already used this coupon' };
  }

  // Calculate discount
  const originalAmount = PREMIUM_PRICE;
  let discountAmount: number;

  if (coupon.discount_type === 'percentage') {
    discountAmount =
      Math.round(((originalAmount * coupon.discount_value) / 100) * 100) / 100;
  } else {
    discountAmount = Math.min(coupon.discount_value, originalAmount);
  }

  const finalAmount = Math.max(0, originalAmount - discountAmount);

  return {
    valid: true,
    coupon,
    discountAmount,
    finalAmount,
  };
}

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
    const { plan, bankId, couponCode } = body;

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

    // Validate coupon if provided
    let validatedCoupon: {
      valid: boolean;
      coupon?: any;
      discountAmount?: number;
      finalAmount?: number;
      message?: string;
    } | null = null;

    if (couponCode) {
      validatedCoupon = await validateCouponForPayment(
        couponCode,
        user.id,
        plan
      );
      if (!validatedCoupon.valid) {
        return NextResponse.json(
          { error: validatedCoupon.message || 'Invalid coupon' },
          { status: 400 }
        );
      }
    }

    // Calculate final amount
    const finalAmount = validatedCoupon?.finalAmount ?? PREMIUM_PRICE;
    const discountAmount = validatedCoupon?.discountAmount ?? 0;

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

    // Handle 100% discount - free upgrade (no payment needed)
    if (finalAmount === 0 && validatedCoupon?.valid) {
      const adminClient = getSupabaseAdmin();
      const crypto = require('crypto');
      const randomString = crypto.randomBytes(8).toString('hex').toUpperCase();
      const orderId = `SUB-FREE-${Date.now()}-${randomString}`;

      // Create dates
      const currentDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // Monthly subscription

      // Create subscription record directly as active
      const { data: subscription, error: subscriptionError } = await adminClient
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan: 'premium',
          status: 'active',
          amount: 0,
          original_amount: PREMIUM_PRICE,
          discount_amount: discountAmount,
          coupon_id: validatedCoupon.coupon.id,
          currency: 'MYR',
          billing_interval: 'monthly',
          current_period_start: currentDate.toISOString(),
          current_period_end: endDate.toISOString(),
          metadata: {
            order_id: orderId,
            coupon_code: validatedCoupon.coupon.code,
            free_upgrade: true,
          },
        })
        .select()
        .single();

      if (subscriptionError) {
        console.error('Error creating free subscription:', subscriptionError);
        return NextResponse.json(
          { error: 'Failed to create subscription' },
          { status: 500 }
        );
      }

      // Update user profile to premium
      const { error: profileUpdateError } = await adminClient
        .from('profiles')
        .update({
          subscription_plan: 'premium',
          subscription_status: 'active',
        })
        .eq('id', user.id);

      if (profileUpdateError) {
        console.error('Error updating profile:', profileUpdateError);
      }

      // Record coupon usage
      await adminClient.from('coupon_uses').insert({
        coupon_id: validatedCoupon.coupon.id,
        user_id: user.id,
        subscription_id: subscription.id,
        original_amount: PREMIUM_PRICE,
        discount_amount: discountAmount,
        final_amount: 0,
      });

      // Increment coupon used_count
      await adminClient
        .from('coupons')
        .update({ used_count: validatedCoupon.coupon.used_count + 1 })
        .eq('id', validatedCoupon.coupon.id);

      // Create billing history record
      await adminClient.from('billing_history').insert({
        user_id: user.id,
        subscription_id: subscription.id,
        amount: 0,
        currency: 'MYR',
        description: `Premium Subscription (Free with ${validatedCoupon.coupon.code})`,
        status: 'paid',
        metadata: {
          order_id: orderId,
          coupon_code: validatedCoupon.coupon.code,
          original_amount: PREMIUM_PRICE,
          discount_amount: discountAmount,
        },
      });

      console.log('[Subscription] Free upgrade completed:', {
        userId: user.id,
        subscriptionId: subscription.id,
        couponCode: validatedCoupon.coupon.code,
      });

      return NextResponse.json({
        success: true,
        freeUpgrade: true,
        orderId,
        message: 'Your Premium subscription has been activated!',
      });
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
        amount: finalAmount,
        originalAmount: PREMIUM_PRICE,
        discountAmount: discountAmount,
        currency: 'MYR',
        couponApplied: validatedCoupon?.valid
          ? {
              code: validatedCoupon.coupon.code,
              discountType: validatedCoupon.coupon.discount_type,
              discountValue: validatedCoupon.coupon.discount_value,
            }
          : null,
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

    const subscriptionData: Record<string, any> = {
      user_id: user.id,
      plan: 'premium',
      status: 'pending',
      amount: finalAmount,
      currency: 'MYR',
      billing_interval: 'monthly',
      current_period_start: currentDate.toISOString(),
      current_period_end: endDate.toISOString(),
      metadata: {
        order_id: orderId,
        ...(validatedCoupon?.valid && {
          coupon_code: validatedCoupon.coupon.code,
          original_amount: PREMIUM_PRICE,
          discount_amount: discountAmount,
        }),
      },
    };

    // Add coupon fields if coupon was applied
    if (validatedCoupon?.valid) {
      subscriptionData.coupon_id = validatedCoupon.coupon.id;
      subscriptionData.original_amount = PREMIUM_PRICE;
      subscriptionData.discount_amount = discountAmount;
    }

    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
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

    // Build product description with discount info
    let productDescription =
      'Monthly Premium Plan - Unlimited projects, custom domains, analytics & more';
    if (validatedCoupon?.valid) {
      productDescription += ` (Discount: RM${discountAmount.toFixed(2)} with code ${validatedCoupon.coupon.code})`;
    }

    console.log('[Subscription Payment] Creating LeanX payment:', {
      orderId,
      amount: finalAmount,
      originalAmount: PREMIUM_PRICE,
      discountAmount,
      couponCode: validatedCoupon?.coupon?.code || null,
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
        amount: finalAmount,
        currency: 'MYR',
        productName: 'XIDE Premium Subscription',
        productDescription,
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
      amount: finalAmount,
      originalAmount: PREMIUM_PRICE,
      discountAmount: discountAmount,
      currency: 'MYR',
      couponApplied: validatedCoupon?.valid
        ? {
            code: validatedCoupon.coupon.code,
            discountType: validatedCoupon.coupon.discount_type,
            discountValue: validatedCoupon.coupon.discount_value,
          }
        : null,
    });
  } catch (error) {
    console.error('Subscription payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
