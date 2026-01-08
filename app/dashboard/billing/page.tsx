'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/auth-client';

interface BillingRecord {
  id: string;
  invoice_number: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  invoice_date: string;
  paid_at: string | null;
}

export default function BillingHistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingHistory();
  }, []);

  const fetchBillingHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('Not authenticated');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('billing_history')
        .select('*')
        .eq('user_id', user.id)
        .order('invoice_date', { ascending: false });

      if (fetchError) throw fetchError;

      setBillingHistory(data || []);
    } catch (err) {
      console.error('Error fetching billing history:', err);
      setError(err instanceof Error ? err.message : 'Failed to load billing history');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = (invoiceNumber: string) => {
    // TODO: Implement PDF invoice generation
    alert(`Invoice ${invoiceNumber} download will be available soon.`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      paid: { variant: 'default', label: 'Paid' },
      pending: { variant: 'secondary', label: 'Pending' },
      failed: { variant: 'destructive', label: 'Failed' },
      refunded: { variant: 'outline', label: 'Refunded' },
    };

    const config = statusConfig[status] || { variant: 'secondary', label: status };

    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard/subscription" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
              ← Back to Subscription
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Billing History</h1>
                <p className="text-gray-600 mt-2">
                  View and download your invoices
                </p>
              </div>
              <Button variant="outline" onClick={fetchBillingHistory}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Billing History Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Invoices
              </CardTitle>
              <CardDescription>
                All your billing records and invoices in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
                  {error}
                </div>
              )}

              {billingHistory.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No billing history yet</p>
                  <p className="text-sm text-gray-500">
                    Your invoices will appear here after your first payment
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billingHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {record.invoice_number}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {record.description}
                          </TableCell>
                          <TableCell>
                            {formatDate(record.invoice_date)}
                          </TableCell>
                          <TableCell>
                            {record.currency} ${record.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(record.status)}
                          </TableCell>
                          <TableCell className="capitalize">
                            {record.payment_method || 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadInvoice(record.invoice_number)}
                              disabled={record.status !== 'paid'}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Card */}
          {billingHistory.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${billingHistory
                        .filter((r) => r.status === 'paid')
                        .reduce((sum, r) => sum + r.amount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {billingHistory.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Last Payment</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {billingHistory[0]?.paid_at
                        ? formatDate(billingHistory[0].paid_at)
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
