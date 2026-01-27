'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getCsrfToken } from '@/lib/csrf';

interface UpgradePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PlanFeature {
  name: string;
  free: boolean | string;
  premium: boolean | string;
  enterprise: boolean | string;
}

interface Bank {
  id: string;
  name: string;
  type: 'WEB_PAYMENT' | 'DIGITAL_PAYMENT';
  icon: string;
  logo?: string;
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

export function UpgradePlanModal({
  open,
  onOpenChange,
}: UpgradePlanModalProps) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [step, setStep] = useState<'plans' | 'banks'>('plans');
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const currentPlan = profile?.subscription_plan || 'free';

  const handleUpgrade = async (plan: 'premium' | 'enterprise') => {
    if (plan === 'enterprise') {
      // Submit enterprise inquiry
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
            page_source: 'upgrade_modal',
          }),
        });

        if (response.ok) {
          alert(
            'Thank you for your interest! Our team will contact you shortly.'
          );
          onOpenChange(false);
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

    // Fetch bank list for premium payment
    setLoading('premium');
    try {
      const response = await fetch('/api/subscription/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken(),
        },
        body: JSON.stringify({ plan: 'premium' }),
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
        body: JSON.stringify({ plan: 'premium', bankId }),
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

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'string') {
      return (
        <span className="text-sm font-medium text-foreground">{value}</span>
      );
    }
    return value ? (
      <Check className="h-5 w-5 text-chart-2 mx-auto" />
    ) : (
      <span className="text-muted-foreground text-lg">—</span>
    );
  };

  // Group banks by type
  const fpxBanks = banks.filter((b) => b.type === 'WEB_PAYMENT');
  const eWallets = banks.filter((b) => b.type === 'DIGITAL_PAYMENT');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {step === 'plans' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <ArrowUpCircle className="h-6 w-6 text-yellow-500" />
                Upgrade Your Plan
              </DialogTitle>
              <DialogDescription>
                Choose the plan that best fits your needs. Unlock powerful
                features to grow your business.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* Free Plan */}
              <div
                className={`relative rounded-xl border-2 p-6 ${currentPlan === 'free' ? 'border-primary bg-primary/5' : 'border-border'}`}
              >
                {currentPlan === 'free' && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Current Plan
                  </Badge>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground">Free</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-foreground">
                      RM0
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
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
                className={`relative rounded-xl border-2 p-6 ${currentPlan === 'premium' ? 'border-chart-4 bg-chart-4/5' : 'border-chart-4'} shadow-lg`}
              >
                {currentPlan === 'premium' ? (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-chart-4 text-foreground">
                    Current Plan
                  </Badge>
                ) : (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-chart-4 to-chart-5">
                    Most Popular
                  </Badge>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold flex items-center justify-center gap-2 text-foreground">
                    <Crown className="h-5 w-5 text-chart-4" />
                    Premium
                  </h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-foreground">
                      RM79
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Everything you need to scale
                  </p>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-chart-4 to-chart-5 hover:from-chart-4/90 hover:to-chart-5/90"
                  onClick={() => handleUpgrade('premium')}
                  disabled={currentPlan === 'premium' || loading === 'premium'}
                >
                  {loading === 'premium' ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : currentPlan === 'premium' ? (
                    'Current Plan'
                  ) : (
                    'Upgrade Now'
                  )}
                </Button>
              </div>

              {/* Enterprise Plan */}
              <div
                className={`relative rounded-xl border-2 p-6 ${currentPlan === 'enterprise' ? 'border-chart-3 bg-chart-3/5' : 'border-border'}`}
              >
                {currentPlan === 'enterprise' && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-chart-3">
                    Current Plan
                  </Badge>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold flex items-center justify-center gap-2 text-foreground">
                    <Building2 className="h-5 w-5 text-chart-3" />
                    Enterprise
                  </h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-foreground">
                      Custom
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    For large scale operations
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-chart-3 text-chart-3 hover:bg-chart-3/10"
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
            <div className="mt-8">
              <h4 className="font-semibold text-foreground mb-4">
                Feature Comparison
              </h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full table-fixed">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-[40%]">
                        Feature
                      </th>
                      <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground w-[20%]">
                        Free
                      </th>
                      <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground w-[20%]">
                        Premium
                      </th>
                      <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground w-[20%]">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {planFeatures.map((feature, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm text-foreground">
                          {feature.name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center">
                            {renderFeatureValue(feature.free)}
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

            <p className="text-xs text-muted-foreground text-center mt-4">
              All plans include access to the page builder, publishing, and form
              submissions. Premium features unlock when you upgrade.
            </p>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-chart-4" />
                Select Payment Method
              </DialogTitle>
              <DialogDescription>
                Choose your preferred payment method to complete your Premium
                subscription.
              </DialogDescription>
            </DialogHeader>

            <Button
              variant="ghost"
              size="sm"
              className="mt-2 mb-4"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Button>

            {/* Order Summary */}
            <div className="bg-chart-4/10 border border-chart-4/30 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold flex items-center gap-2 text-foreground">
                    <Crown className="h-4 w-4 text-chart-4" />
                    Premium Plan
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Monthly subscription
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">RM79</p>
                  <p className="text-xs text-muted-foreground">/month</p>
                </div>
              </div>
            </div>

            {/* FPX / Online Banking */}
            {fpxBanks.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-sm text-muted-foreground">
                  Online Banking (FPX)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {fpxBanks.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => handleBankSelect(bank.id)}
                      disabled={loading === 'bank'}
                      className={`
                        p-3 border rounded-lg text-center hover:border-chart-4 hover:bg-chart-4/5 transition-colors
                        ${selectedBank === bank.id ? 'border-chart-4 bg-chart-4/5' : 'border-border'}
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
                          <CreditCard className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <p className="text-xs text-foreground truncate">
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
              <div>
                <h4 className="font-medium mb-3 text-sm text-muted-foreground">
                  E-Wallets
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {eWallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => handleBankSelect(wallet.id)}
                      disabled={loading === 'bank'}
                      className={`
                        p-3 border rounded-lg text-center hover:border-chart-4 hover:bg-chart-4/5 transition-colors
                        ${selectedBank === wallet.id ? 'border-chart-4 bg-chart-4/5' : 'border-border'}
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
                          <CreditCard className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <p className="text-xs text-foreground truncate">
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
              <p className="text-center text-muted-foreground py-8">
                No payment methods available. Please contact support.
              </p>
            )}

            <p className="text-xs text-muted-foreground text-center mt-6">
              Your subscription will be activated immediately after successful
              payment. You can cancel anytime from your account settings.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
