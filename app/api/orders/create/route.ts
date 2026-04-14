import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  amount: number;
}

/**
 * POST /api/orders/create
 * Create order and payment for form with payment element (no auth required)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      project_id,
      element_id,
      customer_name,
      customer_email,
      customer_phone,
      items,
      subtotal,
      gateway_fee,
      total,
      payment_method,
    } = body;

    // Validate required fields
    if (!project_id || !items || items.length === 0 || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get project to find user
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get user's LeanX credentials
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('leanx_api_key, leanx_collection_uuid, leanx_enabled')
      .eq('id', project.user_id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    if (!profile.leanx_enabled || !profile.leanx_api_key || !profile.leanx_collection_uuid) {
      return NextResponse.json(
        { error: 'Payment gateway not configured for this page' },
        { status: 400 }
      );
    }

    // Generate unique order/invoice reference
    const invoiceRef = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Build product name from items
    const productName = (items as OrderItem[])
      .map((item: OrderItem) => `${item.name} x${item.quantity}`)
      .join(', ');

    // Get the origin and referer for redirect URLs
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const referer = request.headers.get('referer') || origin;

    // Redirect back to the sales page where customer came from
    const redirectUrl = referer.includes('?')
      ? `${referer}&order=${invoiceRef}`
      : `${referer}?order=${invoiceRef}`;

    // Map payment method to LeanX payment service ID
    // FPX = 1, DuitNow QR = 2 (these are example values, check LeanX docs for actual IDs)
    const paymentServiceId = payment_method === 'fpx' ? 1 : 2;

    // Prepare payload for LeanX
    const leanxPayload = {
      collection_uuid: profile.leanx_collection_uuid,
      payment_service_id: paymentServiceId,
      amount: parseFloat(total).toFixed(2),
      invoice_ref: invoiceRef,
      full_name: customer_name || 'Customer',
      email: customer_email && customer_email.trim() ? customer_email.trim() : 'noreply@customer.com',
      phone_number: customer_phone && customer_phone.trim() ? customer_phone.trim() : '60123456789',
      redirect_url: redirectUrl,
      callback_url: `${origin}/api/payments/webhook`,
    };

    console.log('Creating order payment:', {
      project_id,
      element_id,
      invoice_ref: invoiceRef,
      items_count: items.length,
      total,
    });

    // Call LeanX API to create payment
    const leanxResponse = await fetch('https://api.leanx.io/api/v1/merchant/create-bill-silent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': profile.leanx_api_key,
      },
      body: JSON.stringify(leanxPayload),
    });

    const leanxData = await leanxResponse.json();

    console.log('LeanX response:', {
      response_code: leanxData.response_code,
      has_redirect_url: !!leanxData.data?.redirect_url,
    });

    if (leanxData.response_code === 2000 && leanxData.data?.redirect_url) {
      // Create transaction record in database
      await supabase.from('transactions').insert({
        user_id: project.user_id,
        project_id: project_id,
        transaction_id: leanxData.data.bill_no || invoiceRef,
        order_id: invoiceRef,
        product_name: productName,
        product_description: JSON.stringify(items), // Store items as JSON
        amount: parseFloat(subtotal),
        currency: 'MYR',
        has_bump_offer: false,
        bump_offer_accepted: false,
        total_amount: parseFloat(total),
        customer_name: customer_name,
        customer_email: customer_email,
        customer_phone: customer_phone,
        status: 'pending',
        payment_method: payment_method,
        leanx_payment_url: leanxData.data.redirect_url,
        leanx_response: leanxData,
      });

      return NextResponse.json({
        success: true,
        payment_url: leanxData.data.redirect_url,
        order_id: invoiceRef,
      });
    } else {
      console.error('LeanX payment creation failed:', leanxData);
      return NextResponse.json(
        {
          success: false,
          error: leanxData.description || leanxData.message || 'Payment creation failed',
          details: leanxData,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
