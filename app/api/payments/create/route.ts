import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { rateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { validateCsrf, CSRF_ERROR_RESPONSE } from '@/lib/csrf';
import { PaymentCreateSchema, safeValidateData, formatValidationErrors } from '@/lib/validation';
import { createLeanXPayment } from '@/lib/leanx';

export async function POST(request: NextRequest) {
  try {
    // Validate CSRF protection
    if (!validateCsrf(request)) {
      return NextResponse.json(CSRF_ERROR_RESPONSE, { status: 403 });
    }

    // Apply rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, RATE_LIMITS.STRICT);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          resetAt: new Date(rateLimitResult.resetAt).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS.STRICT.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
          },
        }
      );
    }

    const supabase = getSupabaseAdmin();
    const body = await request.json();

    // Validate input with Zod
    const validationResult = safeValidateData(PaymentCreateSchema, body);
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
      projectId,
      productName,
      productDescription,
      amount,
      currency,
      hasBumpOffer,
      bumpOfferName,
      bumpOfferAmount,
      bumpOfferAccepted,
      customerEmail,
      customerName,
      customerPhone,
    } = validationResult.data;

    // Get project and verify it exists
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id, name')
      .eq('id', projectId)
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

    // Check if LeanX is enabled and configured
    if (!profile.leanx_enabled || !profile.leanx_api_key || !profile.leanx_collection_uuid) {
      return NextResponse.json(
        { error: 'LeanX payment gateway not configured. Please configure your LeanX credentials in settings.' },
        { status: 400 }
      );
    }

    // Calculate total amount
    let totalAmount = amount;
    if (hasBumpOffer && bumpOfferAccepted && bumpOfferAmount) {
      totalAmount += bumpOfferAmount;
    }

    // Generate unique order ID using cryptographically secure random
    const crypto = require('crypto');
    const randomString = crypto.randomBytes(8).toString('hex').toUpperCase();
    const orderId = `ORD-${Date.now()}-${randomString}`;

    // Get IP address and user agent
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: project.user_id,
        project_id: projectId,
        transaction_id: orderId, // Will be updated with LeanX transaction ID
        order_id: orderId,
        product_name: productName,
        product_description: productDescription,
        amount: amount,
        currency: currency,
        has_bump_offer: hasBumpOffer || false,
        bump_offer_name: bumpOfferName,
        bump_offer_amount: bumpOfferAmount,
        bump_offer_accepted: bumpOfferAccepted || false,
        total_amount: totalAmount,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        status: 'pending',
        ip_address: ip,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      );
    }

    // Call LeanX API to create payment session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    const callbackUrl = `${baseUrl}/api/payments/webhook`;
    const returnUrl = `${baseUrl}/payment/success?order=${orderId}`;

    const leanxResult = await createLeanXPayment(
      {
        authToken: profile.leanx_api_key!,
        collectionUuid: profile.leanx_collection_uuid!,
      },
      {
        orderId,
        amount: totalAmount,
        currency,
        productName,
        productDescription,
        customerEmail,
        customerName,
        customerPhone,
        callbackUrl,
        returnUrl,
      }
    );

    if (!leanxResult.success) {
      // Update transaction to failed
      await supabase
        .from('transactions')
        .update({
          status: 'failed',
          error_message: leanxResult.error
        })
        .eq('id', transaction.id);

      return NextResponse.json(
        { error: leanxResult.error || 'Failed to create payment session' },
        { status: 400 }
      );
    }

    // Update transaction with LeanX bill_no
    await supabase
      .from('transactions')
      .update({ transaction_id: leanxResult.transactionId })
      .eq('id', transaction.id);

    // Return payment URL for redirect
    return NextResponse.json({
      success: true,
      paymentUrl: leanxResult.paymentUrl,
      transaction: {
        id: transaction.id,
        orderId: orderId,
        billNo: leanxResult.transactionId,
        amount: totalAmount,
        currency: currency,
        status: 'pending',
      },
      message: 'Payment session created successfully',
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
