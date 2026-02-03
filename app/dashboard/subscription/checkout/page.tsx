'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  Crown,
  Building2,
  ArrowUpCircle,
  Loader2,
  ArrowLeft,
  CreditCard,
  Lock,
  Tag,
  X,
  Sparkles,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { getCsrfToken } from '@/lib/csrf';

interface Bank {
  id: string;
  name: string;
  type: 'WEB_PAYMENT' | 'DIGITAL_PAYMENT';
  icon: string;
  logo?: string;
}

interface PlanFeature {
  name: string;
  free: boolean | string;
  premium: boolean | string;
  enterprise: boolean | string;
}

const planFeatures: PlanFeature[] = [
  {
    name: 'Projects',
    free: '1',
    premium: 'Unlimited',
    enterprise: 'Unlimited',
  },
  {
    name: 'Products',
    free: '5',
    premium: 'Unlimited',
    enterprise: 'Unlimited',
  },
  { name: 'Custom Domain', free: false, premium: true, enterprise: true },
  { name: 'Analytics Dashboard', free: false, premium: true, enterprise: true },
  {
    name: 'Tracking Pixels (Meta, TikTok, Google)',
    free: false,
    premium: true,
    enterprise: true,
  },
  { name: 'Bump Offer / Upsell', free: false, premium: true, enterprise: true },
  {
    name: 'Google Sheets Integration',
    free: false,
    premium: true,
    enterprise: true,
  },
  { name: 'Version Control', free: false, premium: true, enterprise: true },
  { name: 'Priority Support', free: false, premium: true, enterprise: true },
  {
    name: 'E-Invoice Integration',
    free: false,
    premium: false,
    enterprise: 'Coming Soon',
  },
  {
    name: 'Affiliate Management',
    free: false,
    premium: false,
    enterprise: 'Coming Soon',
  },
  {
    name: 'Dedicated Account Manager',
    free: false,
    premium: false,
    enterprise: true,
  },
];

interface CouponState {
  code: string;
  isValid: boolean;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountAmount?: number;
  finalAmount?: number;
  message?: string;
}

export default function SubscriptionCheckoutPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [step, setStep] = useState<'plans' | 'banks'>('plans');
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  // Coupon states
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponState | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const currentPlan = profile?.subscription_plan || 'free';
  const PREMIUM_PRICE = 79;

  // Validate coupon code
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError(null);

    try {
      const response = await fetch('/api/subscription/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coupon_code: couponInput.trim(),
          plan: 'premium',
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setAppliedCoupon({
          code: data.coupon_code,
          isValid: true,
          discountType: data.discount_type,
          discountValue: data.discount_value,
          discountAmount: data.discount_amount,
          finalAmount: data.final_amount,
          message: data.message,
        });
        setCouponError(null);
      } else {
        setCouponError(data.message || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setCouponError('Error validating coupon. Please try again.');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove applied coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

  // Get final price (with or without coupon)
  const getFinalPrice = () => {
    if (appliedCoupon?.isValid && appliedCoupon.finalAmount !== undefined) {
      return appliedCoupon.finalAmount;
    }
    return PREMIUM_PRICE;
  };

  const handleUpgrade = async (plan: 'premium' | 'enterprise') => {
    if (plan === 'enterprise') {
      setLoading('enterprise');
      try {
        const response = await fetch('/api/help/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': getCsrfToken(),
          },
          body: JSON.stringify({
            request_type: 'enterprise_inquiry',
            subject: 'Enterprise Plan Inquiry',
            message:
              'I am interested in the Enterprise plan. Please contact me with more information.',
            page_source: 'checkout_page',
          }),
        });

        if (response.ok) {
          alert(
            'Thank you for your interest! Our team will contact you shortly.'
          );
        } else {
          throw new Error('Failed to submit inquiry');
        }
      } catch (error) {
        console.error('Error submitting enterprise inquiry:', error);
        alert('Failed to submit inquiry. Please try again.');
      } finally {
        setLoading(null);
      }
      return;
    }

    // Check if 100% discount (free upgrade)
    if (appliedCoupon?.isValid && appliedCoupon.finalAmount === 0) {
      setLoading('premium');
      try {
        const response = await fetch('/api/subscription/create-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': getCsrfToken(),
          },
          body: JSON.stringify({
            plan: 'premium',
            couponCode: appliedCoupon.code,
          }),
        });

        const data = await response.json();

        if (data.freeUpgrade) {
          // Free upgrade successful - redirect to dashboard
          router.push('/dashboard?subscription=success&free=true');
        } else if (data.error) {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error('Error processing free upgrade:', error);
        alert('Failed to process upgrade. Please try again.');
        setLoading(null);
      }
      return;
    }

    // Fetch bank list for premium payment
    setLoading('premium');
    try {
      const response = await fetch('/api/subscription/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken(),
        },
        body: JSON.stringify({
          plan: 'premium',
          ...(appliedCoupon?.isValid && { couponCode: appliedCoupon.code }),
        }),
      });

      const data = await response.json();

      if (data.requiresBankSelection && data.banks) {
        setBanks(data.banks);
        setStep('banks');
        setLoading(null);
      } else if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.error || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(null);
    }
  };

  const handleBankSelect = async (bankId: string) => {
    setSelectedBank(bankId);
    setLoading('bank');

    try {
      const response = await fetch('/api/subscription/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken(),
        },
        body: JSON.stringify({
          plan: 'premium',
          bankId,
          ...(appliedCoupon?.isValid && { couponCode: appliedCoupon.code }),
        }),
      });

      const data = await response.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.error || 'Failed to create payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
      setLoading(null);
      setSelectedBank(null);
    }
  };

  const handleBack = () => {
    setStep('plans');
    setBanks([]);
    setSelectedBank(null);
  };

  const renderFeatureValue = (
    value: boolean | string,
    isFreePlan: boolean = false
  ) => {
    if (typeof value === 'string') {
      return (
        <span className="text-sm font-medium text-foreground">{value}</span>
      );
    }
    if (value) {
      return <Check className="h-5 w-5 text-chart-2 mx-auto" />;
    }
    if (isFreePlan) {
      return <Lock className="h-4 w-4 text-muted-foreground mx-auto" />;
    }
    return <span className="text-muted-foreground text-lg">—</span>;
  };

  // Group banks by type
  const fpxBanks = banks.filter((b) => b.type === 'WEB_PAYMENT');
  const eWallets = banks.filter((b) => b.type === 'DIGITAL_PAYMENT');

  // Check if user is already on Premium
  if (currentPlan === 'premium') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md">
            <CardHeader>
              <h2 className="text-xl font-bold text-[#455263]">
                Already Subscribed
              </h2>
              <p className="text-[#969696]">
                You&apos;re already on the Premium plan!
              </p>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="text-primary hover:text-primary/80 flex items-center gap-2 mb-4"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {step === 'plans' ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-[#455263]">
                  <ArrowUpCircle className="h-6 w-6 text-[#5FC7CD]" />
                  Upgrade Your Plan
                </h1>
                <p className="text-[#969696] mt-2">
                  Choose the plan that best fits your needs. Unlock powerful
                  features to grow your business.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Free Plan */}
                <div
                  className={`relative rounded-2xl border-2 p-6 ${currentPlan === 'free' ? 'border-[#5FC7CD] bg-[#5FC7CD]/5' : 'border-[#E2E8F0]'}`}
                >
                  {currentPlan === 'free' && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Current Plan
                    </Badge>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-[#455263]">Free</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-[#455263]">
                        RM0
                      </span>
                      <span className="text-[#969696]">/month</span>
                    </div>
                    <p className="text-sm text-[#969696] mt-2">
                      Get started for free
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={currentPlan === 'free'}
                  >
                    {currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}
                  </Button>
                </div>

                {/* Premium Plan */}
                <div
                  className={`relative rounded-2xl border-2 p-6 ${currentPlan === 'premium' ? 'border-[#5FC7CD] bg-[#5FC7CD]/5' : 'border-[#5FC7CD]'} shadow-lg`}
                >
                  {currentPlan === 'premium' ? (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5FC7CD] text-white">
                      Current Plan
                    </Badge>
                  ) : (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#5FC7CD] to-[#455263]">
                      Most Popular
                    </Badge>
                  )}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold flex items-center justify-center gap-2 text-[#455263]">
                      <Crown className="h-5 w-5 text-[#5FC7CD]" />
                      Premium
                    </h3>
                    <div className="mt-2">
                      {appliedCoupon?.isValid ? (
                        <>
                          <span className="text-lg line-through text-[#969696]">
                            RM{PREMIUM_PRICE}
                          </span>
                          <span className="text-3xl font-bold text-[#5FC7CD] ml-2">
                            RM{appliedCoupon.finalAmount}
                          </span>
                          <span className="text-[#969696]">/month</span>
                          {appliedCoupon.finalAmount === 0 && (
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <Sparkles className="h-4 w-4 text-[#5FC7CD]" />
                              <span className="text-sm font-medium text-[#5FC7CD]">
                                FREE!
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-[#455263]">
                            RM{PREMIUM_PRICE}
                          </span>
                          <span className="text-[#969696]">/month</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-[#969696] mt-2">
                      Everything you need to scale
                    </p>
                  </div>

                  {/* Coupon Input */}
                  {currentPlan !== 'premium' && (
                    <div className="mb-4">
                      {appliedCoupon?.isValid ? (
                        <div className="flex items-center justify-between bg-[#5FC7CD]/10 border border-[#5FC7CD]/30 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-[#5FC7CD]" />
                            <span className="text-sm font-medium text-[#455263]">
                              {appliedCoupon.code}
                            </span>
                            <span className="text-xs text-[#5FC7CD]">
                              (-RM{appliedCoupon.discountAmount?.toFixed(2)})
                            </span>
                          </div>
                          <button
                            onClick={handleRemoveCoupon}
                            className="text-[#969696] hover:text-[#455263]"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Coupon code"
                              value={couponInput}
                              onChange={(e) => {
                                setCouponInput(e.target.value.toUpperCase());
                                setCouponError(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleApplyCoupon();
                                }
                              }}
                              className="flex-1 text-sm uppercase"
                              disabled={couponLoading}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleApplyCoupon}
                              disabled={couponLoading || !couponInput.trim()}
                            >
                              {couponLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Apply'
                              )}
                            </Button>
                          </div>
                          {couponError && (
                            <p className="text-xs text-red-500">
                              {couponError}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    variant="teal"
                    className="w-full"
                    onClick={() => handleUpgrade('premium')}
                    disabled={
                      currentPlan === 'premium' || loading === 'premium'
                    }
                  >
                    {loading === 'premium' ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {appliedCoupon?.finalAmount === 0
                          ? 'Activating...'
                          : 'Loading...'}
                      </>
                    ) : currentPlan === 'premium' ? (
                      'Current Plan'
                    ) : appliedCoupon?.finalAmount === 0 ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Upgrade for Free
                      </>
                    ) : (
                      'Upgrade Now'
                    )}
                  </Button>
                </div>

                {/* Enterprise Plan */}
                <div
                  className={`relative rounded-2xl border-2 p-6 ${currentPlan === 'enterprise' ? 'border-[#455263] bg-[#455263]/5' : 'border-[#E2E8F0]'}`}
                >
                  {currentPlan === 'enterprise' && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#455263]">
                      Current Plan
                    </Badge>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold flex items-center justify-center gap-2 text-[#455263]">
                      <Building2 className="h-5 w-5 text-[#455263]" />
                      Enterprise
                    </h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-[#455263]">
                        Custom
                      </span>
                    </div>
                    <p className="text-sm text-[#969696] mt-2">
                      For large scale operations
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-[#455263] text-[#455263] hover:bg-[#455263]/10"
                    onClick={() => handleUpgrade('enterprise')}
                    disabled={
                      currentPlan === 'enterprise' || loading === 'enterprise'
                    }
                  >
                    {loading === 'enterprise' ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : currentPlan === 'enterprise' ? (
                      'Current Plan'
                    ) : (
                      'Contact Us'
                    )}
                  </Button>
                </div>
              </div>

              {/* Feature Comparison Table */}
              <div className="mb-8">
                <h4 className="font-semibold text-[#455263] mb-4">
                  Feature Comparison
                </h4>
                <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                  <table className="w-full table-fixed">
                    <thead className="bg-[#F8FAFC]">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-[#969696] w-[40%]">
                          Feature
                        </th>
                        <th className="text-center px-4 py-3 text-sm font-medium text-[#969696] w-[20%]">
                          Free
                        </th>
                        <th className="text-center px-4 py-3 text-sm font-medium text-[#969696] w-[20%]">
                          Premium
                        </th>
                        <th className="text-center px-4 py-3 text-sm font-medium text-[#969696] w-[20%]">
                          Enterprise
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {planFeatures.map((feature, index) => (
                        <tr key={index} className="hover:bg-[#F8FAFC]">
                          <td className="px-4 py-3 text-sm text-[#455263]">
                            {feature.name}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center">
                              {renderFeatureValue(feature.free, true)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center">
                              {renderFeatureValue(feature.premium)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center">
                              {renderFeatureValue(feature.enterprise)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-xs text-[#969696] text-center">
                All plans include access to the page builder, publishing, and
                form submissions. Premium features unlock when you upgrade.
              </p>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-[#455263]">
                  <CreditCard className="h-6 w-6 text-[#5FC7CD]" />
                  Select Payment Method
                </h1>
                <p className="text-[#969696] mt-2">
                  Choose your preferred payment method to complete your Premium
                  subscription.
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="mb-6"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Plans
              </Button>

              {/* Order Summary */}
              <div className="bg-[#5FC7CD]/10 border border-[#5FC7CD]/20 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 text-[#455263]">
                      <Crown className="h-4 w-4 text-[#5FC7CD]" />
                      Premium Plan
                    </h4>
                    <p className="text-sm text-[#969696]">
                      Monthly subscription
                    </p>
                    {appliedCoupon?.isValid && (
                      <div className="flex items-center gap-2 mt-1">
                        <Tag className="h-3 w-3 text-[#5FC7CD]" />
                        <span className="text-xs text-[#5FC7CD] font-medium">
                          Coupon: {appliedCoupon.code}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {appliedCoupon?.isValid ? (
                      <>
                        <p className="text-sm line-through text-[#969696]">
                          RM{PREMIUM_PRICE}
                        </p>
                        <p className="text-2xl font-bold text-[#5FC7CD]">
                          RM{appliedCoupon.finalAmount}
                        </p>
                        <p className="text-xs text-[#5FC7CD]">
                          Save RM{appliedCoupon.discountAmount?.toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-[#455263]">
                          RM{PREMIUM_PRICE}
                        </p>
                        <p className="text-xs text-[#969696]">/month</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* FPX / Online Banking */}
              {fpxBanks.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-sm text-[#969696]">
                    Online Banking (FPX)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {fpxBanks.map((bank) => (
                      <button
                        key={bank.id}
                        onClick={() => handleBankSelect(bank.id)}
                        disabled={loading === 'bank'}
                        className={`
                          p-3 border rounded-xl text-center hover:border-[#5FC7CD] hover:bg-[#5FC7CD]/5 transition-colors
                          ${selectedBank === bank.id ? 'border-[#5FC7CD] bg-[#5FC7CD]/5' : 'border-[#E2E8F0]'}
                          ${loading === 'bank' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        {bank.logo ? (
                          <img
                            src={bank.logo}
                            alt={bank.name}
                            className="h-8 w-auto mx-auto mb-1"
                          />
                        ) : (
                          <div className="h-8 flex items-center justify-center mb-1">
                            <CreditCard className="h-6 w-6 text-[#969696]" />
                          </div>
                        )}
                        <p className="text-xs text-[#455263] truncate">
                          {bank.name}
                        </p>
                        {selectedBank === bank.id && loading === 'bank' && (
                          <Loader2 className="h-4 w-4 animate-spin mx-auto mt-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* E-Wallets */}
              {eWallets.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-sm text-[#969696]">
                    E-Wallets
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {eWallets.map((wallet) => (
                      <button
                        key={wallet.id}
                        onClick={() => handleBankSelect(wallet.id)}
                        disabled={loading === 'bank'}
                        className={`
                          p-3 border rounded-xl text-center hover:border-[#5FC7CD] hover:bg-[#5FC7CD]/5 transition-colors
                          ${selectedBank === wallet.id ? 'border-[#5FC7CD] bg-[#5FC7CD]/5' : 'border-[#E2E8F0]'}
                          ${loading === 'bank' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        {wallet.logo ? (
                          <img
                            src={wallet.logo}
                            alt={wallet.name}
                            className="h-8 w-auto mx-auto mb-1"
                          />
                        ) : (
                          <div className="h-8 flex items-center justify-center mb-1">
                            <CreditCard className="h-6 w-6 text-[#969696]" />
                          </div>
                        )}
                        <p className="text-xs text-[#455263] truncate">
                          {wallet.name}
                        </p>
                        {selectedBank === wallet.id && loading === 'bank' && (
                          <Loader2 className="h-4 w-4 animate-spin mx-auto mt-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {banks.length === 0 && !loading && (
                <p className="text-center text-[#969696] py-8">
                  No payment methods available. Please contact support.
                </p>
              )}

              <p className="text-xs text-[#969696] text-center mt-6">
                Your subscription will be activated immediately after successful
                payment. You can cancel anytime from your account settings.
              </p>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
