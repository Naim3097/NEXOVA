import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { verifyLeanXPayment } from '@/lib/leanx';
import { rateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import { validateCsrf, CSRF_ERROR_RESPONSE } from '@/lib/csrf';

/**
 * POST /api/payments/verify
 *
 * Manually verify a transaction status with LeanX
 * This is useful for:
 * - Checking payment status when webhook fails
 * - Manual reconciliation
 * - Admin verification
 */
export async function POST(request: NextRequest) {
  try {
    // Validate CSRF protection
    if (!validateCsrf(request)) {
      return NextResponse.json(CSRF_ERROR_RESPONSE, { status: 403 });
    }

    // Apply rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, RATE_LIMITS.MODERATE);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          resetAt: new Date(rateLimitResult.resetAt).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS.MODERATE.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
          },
        }
      );
    }

    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const { transactionId, orderId } = body;

    if (!transactionId && !orderId) {
      return NextResponse.json(
        { error: 'Either transactionId (bill_no) or orderId (invoice_ref) is required' },
        { status: 400 }
      );
    }

    // Get transaction from database
    let transaction = null;
    let transactionError = null;

    if (transactionId) {
      const result = await supabase
        .from('transactions')
        .select('*, projects(user_id)')
        .eq('transaction_id', transactionId)
        .maybeSingle();

      if (result.data) {
        transaction = result.data;
      } else if (result.error && result.error.code !== 'PGRST116') {
        transactionError = result.error;
      }
    }

    // If not found by transaction_id, try order_id
    if (!transaction && orderId) {
      const result = await supabase
        .from('transactions')
        .select('*, projects(user_id)')
        .eq('order_id', orderId)
        .maybeSingle();

      if (result.data) {
        transaction = result.data;
      } else if (result.error && result.error.code !== 'PGRST116') {
        transactionError = result.error;
      }
    }

    if (transactionError || !transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Get user's LeanX credentials
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('leanx_api_key, leanx_collection_uuid, leanx_enabled')
      .eq('id', transaction.projects.user_id)
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
        { error: 'LeanX payment gateway not configured' },
        { status: 400 }
      );
    }

    // Verify payment status with LeanX
    const queryType = transactionId ? 'bill_no' : 'invoice_ref';
    const queryValue = transactionId || orderId;

    const verificationResult = await verifyLeanXPayment(
      {
        authToken: profile.leanx_api_key!,
        collectionUuid: profile.leanx_collection_uuid!,
      },
      queryValue,
      queryType
    );

    if (!verificationResult.success) {
      return NextResponse.json(
        {
          error: verificationResult.error || 'Failed to verify payment status',
          transaction: {
            id: transaction.id,
            orderId: transaction.order_id,
            transactionId: transaction.transaction_id,
            currentStatus: transaction.status,
          }
        },
        { status: 400 }
      );
    }

    // Update transaction if status has changed
    const shouldUpdate = transaction.status !== verificationResult.status;

    if (shouldUpdate) {
      const updateData: any = {
        status: verificationResult.status,
        updated_at: new Date().toISOString(),
      };

      // If payment completed, set completed_at
      if (verificationResult.status === 'completed' && !transaction.completed_at) {
        updateData.completed_at = new Date().toISOString();
      }

      await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', transaction.id);
    }

    return NextResponse.json({
      success: true,
      message: verificationResult.message,
      transaction: {
        id: transaction.id,
        orderId: transaction.order_id,
        transactionId: verificationResult.transactionId,
        previousStatus: transaction.status,
        currentStatus: verificationResult.status,
        statusChanged: shouldUpdate,
        amount: transaction.total_amount,
        currency: transaction.currency,
        customerEmail: transaction.customer_email,
        customerName: transaction.customer_name,
        createdAt: transaction.created_at,
        completedAt: updateData?.completed_at || transaction.completed_at,
      },
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment status' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
