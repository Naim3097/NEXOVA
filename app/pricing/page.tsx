'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { profileAtom } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Sparkles } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: 0,
    interval: 'forever',
    description: 'Perfect for getting started',
    features: [
      { text: '3 projects', included: true },
      { text: 'Subdomain URLs (username.domain.com)', included: true },
      { text: 'All page elements', included: true },
      { text: 'Form submissions', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Template library', included: true },
      { text: 'Auto-save & version history', included: true },
      { text: 'Community support', included: true },
      { text: 'Unlimited projects', included: false },
      { text: 'Custom domains', included: false },
      { text: 'Priority support', included: false },
      { text: 'Advanced analytics', included: false },
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: 29,
    interval: 'month',
    description: 'For serious creators and businesses',
    features: [
      { text: 'Unlimited projects', included: true },
      { text: 'Subdomain URLs (username.domain.com)', included: true },
      { text: 'Custom domains (www.yourdomain.com)', included: true },
      { text: 'All page elements', included: true },
      { text: 'Form submissions', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Template library', included: true },
      { text: 'Auto-save & version history', included: true },
      { text: 'Priority support', included: true },
      { text: 'Remove branding (coming soon)', included: true },
      { text: 'API access (coming soon)', included: true },
      { text: 'Team collaboration (coming soon)', included: true },
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const profile = useAtomValue(profileAtom);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (planName: string) => {
    if (!profile) {
      router.push('/login?redirect=/pricing');
      return;
    }

    if (planName === 'Free') {
      // Free plan - just redirect to dashboard
      router.push('/dashboard');
      return;
    }

    if (planName === 'Pro') {
      // Redirect to subscription checkout
      setLoading(planName);
      router.push('/dashboard/subscription/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              X.IDE
            </Link>
            <div className="flex items-center gap-4">
              {profile ? (
                <Button onClick={() => router.push('/dashboard')}>
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => router.push('/login')}>
                    Login
                  </Button>
                  <Button onClick={() => router.push('/signup')}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start free and upgrade when you need more power. No hidden fees, cancel anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? 'border-2 border-blue-500 shadow-xl'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold mb-2">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600">
                      /{plan.interval}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3"
                    >
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          feature.included
                            ? 'text-gray-700'
                            : 'text-gray-400 line-through'
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  size="lg"
                  onClick={() => handleSelectPlan(plan.name)}
                  disabled={loading === plan.name || (profile?.subscription_plan === plan.name.toLowerCase())}
                >
                  {loading === plan.name
                    ? 'Loading...'
                    : profile?.subscription_plan === plan.name.toLowerCase()
                    ? 'Current Plan'
                    : plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade to Pro at any time from your dashboard. If you downgrade from Pro to Free, you'll keep your Pro features until the end of your billing period.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">
                What happens if I exceed the 3 project limit on Free?
              </h3>
              <p className="text-gray-600">
                You'll need to upgrade to Pro to create more than 3 projects. Your existing projects will remain active and accessible.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">
                How do custom domains work?
              </h3>
              <p className="text-gray-600">
                Pro users can connect their own custom domains (like www.yourdomain.com) to their published pages. We provide simple DNS instructions to set this up.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) and online banking through our payment partner LeanX Gateway.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">
                Is there a refund policy?
              </h3>
              <p className="text-gray-600">
                Yes! We offer a 14-day money-back guarantee. If you're not satisfied with Pro within the first 14 days, contact us for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2026 X.IDE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
