'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Crown,
  Building2,
  HelpCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  RefreshCw,
  ArrowLeft,
  Loader2,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface AdminStats {
  total_users: number;
  free_users: number;
  premium_users: number;
  enterprise_users: number;
  new_help_requests: number;
  total_help_requests: number;
  new_signups_today: number;
  new_signups_week: number;
  active_subscriptions: number;
  monthly_revenue: number;
}

interface HelpRequest {
  id: string;
  user_id: string;
  request_type: 'help' | 'enterprise_inquiry';
  page_source: string | null;
  subject: string | null;
  message: string;
  user_name: string;
  user_email: string;
  user_phone: string | null;
  user_plan: string;
  status: 'new' | 'in_progress' | 'contacted' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  admin_notes: string | null;
  contacted_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

// Admin email whitelist check (client-side)
const ADMIN_EMAILS = ['ahm.zafran99@gmail.com'];

function AdminDashboardContent() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin =
    user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

  useEffect(() => {
    if (user && !isAdmin) {
      router.push('/dashboard');
    } else if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin, router]);

  const fetchData = async () => {
    try {
      setError(null);
      const [statsResponse, helpResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/help-requests?limit=10'),
      ]);

      if (!statsResponse.ok || !helpResponse.ok) {
        throw new Error('Failed to fetch admin data');
      }

      const statsData = await statsResponse.json();
      const helpData = await helpResponse.json();

      setStats(statsData.stats);
      setHelpRequests(helpData.helpRequests || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load admin data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/help-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        setHelpRequests((prev) =>
          prev.map((req) =>
            req.id === id
              ? { ...req, status: newStatus as HelpRequest['status'] }
              : req
          )
        );
      }
    } catch (err) {
      console.error('Error updating help request:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { color: string; icon: React.ReactNode }
    > = {
      new: {
        color: 'bg-blue-100 text-blue-800',
        icon: <AlertCircle className="h-3 w-3" />,
      },
      in_progress: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="h-3 w-3" />,
      },
      contacted: {
        color: 'bg-purple-100 text-purple-800',
        icon: <MessageSquare className="h-3 w-3" />,
      },
      resolved: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="h-3 w-3" />,
      },
      closed: {
        color: 'bg-gray-100 text-gray-800',
        icon: <CheckCircle className="h-3 w-3" />,
      },
    };
    const config = statusConfig[status] || statusConfig.new;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600',
      normal: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600',
    };
    return (
      <Badge className={priorityConfig[priority] || priorityConfig.normal}>
        {priority}
      </Badge>
    );
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You do not have permission to access this page.
          </p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              Admin
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-3xl font-bold">
                    {stats?.total_users || 0}
                  </p>
                </div>
                <Users className="h-10 w-10 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Premium Users</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats?.premium_users || 0}
                  </p>
                </div>
                <Crown className="h-10 w-10 text-yellow-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Enterprise Users</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats?.enterprise_users || 0}
                  </p>
                </div>
                <Building2 className="h-10 w-10 text-purple-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-green-600">
                    RM{(stats?.monthly_revenue || 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-10 w-10 text-green-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Free Users</p>
                  <p className="text-2xl font-bold">{stats?.free_users || 0}</p>
                </div>
                <Users className="h-8 w-8 text-gray-400 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Signups Today</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats?.new_signups_today || 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Signups This Week</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.new_signups_week || 0}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">New Help Requests</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats?.new_help_requests || 0}
                  </p>
                </div>
                <HelpCircle className="h-8 w-8 text-orange-400 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Requests Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Recent Help Requests & Inquiries
            </CardTitle>
            <Link href="/dashboard/admin/help-requests">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {helpRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No help requests yet.
              </p>
            ) : (
              <div className="space-y-4">
                {helpRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(request.status)}
                          {getPriorityBadge(request.priority)}
                          <Badge variant="outline">
                            {request.request_type === 'enterprise_inquiry'
                              ? 'Enterprise'
                              : 'Help'}
                          </Badge>
                        </div>
                        <h4 className="font-semibold">
                          {request.subject || 'No subject'}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {request.message}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{request.user_name}</span>
                          <span>{request.user_email}</span>
                          <span className="capitalize">
                            {request.user_plan} plan
                          </span>
                          <span>
                            {new Date(request.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {request.status === 'new' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateStatus(request.id, 'in_progress')
                            }
                          >
                            Start
                          </Button>
                        )}
                        {request.status === 'in_progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateStatus(request.id, 'contacted')
                            }
                          >
                            Mark Contacted
                          </Button>
                        )}
                        {(request.status === 'in_progress' ||
                          request.status === 'contacted') && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() =>
                              handleUpdateStatus(request.id, 'resolved')
                            }
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
