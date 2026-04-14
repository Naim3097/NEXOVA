import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/payments/check-status?order=XXX
 * Check payment status for a given order reference (public endpoint)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderRef = searchParams.get('order');

    if (!orderRef) {
      return NextResponse.json(
        { error: 'Order reference is required' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find transaction by order_id
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('status, transaction_id, amount, created_at')
      .eq('order_id', orderRef)
      .single();

    if (error || !transaction) {
      console.error('Transaction not found:', orderRef, error);
      return NextResponse.json(
        {
          status: 'pending',
          message: 'Transaction not found or still processing'
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      status: transaction.status,
      transaction_id: transaction.transaction_id,
      amount: transaction.amount,
      created_at: transaction.created_at,
    });

  } catch (error) {
    console.error('Check status error:', error);
    return NextResponse.json(
      {
        status: 'pending',
        message: 'Error checking payment status'
      },
      { status: 200 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
