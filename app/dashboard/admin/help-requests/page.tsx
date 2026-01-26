'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  HelpCircle,
  RefreshCw,
  ArrowLeft,
  Loader2,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  User,
  Calendar,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

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

function HelpRequestsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(
    null
  );
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const isAdmin =
    user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

  useEffect(() => {
    if (user && !isAdmin) {
      router.push('/dashboard');
    } else if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin, router, statusFilter, typeFilter]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const response = await fetch(
        `/api/admin/help-requests?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch help requests');
      }

      const data = await response.json();
      setHelpRequests(data.helpRequests || []);
    } catch (err) {
      console.error('Error fetching help requests:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleUpdateRequest = async (
    id: string,
    updates: Record<string, any>
  ) => {
    setUpdating(true);
    try {
      const response = await fetch('/api/admin/help-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (response.ok) {
        const data = await response.json();
        setHelpRequests((prev) =>
          prev.map((req) => (req.id === id ? data.helpRequest : req))
        );
        if (selectedRequest?.id === id) {
          setSelectedRequest(data.helpRequest);
        }
      }
    } catch (err) {
      console.error('Error updating help request:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest) return;
    await handleUpdateRequest(selectedRequest.id, { admin_notes: adminNotes });
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
            <Link href="/dashboard/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Help Requests</h1>
          </div>
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
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="w-48">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Type
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="help">Help Request</SelectItem>
                    <SelectItem value="enterprise_inquiry">
                      Enterprise Inquiry
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Requests List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Help Requests ({helpRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {helpRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No help requests found.
              </p>
            ) : (
              <div className="space-y-4">
                {helpRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedRequest(request);
                      setAdminNotes(request.admin_notes || '');
                    }}
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
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {request.user_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {request.user_email}
                          </span>
                          <span className="capitalize">
                            {request.user_plan} plan
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(request.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Request Detail Modal */}
      <Dialog
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {selectedRequest.subject || 'Help Request'}
                </DialogTitle>
                <DialogDescription>
                  {selectedRequest.request_type === 'enterprise_inquiry'
                    ? 'Enterprise Plan Inquiry'
                    : 'Help Request'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Status and Actions */}
                <div className="flex items-center gap-4">
                  {getStatusBadge(selectedRequest.status)}
                  {getPriorityBadge(selectedRequest.priority)}

                  <div className="flex-1" />

                  <Select
                    value={selectedRequest.status}
                    onValueChange={(value) =>
                      handleUpdateRequest(selectedRequest.id, { status: value })
                    }
                    disabled={updating}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedRequest.priority}
                    onValueChange={(value) =>
                      handleUpdateRequest(selectedRequest.id, {
                        priority: value,
                      })
                    }
                    disabled={updating}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* User Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">User Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequest.user_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a
                        href={`mailto:${selectedRequest.user_email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedRequest.user_email}
                      </a>
                    </div>
                    {selectedRequest.user_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a
                          href={`tel:${selectedRequest.user_phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {selectedRequest.user_phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {selectedRequest.user_plan} plan
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h4 className="font-medium mb-2">Message</h4>
                  <div className="bg-white border rounded-lg p-4 whitespace-pre-wrap">
                    {selectedRequest.message}
                  </div>
                </div>

                {/* Page Source */}
                {selectedRequest.page_source && (
                  <div>
                    <h4 className="font-medium mb-2">Page Source</h4>
                    <p className="text-sm text-gray-600">
                      {selectedRequest.page_source}
                    </p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    Created:{' '}
                    {new Date(selectedRequest.created_at).toLocaleString()}
                  </p>
                  {selectedRequest.contacted_at && (
                    <p>
                      Contacted:{' '}
                      {new Date(selectedRequest.contacted_at).toLocaleString()}
                    </p>
                  )}
                  {selectedRequest.resolved_at && (
                    <p>
                      Resolved:{' '}
                      {new Date(selectedRequest.resolved_at).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Admin Notes */}
                <div>
                  <h4 className="font-medium mb-2">Admin Notes</h4>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this request..."
                    rows={4}
                  />
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={handleSaveNotes}
                    disabled={
                      updating ||
                      adminNotes === (selectedRequest.admin_notes || '')
                    }
                  >
                    {updating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Notes'
                    )}
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `mailto:${selectedRequest.user_email}`,
                        '_blank'
                      )
                    }
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  {selectedRequest.user_phone && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `https://wa.me/${selectedRequest.user_phone.replace(/\D/g, '')}`,
                          '_blank'
                        )
                      }
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function HelpRequestsPage() {
  return (
    <ProtectedRoute>
      <HelpRequestsContent />
    </ProtectedRoute>
  );
}
