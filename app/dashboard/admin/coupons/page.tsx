'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminEmail } from '@/lib/admin';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCsrfToken } from '@/lib/csrf';
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Plus,
  Ticket,
  Percent,
  DollarSign,
  Trash2,
  Edit,
  Copy,
  CheckCircle,
  XCircle,
  X,
} from 'lucide-react';
import Link from 'next/link';
import type { Coupon } from '@/types';

interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  totalRedemptions: number;
}

function AdminCouponsContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<CouponStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const isAdmin = isAdminEmail(user?.email);

  useEffect(() => {
    if (user && !isAdmin) {
      router.push('/dashboard');
    } else if (user && isAdmin) {
      fetchCoupons();
    }
  }, [user, isAdmin, router]);

  const fetchCoupons = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/coupons');

      if (!response.ok) {
        throw new Error('Failed to fetch coupons');
      }

      const data = await response.json();
      setCoupons(data.coupons || []);
      setStats(data.stats || null);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('Failed to load coupons. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCoupons();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const response = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken(),
        },
        body: JSON.stringify({ is_active: !coupon.is_active }),
      });

      if (response.ok) {
        setCoupons((prev) =>
          prev.map((c) =>
            c.id === coupon.id ? { ...c, is_active: !c.is_active } : c
          )
        );
      }
    } catch (err) {
      console.error('Error toggling coupon:', err);
    }
  };

  const handleDelete = async (coupon: Coupon) => {
    if (!confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'DELETE',
        headers: {
          'x-csrf-token': getCsrfToken(),
        },
      });

      if (response.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
      }
    } catch (err) {
      console.error('Error deleting coupon:', err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#EF4444] mb-2">
            Access Denied
          </h1>
          <p className="text-[#969696] mb-4">
            You do not have permission to access this page.
          </p>
          <Link href="/dashboard">
            <Button variant="teal">
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
        <Loader2 className="h-8 w-8 animate-spin text-[#969696]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-[#455263]">
              Coupon Management
            </h1>
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
            <Button
              variant="teal"
              size="sm"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-[#EF4444] px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="rounded-2xl border-[#E2E8F0]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#969696]">Total Coupons</p>
                  <p className="text-3xl font-bold text-[#455263]">
                    {stats?.totalCoupons || 0}
                  </p>
                </div>
                <Ticket className="h-5 w-5 text-[#5FC7CD]" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#E2E8F0]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#969696]">Active Coupons</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats?.activeCoupons || 0}
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#E2E8F0]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#969696]">Total Redemptions</p>
                  <p className="text-3xl font-bold text-[#455263]">
                    {stats?.totalRedemptions || 0}
                  </p>
                </div>
                <DollarSign className="h-5 w-5 text-[#5FC7CD]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coupons Table */}
        <Card className="rounded-2xl border-[#E2E8F0]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#455263]">
              <Ticket className="h-5 w-5" />
              All Coupons
            </CardTitle>
          </CardHeader>
          <CardContent>
            {coupons.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="h-12 w-12 text-[#969696] mx-auto mb-4" />
                <p className="text-[#969696] mb-4">No coupons created yet.</p>
                <Button variant="teal" onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Coupon
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E2E8F0]">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#455263]">
                        Code
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#455263]">
                        Discount
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#455263]">
                        Usage
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#455263]">
                        Valid Period
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#455263]">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-[#455263]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => (
                      <tr
                        key={coupon.id}
                        className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <code className="bg-[#F8FAFC] px-2 py-1 rounded text-sm font-mono font-bold text-[#455263]">
                              {coupon.code}
                            </code>
                            <button
                              onClick={() => handleCopyCode(coupon.code)}
                              className="text-[#969696] hover:text-[#455263]"
                              title="Copy code"
                            >
                              {copiedCode === coupon.code ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {coupon.description && (
                            <p className="text-xs text-[#969696] mt-1">
                              {coupon.description}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {coupon.discount_type === 'percentage' ? (
                              <>
                                <Percent className="h-4 w-4 text-[#5FC7CD]" />
                                <span className="font-semibold text-[#455263]">
                                  {coupon.discount_value}%
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="font-semibold text-[#455263]">
                                  RM{coupon.discount_value}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#455263]">
                            {coupon.used_count}
                            {coupon.max_uses ? ` / ${coupon.max_uses}` : ' / ∞'}
                          </span>
                          {coupon.max_uses &&
                            coupon.used_count >= coupon.max_uses && (
                              <Badge className="ml-2 bg-orange-100 text-orange-600">
                                Exhausted
                              </Badge>
                            )}
                        </td>
                        <td className="py-3 px-4 text-sm text-[#969696]">
                          <div>
                            {new Date(coupon.valid_from).toLocaleDateString()}
                            {coupon.valid_until && (
                              <>
                                {' '}
                                -{' '}
                                {new Date(
                                  coupon.valid_until
                                ).toLocaleDateString()}
                              </>
                            )}
                            {!coupon.valid_until && (
                              <span className="text-[#5FC7CD]">
                                {' '}
                                (No expiry)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              coupon.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-[#969696]/10 text-[#969696]'
                            }
                          >
                            {coupon.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(coupon)}
                              title={
                                coupon.is_active ? 'Deactivate' : 'Activate'
                              }
                            >
                              {coupon.is_active ? (
                                <XCircle className="h-4 w-4 text-[#969696]" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingCoupon(coupon)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4 text-[#5FC7CD]" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(coupon)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-[#EF4444]" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingCoupon) && (
        <CouponModal
          coupon={editingCoupon}
          onClose={() => {
            setShowCreateModal(false);
            setEditingCoupon(null);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            setEditingCoupon(null);
            fetchCoupons();
          }}
        />
      )}
    </div>
  );
}

interface CouponModalProps {
  coupon: Coupon | null;
  onClose: () => void;
  onSuccess: () => void;
}

function CouponModal({ coupon, onClose, onSuccess }: CouponModalProps) {
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    description: coupon?.description || '',
    discount_type: coupon?.discount_type || 'percentage',
    discount_value: coupon?.discount_value?.toString() || '',
    max_uses: coupon?.max_uses?.toString() || '',
    valid_from: coupon?.valid_from
      ? new Date(coupon.valid_from).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    valid_until: coupon?.valid_until
      ? new Date(coupon.valid_until).toISOString().split('T')[0]
      : '',
    is_active: coupon?.is_active ?? true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, code }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        code: formData.code,
        description: formData.description || null,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        valid_from: formData.valid_from,
        valid_until: formData.valid_until || null,
        is_active: formData.is_active,
        applicable_plans: ['premium'],
      };

      const url = coupon
        ? `/api/admin/coupons/${coupon.id}`
        : '/api/admin/coupons';
      const method = coupon ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken(),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save coupon');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save coupon');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#455263]">
            {coupon ? 'Edit Coupon' : 'Create Coupon'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#969696] hover:text-[#455263]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-[#EF4444] px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-[#455263] mb-1">
              Coupon Code *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    code: e.target.value.toUpperCase(),
                  }))
                }
                className="flex-1 px-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5FC7CD] font-mono uppercase"
                placeholder="e.g., SAVE20"
                required
                maxLength={50}
              />
              <Button type="button" variant="outline" onClick={generateCode}>
                Generate
              </Button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#455263] mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5FC7CD]"
              placeholder="e.g., Early bird discount"
              maxLength={500}
            />
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#455263] mb-1">
                Discount Type *
              </label>
              <select
                value={formData.discount_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discount_type: e.target.value as 'percentage' | 'fixed',
                  }))
                }
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5FC7CD]"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (RM)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#455263] mb-1">
                Discount Value *
              </label>
              <input
                type="number"
                value={formData.discount_value}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discount_value: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5FC7CD]"
                placeholder={
                  formData.discount_type === 'percentage'
                    ? 'e.g., 20'
                    : 'e.g., 15'
                }
                required
                min="0.01"
                max={formData.discount_type === 'percentage' ? '100' : '999'}
                step="0.01"
              />
            </div>
          </div>

          {/* Max Uses */}
          <div>
            <label className="block text-sm font-medium text-[#455263] mb-1">
              Max Uses (leave empty for unlimited)
            </label>
            <input
              type="number"
              value={formData.max_uses}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, max_uses: e.target.value }))
              }
              className="w-full px-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5FC7CD]"
              placeholder="e.g., 100"
              min="1"
            />
          </div>

          {/* Valid Period */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#455263] mb-1">
                Valid From *
              </label>
              <input
                type="date"
                value={formData.valid_from}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    valid_from: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5FC7CD]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#455263] mb-1">
                Valid Until (optional)
              </label>
              <input
                type="date"
                value={formData.valid_until}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    valid_until: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5FC7CD]"
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_active: e.target.checked,
                }))
              }
              className="w-5 h-5 rounded border-[#E2E8F0] text-[#5FC7CD] focus:ring-[#5FC7CD]"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-medium text-[#455263]"
            >
              Active (users can use this coupon)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="teal"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : coupon ? (
                'Save Changes'
              ) : (
                'Create Coupon'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminCouponsPage() {
  return (
    <ProtectedRoute>
      <AdminCouponsContent />
    </ProtectedRoute>
  );
}
