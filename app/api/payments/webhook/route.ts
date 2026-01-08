import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { validateLeanXWebhook } from '@/lib/leanx';
import { rateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (lenient for webhooks from trusted sources)
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, RATE_LIMITS.LENIENT);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          resetAt: new Date(rateLimitResult.resetAt).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS.LENIENT.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
          },
        }
      );
    }

    const supabase = getSupabaseAdmin();
    const body = await request.text();
    const signature = request.headers.get('x-leanx-signature') || '';

    // Parse the webhook payload
    const payload = JSON.parse(body);
    const {
      event,
      transaction_id,
      order_id,
      status,
      amount,
      currency,
      payment_method,
    } = payload;

    // Get transaction by order_id or transaction_id using parameterized queries
    // Try transaction_id first
    let transaction = null;
    let transactionError = null;

    if (transaction_id) {
      const result = await supabase
        .from('transactions')
        .select('*, projects(user_id)')
        .eq('transaction_id', transaction_id)
        .maybeSingle();

      if (result.data) {
        transaction = result.data;
      } else if (result.error && result.error.code !== 'PGRST116') {
        // PGRST116 is "not found", which is expected if transaction_id doesn't match
        transactionError = result.error;
      }
    }

    // If not found by transaction_id, try order_id
    if (!transaction && order_id) {
      const result = await supabase
        .from('transactions')
        .select('*, projects(user_id)')
        .eq('order_id', order_id)
        .maybeSingle();

      if (result.data) {
        transaction = result.data;
      } else if (result.error && result.error.code !== 'PGRST116') {
        transactionError = result.error;
      }
    }

    if (transactionError || !transaction) {
      console.error('Transaction not found for webhook:', { transaction_id, order_id });
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Get user's LeanX secret key for signature validation
    const { data: profile } = await supabase
      .from('profiles')
      .select('leanx_secret_key')
      .eq('id', transaction.projects.user_id)
      .single();

    // Validate webhook signature
    if (profile?.leanx_secret_key) {
      const isValid = validateLeanXWebhook(body, signature, profile.leanx_secret_key);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // Map LeanX status to our status
    let transactionStatus = status;
    if (status === 'success' || status === 'paid') {
      transactionStatus = 'completed';
    } else if (status === 'pending' || status === 'processing') {
      transactionStatus = 'processing';
    } else if (status === 'failed' || status === 'declined') {
      transactionStatus = 'failed';
    } else if (status === 'cancelled') {
      transactionStatus = 'cancelled';
    } else if (status === 'refunded') {
      transactionStatus = 'refunded';
    }

    // Update transaction with webhook data
    const updateData: any = {
      status: transactionStatus,
      payment_method: payment_method,
      leanx_response: payload,
      updated_at: new Date().toISOString(),
    };

    // If payment completed, set completed_at
    if (transactionStatus === 'completed' && !transaction.completed_at) {
      updateData.completed_at = new Date().toISOString();
    }

    // Update LeanX transaction ID if provided
    if (transaction_id && transaction_id !== transaction.transaction_id) {
      updateData.transaction_id = transaction_id;
    }

    await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transaction.id);

    console.log('Webhook processed successfully:', {
      event,
      transaction_id,
      status: transactionStatus,
    });

    // TODO: Send email notifications based on status
    // - On completed: Send receipt to customer, notification to merchant
    // - On failed: Send failure notification
    // - On refunded: Send refund confirmation

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// Allow webhook to work without authentication
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
