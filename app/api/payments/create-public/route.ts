import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/payments/create-public
 * Create payment for published pages (no auth required, uses project_id to get user credentials)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      project_id,
      product_id,
      product_name,
      product_price,
      payment_service_id,
      customer_name,
      customer_email,
      customer_phone,
    } = body;

    // Validate required fields
    if (!project_id || !product_name || !product_price || !payment_service_id) {
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

    // Generate unique invoice reference
    const invoiceRef = `INV-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Get the origin for redirect URLs
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Prepare payload for LeanX
    const leanxPayload = {
      collection_uuid: profile.leanx_collection_uuid,
      payment_service_id: parseInt(payment_service_id),
      amount: parseFloat(product_price).toFixed(2),
      invoice_ref: invoiceRef,
      full_name: customer_name || 'Customer',
      email: customer_email || '',
      phone_number: customer_phone || '',
      redirect_url: `${origin}/payment/success?order=${invoiceRef}`,
      callback_url: `${origin}/api/payments/webhook`,
    };

    console.log('Creating payment for published page:', {
      project_id,
      product_name,
      invoice_ref: invoiceRef,
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
      full_response: leanxData,
    });

    console.log('LeanX payload sent:', leanxPayload);

    if (leanxData.response_code === 2000 && leanxData.data?.redirect_url) {
      // Create transaction record in database
      await supabase.from('transactions').insert({
        user_id: project.user_id,
        project_id: project_id,
        transaction_id: leanxData.data.bill_no || invoiceRef,
        order_id: invoiceRef,
        product_name: product_name,
        product_description: null,
        amount: parseFloat(product_price),
        currency: 'MYR',
        has_bump_offer: false,
        bump_offer_accepted: false,
        total_amount: parseFloat(product_price),
        customer_name: customer_name,
        customer_email: customer_email,
        customer_phone: customer_phone,
        status: 'pending',
        payment_method: payment_service_id.toString(),
        leanx_payment_url: leanxData.data.redirect_url,
        leanx_response: leanxData,
      });

      return NextResponse.json({
        success: true,
        redirect_url: leanxData.data.redirect_url,
        invoice_ref: invoiceRef,
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
    console.error('Payment creation error:', error);
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
