'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { profileAtom } from '@/store/auth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  CreditCard,
  Calendar,
  AlertCircle,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface SubscriptionStatus {
  profile: {
    subscription_plan: string;
    subscription_status: string;
    subscription_renewal_date: string | null;
    subscription_cancelled_at: string | null;
  };
  subscription: {
    id: string;
    plan: string;
    status: string;
    amount: number;
    currency: string;
    billing_interval: string;
    current_period_end: string;
  } | null;
  projects: {
    current: number;
    max_allowed: number;
    can_create: boolean;
  };
}

export default function SubscriptionManagementPage() {
  const router = useRouter();
  const profile = useAtomValue(profileAtom);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscriptions/status');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch subscription status');
      }

      setStatus(data);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load subscription'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        'Are you sure you want to cancel your Pro subscription? You will retain access until the end of your billing period.'
      )
    ) {
      return;
    }

    try {
      setCancelling(true);
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      alert(data.message);
      fetchSubscriptionStatus();
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      alert(
        err instanceof Error ? err.message : 'Failed to cancel subscription'
      );
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  const isPro = status?.profile.subscription_plan === 'pro';
  const isCancelled = status?.profile.subscription_status === 'cancelled';
  const isPastDue = status?.profile.subscription_status === 'past_due';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="text-primary hover:text-primary/80 flex items-center gap-2 mb-4"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              Subscription Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your subscription and billing
            </p>
          </div>

          {/* Current Plan Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {isPro && <Sparkles className="w-5 h-5 text-primary" />}
                    Current Plan:{' '}
                    {status?.profile.subscription_plan === 'pro'
                      ? 'Pro'
                      : 'Free'}
                  </CardTitle>
                  <CardDescription>
                    {status?.subscription && (
                      <span className="capitalize">
                        {status.subscription.billing_interval} billing
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    status?.profile.subscription_status === 'active'
                      ? 'default'
                      : status?.profile.subscription_status === 'cancelled'
                        ? 'destructive'
                        : 'secondary'
                  }
                  className="capitalize"
                >
                  {status?.profile.subscription_status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Projects
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {status?.projects.current} /{' '}
                    {isPro ? 'Unlimited' : status?.projects.max_allowed}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      status?.projects.can_create
                        ? 'bg-primary'
                        : 'bg-destructive'
                    }`}
                    style={{
                      width: isPro
                        ? '50%'
                        : `${Math.min(
                            ((status?.projects.current || 0) /
                              (status?.projects.max_allowed || 1)) *
                              100,
                            100
                          )}%`,
                    }}
                  />
                </div>
                {!status?.projects.can_create && !isPro && (
                  <p className="text-sm text-destructive mt-2">
                    You've reached your project limit. Upgrade to Pro for
                    unlimited projects.
                  </p>
                )}
              </div>

              {/* Subscription Info */}
              {status?.subscription && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Amount
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {status.subscription.currency} $
                        {status.subscription.amount}/
                        {status.subscription.billing_interval === 'monthly'
                          ? 'mo'
                          : 'yr'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {isCancelled ? 'Ends On' : 'Renews On'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(status.subscription.current_period_end)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Warnings */}
              {isCancelled && (
                <div className="bg-[#5FC7CD]/10 border border-[#5FC7CD]/20 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#5FC7CD] mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#455263]">
                      Subscription Cancelled
                    </p>
                    <p className="text-sm text-[#969696] mt-1">
                      Your Pro features will remain active until{' '}
                      {status?.subscription &&
                        formatDate(status.subscription.current_period_end)}
                      . After that, you'll be downgraded to the Free plan.
                    </p>
                  </div>
                </div>
              )}

              {isPastDue && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#EF4444] mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#455263]">
                      Payment Failed
                    </p>
                    <p className="text-sm text-[#969696] mt-1">
                      Your recent payment failed. Please update your payment
                      method to continue your Pro subscription.
                    </p>
                  </div>
                </div>
              )}

              {/* Features List */}
              <div>
                <h4 className="font-semibold text-[#455263] mb-3">
                  {isPro ? 'Pro Features' : 'Your Plan Includes'}
                </h4>
                <ul className="space-y-2">
                  {isPro ? (
                    <>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Unlimited projects</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Custom domains</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Advanced analytics</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Priority support</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Up to 3 projects</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Subdomain URLs</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Basic analytics</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Community support</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              {!isPro && (
                <Button
                  className="flex-1"
                  onClick={() => router.push('/pricing')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              )}
              {isPro && !isCancelled && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </Button>
              )}
              {isPro && isCancelled && (
                <Button
                  className="flex-1"
                  onClick={() =>
                    router.push('/dashboard/subscription/checkout')
                  }
                >
                  Reactivate Subscription
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/billing')}
              >
                View Billing History
              </Button>
            </CardFooter>
          </Card>

          {/* Upgrade Banner for Free Users */}
          {!isPro && (
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <CardTitle>Unlock More with Pro</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#969696] mb-4">
                  Get unlimited projects, custom domains, advanced analytics,
                  and priority support for just $29/month.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-card rounded-2xl p-4 border-[#E2E8F0]">
                    <h4 className="font-semibold text-[#455263] mb-2">
                      Monthly
                    </h4>
                    <p className="text-2xl font-bold text-[#5FC7CD] mb-1">
                      $29
                    </p>
                    <p className="text-sm text-[#969696]">per month</p>
                  </div>
                  <div className="bg-card rounded-2xl p-4 border-[#E2E8F0] relative">
                    <div className="absolute -top-2 -right-2 bg-green-700 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Save 17%
                    </div>
                    <h4 className="font-semibold text-[#455263] mb-2">
                      Yearly
                    </h4>
                    <p className="text-2xl font-bold text-[#5FC7CD] mb-1">
                      $290
                    </p>
                    <p className="text-sm text-[#969696]">~$24/month</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => router.push('/pricing')}
                >
                  Upgrade Now
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
