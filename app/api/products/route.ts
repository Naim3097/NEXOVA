import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ProductCreateSchema, safeValidateData, formatValidationErrors } from '@/lib/validation';

export const dynamic = 'force-dynamic';

// GET all products for current user
export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch products
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input with Zod
    const validationResult = safeValidateData(ProductCreateSchema, body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formatValidationErrors(validationResult.errors),
        },
        { status: 400 }
      );
    }

    const {
      code,
      name,
      description,
      image_url,
      stock,
      base_price,
      currency,
      quantity_pricing,
      notes,
      status,
    } = validationResult.data;

    // Create product
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        user_id: user.id,
        code,
        name,
        description: description || null,
        image_url: image_url || null,
        stock: stock || 0,
        base_price,
        currency: currency || 'RM',
        quantity_pricing: quantity_pricing || [],
        notes: notes || null,
        status: status || 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
