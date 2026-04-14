import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * POST /api/payments/test-create
 * Create a test payment for payment settings testing
 * Uses current user's LeanX credentials
 */
export async function POST(request: NextRequest) {
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

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // Get user's LeanX credentials
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('leanx_api_key, leanx_collection_uuid, leanx_enabled')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        {
          success: false,
          error: 'User profile not found',
        },
        { status: 404 }
      );
    }

    if (!profile.leanx_enabled || !profile.leanx_api_key || !profile.leanx_collection_uuid) {
      return NextResponse.json(
        {
          success: false,
          error: 'LeanX payment gateway not configured',
        },
        { status: 400 }
      );
    }

    // Get request body
    const body = await request.json();
    const {
      payment_service_id,
      amount,
      invoice_ref,
      full_name,
      email,
      phone_number,
      redirect_url,
      callback_url,
    } = body;

    // Validate required fields
    if (!payment_service_id || !amount || !invoice_ref) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Prepare payload for LeanX
    const payload = {
      collection_uuid: profile.leanx_collection_uuid,
      payment_service_id,
      amount,
      invoice_ref,
      full_name: full_name || 'Test User',
      email: email || 'test@example.com',
      phone_number: phone_number || '0123456789',
      redirect_url: redirect_url || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?test=true`,
      callback_url: callback_url || `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
    };

    console.log('Creating test payment with payload:', payload);

    // Call LeanX API
    const leanxResponse = await fetch('https://api.leanx.io/api/v1/merchant/create-bill-silent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': profile.leanx_api_key,
      },
      body: JSON.stringify(payload),
    });

    const leanxData = await leanxResponse.json();

    console.log('LeanX payment creation response:', leanxData);

    if (leanxData.response_code === 2000 && leanxData.data?.redirect_url) {
      return NextResponse.json({
        success: true,
        redirect_url: leanxData.data.redirect_url,
        data: leanxData.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: leanxData.message || leanxData.description || 'Payment creation failed',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Test payment creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
