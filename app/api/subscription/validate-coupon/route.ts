import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { rateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

const PREMIUM_PRICE = 79; // RM79 per month

export async function POST(request: NextRequest) {
  try {
    // Rate limit coupon validation - prevent brute-force attempts
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(
      `coupon-validate:${clientId}`,
      RATE_LIMITS.MODERATE // 10 requests per minute
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          valid: false,
          message: 'Too many requests. Please try again later.',
        },
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
      return NextResponse.json(
        { valid: false, message: 'Please log in to use a coupon' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { coupon_code, plan } = body;

    // Validate required fields
    if (!coupon_code || typeof coupon_code !== 'string') {
      return NextResponse.json(
        { valid: false, message: 'Please enter a coupon code' },
        { status: 400 }
      );
    }

    if (!plan || plan !== 'premium') {
      return NextResponse.json(
        { valid: false, message: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Normalize coupon code
    const normalizedCode = coupon_code.trim().toUpperCase();

    // Use admin client to bypass RLS for full coupon access
    const adminClient = getSupabaseAdmin();

    // Find coupon by code
    const { data: coupon, error: couponError } = await adminClient
      .from('coupons')
      .select('*')
      .eq('code', normalizedCode)
      .single();

    if (couponError || !coupon) {
      return NextResponse.json({
        valid: false,
        message: 'Invalid coupon code',
      });
    }

    // Check if coupon is active
    if (!coupon.is_active) {
      return NextResponse.json({
        valid: false,
        message: 'This coupon is no longer active',
      });
    }

    // Check valid date range
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

    if (now < validFrom) {
      return NextResponse.json({
        valid: false,
        message: 'This coupon is not yet active',
      });
    }

    if (validUntil && now > validUntil) {
      return NextResponse.json({
        valid: false,
        message: 'This coupon has expired',
      });
    }

    // Check usage limit
    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({
        valid: false,
        message: 'This coupon has reached its usage limit',
      });
    }

    // Check if plan is applicable
    if (!coupon.applicable_plans.includes(plan)) {
      return NextResponse.json({
        valid: false,
        message: 'This coupon cannot be used for the selected plan',
      });
    }

    // Check if user has already used this coupon
    const { data: existingUse } = await adminClient
      .from('coupon_uses')
      .select('id')
      .eq('coupon_id', coupon.id)
      .eq('user_id', user.id)
      .single();

    if (existingUse) {
      return NextResponse.json({
        valid: false,
        message: 'You have already used this coupon',
      });
    }

    // Calculate discount
    const originalAmount = PREMIUM_PRICE;
    let discountAmount: number;

    if (coupon.discount_type === 'percentage') {
      discountAmount =
        Math.round(((originalAmount * coupon.discount_value) / 100) * 100) /
        100;
    } else {
      // Fixed amount discount
      discountAmount = Math.min(coupon.discount_value, originalAmount);
    }

    // Calculate final amount (minimum 0)
    const finalAmount = Math.max(0, originalAmount - discountAmount);

    return NextResponse.json({
      valid: true,
      coupon_id: coupon.id,
      coupon_code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_amount: discountAmount,
      original_amount: originalAmount,
      final_amount: finalAmount,
      message:
        finalAmount === 0
          ? 'Coupon applied! Your upgrade is free!'
          : `Coupon applied! You save RM${discountAmount.toFixed(2)}`,
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { valid: false, message: 'Error validating coupon' },
      { status: 500 }
    );
  }
}
