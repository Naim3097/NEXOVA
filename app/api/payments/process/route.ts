import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { processLeanXPayment } from '@/lib/leanx';
import { validateCsrf, CSRF_ERROR_RESPONSE } from '@/lib/csrf';

export async function POST(request: NextRequest) {
  try {
    // Validate CSRF protection
    if (!validateCsrf(request)) {
      return NextResponse.json(CSRF_ERROR_RESPONSE, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    const body = await request.json();

    // ⚠️ CRITICAL SECURITY WARNING ⚠️
    // This endpoint handles raw credit card data which is a PCI-DSS compliance violation
    // See SECURITY_WARNING_PAYMENT.md for detailed information and recommended fixes
    // DO NOT USE IN PRODUCTION - Use LeanX hosted checkout or tokenization instead
    const {
      transactionId,
      cardNumber,
      expiryDate,
      cvv,
    } = body;

    // Validation
    if (!transactionId || !cardNumber || !expiryDate || !cvv) {
      return NextResponse.json(
        { error: 'Missing required payment details' },
        { status: 400 }
      );
    }

    // Get transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('*, projects(user_id)')
      .eq('id', transactionId)
      .single();

    if (transactionError || !transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Check if already processed
    if (transaction.status === 'completed') {
      return NextResponse.json(
        { error: 'Transaction already completed' },
        { status: 400 }
      );
    }

    // Get user's LeanX credentials
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('leanx_api_key, leanx_secret_key, leanx_merchant_id')
      .eq('id', transaction.projects.user_id)
      .single();

    if (profileError || !profile || !profile.leanx_api_key) {
      return NextResponse.json(
        { error: 'LeanX credentials not found' },
        { status: 400 }
      );
    }

    // Update transaction status to processing
    await supabase
      .from('transactions')
      .update({ status: 'processing' })
      .eq('id', transactionId);

    // Process payment with LeanX
    const paymentResult = await processLeanXPayment(
      {
        apiKey: profile.leanx_api_key,
        secretKey: profile.leanx_secret_key,
        merchantId: profile.leanx_merchant_id,
      },
      transaction.transaction_id,
      {
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv,
      }
    );

    if (!paymentResult.success) {
      // Payment failed
      await supabase
        .from('transactions')
        .update({
          status: 'failed',
          leanx_response: paymentResult,
        })
        .eq('id', transactionId);

      return NextResponse.json({
        success: false,
        error: paymentResult.error || 'Payment failed',
        status: 'failed',
      });
    }

    // Payment successful
    await supabase
      .from('transactions')
      .update({
        status: 'completed',
        transaction_id: paymentResult.transactionId || transaction.transaction_id,
        completed_at: new Date().toISOString(),
        leanx_response: paymentResult,
      })
      .eq('id', transactionId);

    // TODO: Send confirmation email to customer
    // TODO: Send notification email to merchant

    return NextResponse.json({
      success: true,
      transactionId: paymentResult.transactionId,
      status: 'completed',
      message: 'Payment processed successfully',
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}
