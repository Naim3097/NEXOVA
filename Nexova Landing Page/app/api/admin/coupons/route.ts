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

// GET - List all coupons
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'active', 'inactive', 'all'
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Use admin client to bypass RLS
    const adminClient = getSupabaseAdmin();

    // Build query
    let query = adminClient
      .from('coupons')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }
    // 'all' or no status = no filter

    const { data: coupons, error, count } = await query;

    if (error) {
      console.error('Error fetching coupons:', error);
      return NextResponse.json(
        { error: 'Failed to fetch coupons' },
        { status: 500 }
      );
    }

    // Calculate stats
    const totalCoupons = count || 0;
    const activeCoupons =
      coupons?.filter((c: { is_active: boolean }) => c.is_active).length || 0;
    const totalRedemptions =
      coupons?.reduce(
        (sum: number, c: { used_count?: number }) => sum + (c.used_count || 0),
        0
      ) || 0;

    return NextResponse.json({
      success: true,
      coupons,
      stats: {
        totalCoupons,
        activeCoupons,
        totalRedemptions,
      },
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Admin coupons error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new coupon
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

    // Check if user is admin
    if (!isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
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

    // Validate required fields
    if (!code || !discount_type || discount_value === undefined) {
      return NextResponse.json(
        {
          error: 'Missing required fields: code, discount_type, discount_value',
        },
        { status: 400 }
      );
    }

    // Validate code format
    if (typeof code !== 'string' || code.length > MAX_CODE_LENGTH) {
      return NextResponse.json(
        {
          error: `Code must be a string with max ${MAX_CODE_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

    // Validate discount_type
    if (!VALID_DISCOUNT_TYPES.includes(discount_type)) {
      return NextResponse.json(
        {
          error: `Invalid discount_type. Must be one of: ${VALID_DISCOUNT_TYPES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate discount_value
    const numericValue = parseFloat(discount_value);
    if (isNaN(numericValue) || numericValue <= 0) {
      return NextResponse.json(
        { error: 'discount_value must be a positive number' },
        { status: 400 }
      );
    }

    // For percentage, max is 100
    if (discount_type === 'percentage' && numericValue > 100) {
      return NextResponse.json(
        { error: 'Percentage discount cannot exceed 100%' },
        { status: 400 }
      );
    }

    // Validate description length if provided
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

    // Validate max_uses if provided
    if (max_uses !== undefined && max_uses !== null) {
      const maxUsesNum = parseInt(max_uses);
      if (isNaN(maxUsesNum) || maxUsesNum < 1) {
        return NextResponse.json(
          {
            error: 'max_uses must be a positive integer or null for unlimited',
          },
          { status: 400 }
        );
      }
    }

    // Validate dates if provided
    if (valid_from && isNaN(Date.parse(valid_from))) {
      return NextResponse.json(
        { error: 'Invalid valid_from date format' },
        { status: 400 }
      );
    }

    if (valid_until && isNaN(Date.parse(valid_until))) {
      return NextResponse.json(
        { error: 'Invalid valid_until date format' },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS
    const adminClient = getSupabaseAdmin();

    // Check if code already exists
    const { data: existingCoupon } = await adminClient
      .from('coupons')
      .select('id')
      .eq('code', code.toUpperCase())
      .single();

    if (existingCoupon) {
      return NextResponse.json(
        { error: 'A coupon with this code already exists' },
        { status: 400 }
      );
    }

    // Create coupon
    const couponData = {
      code: code.toUpperCase(),
      description: description || null,
      discount_type,
      discount_value: numericValue,
      max_uses: max_uses ? parseInt(max_uses) : null,
      used_count: 0,
      valid_from: valid_from || new Date().toISOString(),
      valid_until: valid_until || null,
      applicable_plans: applicable_plans || ['premium'],
      is_active: is_active !== undefined ? is_active : true,
      created_by: user.id,
    };

    const { data: newCoupon, error: insertError } = await adminClient
      .from('coupons')
      .insert(couponData)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating coupon:', insertError);
      return NextResponse.json(
        { error: 'Failed to create coupon' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        coupon: newCoupon,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin create coupon error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
