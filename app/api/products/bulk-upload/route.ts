import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface BulkProduct {
  code: string;
  name: string;
  description?: string;
  image_url?: string;
  stock?: number;
  base_price: number;
  currency?: string;
  quantity_pricing?: Array<{ min_qty: number; price: number }>;
  notes?: string;
  status?: 'active' | 'inactive';
}

// POST bulk upload products
export async function POST(request: NextRequest) {
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
    const { products } = body as { products: BulkProduct[] };

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'No products provided' },
        { status: 400 }
      );
    }

    // Validate and prepare products
    const errors: Array<{ row: number; error: string }> = [];
    const validProducts: Array<{
      user_id: string;
      code: string;
      name: string;
      description: string | null;
      image_url: string | null;
      stock: number;
      base_price: number;
      currency: string;
      quantity_pricing: Array<{ min_qty: number; price: number }>;
      notes: string | null;
      status: 'active' | 'inactive';
    }> = [];

    products.forEach((product, index) => {
      const rowNum = index + 2; // Excel row (1 is header)

      // Validate required fields
      if (!product.code || typeof product.code !== 'string') {
        errors.push({ row: rowNum, error: 'Product code is required' });
        return;
      }
      if (!product.name || typeof product.name !== 'string') {
        errors.push({ row: rowNum, error: 'Product name is required' });
        return;
      }
      if (product.base_price === undefined || product.base_price === null || isNaN(Number(product.base_price))) {
        errors.push({ row: rowNum, error: 'Base price is required and must be a number' });
        return;
      }

      // Prepare valid product
      validProducts.push({
        user_id: user.id,
        code: String(product.code).trim(),
        name: String(product.name).trim(),
        description: product.description ? String(product.description).trim() : null,
        image_url: product.image_url ? String(product.image_url).trim() : null,
        stock: Number(product.stock) || 0,
        base_price: Number(product.base_price),
        currency: product.currency ? String(product.currency).trim() : 'RM',
        quantity_pricing: Array.isArray(product.quantity_pricing) ? product.quantity_pricing : [],
        notes: product.notes ? String(product.notes).trim() : null,
        status: product.status === 'inactive' ? 'inactive' : 'active',
      });
    });

    // If there are validation errors, return them
    if (errors.length > 0 && validProducts.length === 0) {
      return NextResponse.json(
        {
          error: 'All products have validation errors',
          validationErrors: errors
        },
        { status: 400 }
      );
    }

    // Insert valid products
    const { data: insertedProducts, error: insertError } = await supabase
      .from('products')
      .insert(validProducts)
      .select();

    if (insertError) {
      console.error('Error inserting products:', insertError);

      // Check for duplicate code error
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Some product codes already exist. Please use unique codes.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to insert products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${insertedProducts?.length || 0} products`,
      inserted: insertedProducts?.length || 0,
      errors: errors.length > 0 ? errors : undefined,
      skipped: errors.length,
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/products/bulk-upload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
