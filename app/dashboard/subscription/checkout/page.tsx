'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionCheckoutPage() {
  const router = useRouter();
  const profile = useAtomValue(profileAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  // Form state
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: profile?.email || '',
  });

  const pricing = {
    monthly: 29,
    yearly: 290, // ~$24.17/month - 2 months free
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Create subscription via API
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'pro',
          billing_interval: billingInterval,
          payment_method: {
            card_number: formData.cardNumber.replace(/\s/g, ''),
            card_name: formData.cardName,
            expiry_date: formData.expiryDate,
            cvv: formData.cvv,
          },
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription');
      }

      // Redirect to success page
      router.push('/dashboard/subscription/success');
    } catch (err) {
      console.error('Subscription error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to process payment'
      );
    } finally {
      setLoading(false);
    }
  };

  // Check if user is already on Pro
  if (profile?.subscription_plan === 'pro') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Already Subscribed</CardTitle>
              <CardDescription>You're already on the Pro plan!</CardDescription>
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="text-primary hover:text-primary/80 flex items-center gap-2 mb-4"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              Upgrade to Pro
            </h1>
            <p className="text-muted-foreground mt-2">
              Get unlimited projects, custom domains, and priority support
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>
                    Your payment is secure and encrypted
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Billing Interval Toggle */}
                    <div>
                      <Label>Billing Cycle</Label>
                      <div className="flex gap-4 mt-2">
                        <button
                          type="button"
                          onClick={() => setBillingInterval('monthly')}
                          className={`flex-1 p-4 border-2 rounded-xl transition-colors ${
                            billingInterval === 'monthly'
                              ? 'border-[#5FC7CD] bg-[#5FC7CD]/5'
                              : 'border-[#E2E8F0] hover:border-[#969696]'
                          }`}
                        >
                          <div className="font-semibold text-[#455263]">
                            Monthly
                          </div>
                          <div className="text-2xl font-bold mt-1 text-[#455263]">
                            $29
                          </div>
                          <div className="text-sm text-[#969696]">
                            per month
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillingInterval('yearly')}
                          className={`flex-1 p-4 border-2 rounded-xl transition-colors relative ${
                            billingInterval === 'yearly'
                              ? 'border-[#5FC7CD] bg-[#5FC7CD]/5'
                              : 'border-[#E2E8F0] hover:border-[#969696]'
                          }`}
                        >
                          <div className="absolute -top-2 -right-2 bg-green-700 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            Save 17%
                          </div>
                          <div className="font-semibold text-[#455263]">
                            Yearly
                          </div>
                          <div className="text-2xl font-bold mt-1 text-[#455263]">
                            $290
                          </div>
                          <div className="text-sm text-[#969696]">
                            ~$24/month
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                        required
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Card Number */}
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) =>
                            handleInputChange(
                              'cardNumber',
                              formatCardNumber(e.target.value)
                            )
                          }
                          required
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#969696]" />
                      </div>
                    </div>

                    {/* Card Name */}
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        type="text"
                        value={formData.cardName}
                        onChange={(e) =>
                          handleInputChange('cardName', e.target.value)
                        }
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          type="text"
                          value={formData.expiryDate}
                          onChange={(e) =>
                            handleInputChange(
                              'expiryDate',
                              formatExpiryDate(e.target.value)
                            )
                          }
                          required
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="text"
                          value={formData.cvv}
                          onChange={(e) =>
                            handleInputChange(
                              'cvv',
                              e.target.value.replace(/\D/g, '').substring(0, 4)
                            )
                          }
                          required
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 text-[#EF4444]">
                        {error}
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        'Processing...'
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Subscribe - ${pricing[billingInterval]}/
                          {billingInterval === 'monthly' ? 'month' : 'year'}
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By subscribing, you agree to our Terms of Service and
                      Privacy Policy. You can cancel anytime.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-[#455263] mb-3">
                      Pro Plan Includes:
                    </h3>
                    <ul className="space-y-2">
                      {[
                        'Unlimited projects',
                        'Custom domains',
                        'Subdomain URLs',
                        'Advanced analytics',
                        'Priority support',
                        'All page elements',
                        'Form submissions',
                        'Auto-save & versions',
                      ].map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
                          <span className="text-[#969696]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-[#E2E8F0] pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-[#969696]">
                        Pro Plan ({billingInterval})
                      </span>
                      <span className="font-semibold text-[#455263]">
                        ${pricing[billingInterval]}
                      </span>
                    </div>
                    {billingInterval === 'yearly' && (
                      <div className="flex justify-between mb-2 text-sm text-green-700">
                        <span>Savings (vs monthly)</span>
                        <span>-$58</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t border-[#E2E8F0] pt-2">
                      <span className="text-[#455263]">Total Due Today</span>
                      <span className="text-[#455263]">
                        ${pricing[billingInterval]}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#5FC7CD]/10 border border-[#5FC7CD]/20 rounded-2xl p-3 text-sm">
                    <p className="font-semibold text-[#455263] mb-1">
                      14-Day Money-Back Guarantee
                    </p>
                    <p className="text-[#969696]">
                      Try Pro risk-free. Get a full refund if you're not
                      satisfied within 14 days.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
