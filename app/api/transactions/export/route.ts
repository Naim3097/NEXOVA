import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const projectId = searchParams.get('projectId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Build query
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data: transactions, error } = await query;

    if (error) {
      console.error('Error fetching transactions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      );
    }

    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        { error: 'No transactions found' },
        { status: 404 }
      );
    }

    // Generate CSV
    const csv = generateCSV(transactions);

    // Return CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="transactions-${userId}-${Date.now()}.csv"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export transactions' },
      { status: 500 }
    );
  }
}

function generateCSV(transactions: any[]): string {
  if (transactions.length === 0) return '';

  // Define column headers
  const headers = [
    'Transaction ID',
    'Order ID',
    'Date',
    'Product Name',
    'Amount',
    'Currency',
    'Has Bump Offer',
    'Bump Offer Name',
    'Bump Offer Amount',
    'Bump Offer Accepted',
    'Total Amount',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Status',
    'Payment Method',
    'IP Address',
    'Completed At',
  ];

  // Generate CSV rows
  const rows = transactions.map(transaction => {
    const row = [
      escapeCSV(transaction.transaction_id),
      escapeCSV(transaction.order_id),
      escapeCSV(new Date(transaction.created_at).toLocaleString()),
      escapeCSV(transaction.product_name),
      escapeCSV(transaction.amount),
      escapeCSV(transaction.currency),
      escapeCSV(transaction.has_bump_offer ? 'Yes' : 'No'),
      escapeCSV(transaction.bump_offer_name || ''),
      escapeCSV(transaction.bump_offer_amount || ''),
      escapeCSV(transaction.bump_offer_accepted ? 'Yes' : 'No'),
      escapeCSV(transaction.total_amount),
      escapeCSV(transaction.customer_name || ''),
      escapeCSV(transaction.customer_email || ''),
      escapeCSV(transaction.customer_phone || ''),
      escapeCSV(transaction.status),
      escapeCSV(transaction.payment_method || ''),
      escapeCSV(transaction.ip_address || ''),
      escapeCSV(transaction.completed_at ? new Date(transaction.completed_at).toLocaleString() : ''),
    ];

    return row.join(',');
  });

  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n');
}

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';

  const stringValue = String(value);

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}
