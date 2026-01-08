'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/auth-client';
import type { Transaction, TransactionStats } from '@/types';

export default function TransactionsDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [exporting, setExporting] = useState(false);

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];

  // Fetch stats and transactions
  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch transaction stats using the database function
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_transaction_stats', {
          p_user_id: user.id,
          p_project_id: null,
        });

      if (statsError) throw statsError;

      if (statsData && statsData.length > 0) {
        setStats(statsData[0]);
      }

      // Fetch all transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (transactionsError) throw transactionsError;

      setTransactions(transactionsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load transaction data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Export to CSV
  const handleExport = async () => {
    setExporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const url = new URL('/api/transactions/export', window.location.origin);
      url.searchParams.append('userId', user.id);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `transactions-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: 'Success',
        description: 'Transactions exported successfully',
      });
    } catch (error) {
      console.error('Error exporting:', error);
      toast({
        title: 'Error',
        description: 'Failed to export transactions',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  // Format currency
  const formatCurrency = (value: number | string, currency: string = 'MYR') => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (currency === 'MYR') {
      return `RM ${numValue.toFixed(2)}`;
    }
    return `${currency} ${numValue.toFixed(2)}`;
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      refunded: 'bg-purple-100 text-purple-800',
    };

    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Navigate months
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isCurrentMonth = currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear();

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Transaction Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your payment transactions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exporting || transactions.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Today's Transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.today_revenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.today_transactions || 0} Today's Transaction »
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Successful Transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.total_revenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.successful_transactions || 0} Successful »
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Cancelled Transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM 0.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.failed_transactions || 0} Failed »
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Recurring Payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM 0.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              0 Active Direct Debit »
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Statistics Chart */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">
                Transaction Statistics - {monthNames[currentMonth]} {currentYear}
              </CardTitle>
              {isCurrentMonth && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Current
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousMonth}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextMonth}
                disabled={isCurrentMonth}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* View Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={viewMode === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant={viewMode === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={viewMode === 'yearly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('yearly')}
            >
              Yearly
            </Button>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              Chart visualization will be displayed here
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Showing {viewMode} transaction data
            </p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">RM 0.00</p>
              <p className="text-sm text-gray-600 mt-1">Failed Transactions</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats?.total_revenue || 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Successful Transactions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            View and manage all your payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Transactions will appear here once customers make payments
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {transaction.order_id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.product_name}</p>
                          {transaction.has_bump_offer && transaction.bump_offer_accepted && (
                            <p className="text-xs text-gray-500">
                              + {transaction.bump_offer_name}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.customer_email || transaction.customer_name || '-'}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(transaction.total_amount, transaction.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
