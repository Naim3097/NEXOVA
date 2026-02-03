import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { isAdminEmail } from '@/lib/admin';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { validateCsrf, CSRF_ERROR_RESPONSE } from '@/lib/csrf';

// Input validation constants
const VALID_DISCOUNT_TYPES = ['percentage', 'fixed'] as const;
const MAX_CODE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 500;

// UUID validation regex
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET - Get single coupon with usage stats
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Validate id format
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid coupon ID format' },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS
    const adminClient = getSupabaseAdmin();

    // Get coupon
    const { data: coupon, error } = await adminClient
      .from('coupons')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    // Get usage history
    const { data: usageHistory } = await adminClient
      .from('coupon_uses')
      .select(
        `
        id,
        user_id,
        original_amount,
        discount_amount,
        final_amount,
        used_at,
        profiles:user_id (
          email,
          display_name
        )
      `
      )
      .eq('coupon_id', id)
      .order('used_at', { ascending: false })
      .limit(50);

    return NextResponse.json({
      success: true,
      coupon,
      usageHistory: usageHistory || [],
    });
  } catch (error) {
    console.error('Admin get coupon error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update coupon
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if user is admin
    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Validate id format
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid coupon ID format' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      code,
      description,
      discount_type,
      discount_value,
      max_uses,
      valid_from,
      valid_until,
      applicable_plans,
      is_active,
    } = body;

    // Build update object (only include provided fields)
    const updateData: Record<string, any> = {};

    if (code !== undefined) {
      if (typeof code !== 'string' || code.length > MAX_CODE_LENGTH) {
        return NextResponse.json(
          {
            error: `Code must be a string with max ${MAX_CODE_LENGTH} characters`,
          },
          { status: 400 }
        );
      }
      updateData.code = code.toUpperCase();
    }

    if (description !== undefined) {
      if (
        description &&
        typeof description === 'string' &&
        description.length > MAX_DESCRIPTION_LENGTH
      ) {
        return NextResponse.json(
          {
            error: `Description too long (max ${MAX_DESCRIPTION_LENGTH} characters)`,
          },
          { status: 400 }
        );
      }
      updateData.description = description || null;
    }

    if (discount_type !== undefined) {
      if (!VALID_DISCOUNT_TYPES.includes(discount_type)) {
        return NextResponse.json(
          {
            error: `Invalid discount_type. Must be one of: ${VALID_DISCOUNT_TYPES.join(', ')}`,
          },
          { status: 400 }
        );
      }
      updateData.discount_type = discount_type;
    }

    if (discount_value !== undefined) {
      const numericValue = parseFloat(discount_value);
      if (isNaN(numericValue) || numericValue <= 0) {
        return NextResponse.json(
          { error: 'discount_value must be a positive number' },
          { status: 400 }
        );
      }
      // For percentage, max is 100
      const effectiveDiscountType = discount_type || body.discount_type;
      if (effectiveDiscountType === 'percentage' && numericValue > 100) {
        return NextResponse.json(
          { error: 'Percentage discount cannot exceed 100%' },
          { status: 400 }
        );
      }
      updateData.discount_value = numericValue;
    }

    if (max_uses !== undefined) {
      if (max_uses === null) {
        updateData.max_uses = null;
      } else {
        const maxUsesNum = parseInt(max_uses);
        if (isNaN(maxUsesNum) || maxUsesNum < 1) {
          return NextResponse.json(
            {
              error:
                'max_uses must be a positive integer or null for unlimited',
            },
            { status: 400 }
          );
        }
        updateData.max_uses = maxUsesNum;
      }
    }

    if (valid_from !== undefined) {
      if (valid_from && isNaN(Date.parse(valid_from))) {
        return NextResponse.json(
          { error: 'Invalid valid_from date format' },
          { status: 400 }
        );
      }
      updateData.valid_from = valid_from;
    }

    if (valid_until !== undefined) {
      if (valid_until && isNaN(Date.parse(valid_until))) {
        return NextResponse.json(
          { error: 'Invalid valid_until date format' },
          { status: 400 }
        );
      }
      updateData.valid_until = valid_until;
    }

    if (applicable_plans !== undefined) {
      updateData.applicable_plans = applicable_plans;
    }

    if (is_active !== undefined) {
      updateData.is_active = is_active;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS
    const adminClient = getSupabaseAdmin();

    // If code is being changed, check for duplicates
    if (updateData.code) {
      const { data: existingCoupon } = await adminClient
        .from('coupons')
        .select('id')
        .eq('code', updateData.code)
        .neq('id', id)
        .single();

      if (existingCoupon) {
        return NextResponse.json(
          { error: 'A coupon with this code already exists' },
          { status: 400 }
        );
      }
    }

    // Update coupon
    const { data: updatedCoupon, error: updateError } = await adminClient
      .from('coupons')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating coupon:', updateError);
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Coupon not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to update coupon' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error('Admin update coupon error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete coupon
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if user is admin
    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Validate id format
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid coupon ID format' },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS
    const adminClient = getSupabaseAdmin();

    // Check if coupon exists and has been used
    const { data: coupon } = await adminClient
      .from('coupons')
      .select('id, used_count')
      .eq('id', id)
      .single();

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    // Warning if coupon has been used (but still allow delete)
    const hadUsage = coupon.used_count > 0;

    // Delete coupon (coupon_uses will cascade delete)
    const { error: deleteError } = await adminClient
      .from('coupons')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting coupon:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete coupon' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: hadUsage
        ? 'Coupon deleted. Note: This coupon had usage history which was also deleted.'
        : 'Coupon deleted successfully.',
    });
  } catch (error) {
    console.error('Admin delete coupon error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
