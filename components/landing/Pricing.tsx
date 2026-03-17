'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function Pricing() {
  const router = useRouter();
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'Get started for free',
      cta: 'Get Started Free',
      highlight: false,
    },
    {
      name: 'Premium',
      price: '79',
      description: 'Everything you need to scale',
      cta: 'Upgrade to Premium',
      highlight: true,
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M6 3h12l4 6-10 13L2 9z" />
          <path d="M11 3 8 9l4 13 4-13-3-6" />
        </svg>
      ),
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large scale operations',
      cta: 'Contact Us',
      highlight: false,
      isCustom: true,
    },
  ];

  const features = [
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
    {
      name: 'Custom Domain',
      free: false,
      premium: true,
      enterprise: true,
      locked: true,
    },
    {
      name: 'Analytics Dashboard',
      free: false,
      premium: true,
      enterprise: true,
      locked: true,
    },
    {
      name: 'Tracking Pixels (Meta, TikTok, Google)',
      free: false,
      premium: true,
      enterprise: true,
      locked: true,
    },
    {
      name: 'Bump Offer / Upsell',
      free: false,
      premium: true,
      enterprise: true,
      locked: true,
    },
    {
      name: 'Google Sheets Integration',
      free: false,
      premium: true,
      enterprise: true,
      locked: true,
    },
    {
      name: 'Version Control',
      free: false,
      premium: true,
      enterprise: true,
      locked: true,
    },
    {
      name: 'Priority Support',
      free: false,
      premium: true,
      enterprise: true,
      locked: true,
    },
    {
      name: 'E-Invoice Integration',
      free: false,
      premium: 'Coming Soon',
      enterprise: 'Coming Soon',
      locked: true,
    },
    {
      name: 'Affiliate Management',
      free: false,
      premium: 'Coming Soon',
      enterprise: 'Coming Soon',
      locked: true,
    },
    {
      name: 'Dedicated Account Manager',
      free: false,
      premium: true,
      enterprise: true,
      locked: true,
    },
    {
      name: 'Done-For-You Growth Services',
      free: false,
      premium: false,
      enterprise: 'view_services',
      locked: true,
    },
  ];

  const customServices = [
    'Social Media Management',
    'Business Operation Management System',
    'META Ads (Facebook & Instagram)',
    'Google Ads',
    'Website Creation',
    'Google SEO',
    'Google My Business Setup',
  ];

  const renderFeatureValue = (value: string | boolean, isLocked = false) => {
    if (typeof value === 'string') {
      if (value === 'Coming Soon')
        return <span className="font-medium text-gray-900">{value}</span>;
      if (value === 'view_services') {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsServicesOpen(true)}
            className="text-[#5BC0BE] hover:text-[#4aaeb0] hover:bg-[#5BC0BE]/10 font-bold"
          >
            Explore Services
          </Button>
        );
      }
      return <span className="font-bold text-gray-900">{value}</span>;
    }

    if (value === true) {
      return (
        <div className="flex justify-center">
          <div className="rounded-full bg-[#5BC0BE] p-1">
            <Check className="h-4 w-4 text-white" />
          </div>
        </div>
      );
    }

    if (value === false) {
      if (isLocked) {
        return (
          <div className="flex justify-center">
            <Lock className="h-5 w-5 text-gray-300" />
          </div>
        );
      }
      return (
        <div className="flex justify-center">
          <div className="rounded-full border border-gray-300 p-1">
            <X className="h-4 w-4 text-gray-300" />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="py-24 bg-white font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Upgrade Your Plan
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Choose the plan that best fits your needs. Unlock powerful
              features to grow your business.
            </p>
          </div>
        </RevealOnScroll>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <RevealOnScroll key={plan.name} delay={index * 100}>
              <div
                className={cn(
                  'relative rounded-3xl p-8 flex flex-col h-full bg-white transition-all duration-300',
                  plan.highlight
                    ? 'bg-gradient-to-b from-[#5BC0BE] to-[#7C74EA] text-white shadow-xl scale-105 z-10 p-[2px]' // Border gradient hack
                    : 'border border-gray-100 shadow-sm'
                )}
              >
                <div
                  className={cn(
                    'w-full h-full rounded-[22px] p-8 flex flex-col items-center',
                    plan.highlight
                      ? 'bg-gradient-to-b from-[#5BC0BE] to-[#7C74EA] text-white'
                      : 'bg-white'
                  )}
                >
                  <div
                    className={cn(
                      'text-lg font-medium mb-8',
                      plan.highlight
                        ? 'text-white flex items-center'
                        : 'text-[#5BC0BE]'
                    )}
                  >
                    {plan.highlight && plan.icon}
                    {plan.name}
                  </div>

                  <div className="mb-4 text-center">
                    {plan.isCustom ? (
                      <span
                        className={cn(
                          'text-4xl md:text-5xl font-bold',
                          plan.highlight ? 'text-white' : 'text-gray-900'
                        )}
                      >
                        {plan.price}
                      </span>
                    ) : (
                      <div className="flex items-start justify-center">
                        <span
                          className={cn(
                            'text-xl mr-1 mt-2 font-medium',
                            plan.highlight ? 'text-white/90' : 'text-gray-500'
                          )}
                        >
                          RM
                        </span>
                        <span
                          className={cn(
                            'text-6xl font-bold',
                            plan.highlight ? 'text-white' : 'text-gray-900'
                          )}
                        >
                          {plan.price}
                        </span>
                        <span
                          className={cn(
                            'self-end mb-2 ml-1',
                            plan.highlight ? 'text-white/80' : 'text-gray-400'
                          )}
                        >
                          /mo
                        </span>
                      </div>
                    )}
                  </div>

                  <p
                    className={cn(
                      'text-sm mb-10 text-center',
                      plan.highlight ? 'text-white/90' : 'text-gray-400'
                    )}
                  >
                    {plan.description}
                  </p>

                  <div className="mt-auto w-full">
                    <Button
                      className={cn(
                        'w-full rounded-full py-6 text-md font-medium transition-transform active:scale-95',
                        plan.highlight
                          ? 'bg-white text-gray-900 hover:bg-gray-50 border-0'
                          : 'bg-[#5BC0BE] text-white hover:bg-[#4aaeb0]'
                      )}
                      onClick={() => {
                        if (plan.isCustom) {
                          window.open('https://wa.me/60176069379', '_blank');
                        } else {
                          router.push(
                            `/signup?plan=${plan.name.toLowerCase()}`
                          );
                        }
                      }}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <RevealOnScroll delay={300}>
          <div className="overflow-x-auto max-w-6xl mx-auto rounded-3xl border border-gray-100 shadow-sm relative">
            <div className="min-w-[700px] md:min-w-[800px] bg-white">
              {/* Table Header */}
              <div className="grid grid-cols-4 bg-[#69C5C5] text-white py-6 px-2 md:px-6 font-medium rounded-t-3xl items-center text-sm md:text-base">
                <div className="pl-4"></div>
                <div className="text-center">Free</div>
                <div className="text-center">Premium</div>
                <div className="text-center">Enterprise</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 py-5 px-2 md:px-6 items-center hover:bg-gray-50 transition-colors"
                  >
                    {/* @ts-ignore */}
                    <div className="text-xs md:text-sm text-gray-500 font-medium pl-2 md:pl-4">
                      {feature.name}
                    </div>
                    <div className="text-center">
                      {/* @ts-ignore */}
                      {renderFeatureValue(
                        feature.free,
                        feature.name !== 'Projects' &&
                          feature.name !== 'Products'
                      )}
                    </div>
                    <div className="text-center">
                      {/* @ts-ignore */}
                      {renderFeatureValue(feature.premium)}
                    </div>
                    <div className="text-center">
                      {/* @ts-ignore */}
                      {renderFeatureValue(feature.enterprise)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Lean.x cross-link */}
        <RevealOnScroll delay={200}>
          <div className="mt-10 max-w-3xl mx-auto text-center">
            <p className="text-sm text-gray-400">
              Payments on all plans are powered by{' '}
              <a
                href="/leanx"
                className="text-[#5BC0BE] font-semibold hover:underline"
              >
                Lean.x
              </a>{' '}
              — accept FPX, GrabPay, Touch&apos;n Go, Boost, ShopeePay, and
              cards natively.{' '}
              <a
                href="/leanx"
                className="text-[#5BC0BE] font-medium hover:underline"
              >
                Learn how Lean.x works →
              </a>
            </p>
          </div>
        </RevealOnScroll>

        {/* Services Dialog */}
        <Dialog open={isServicesOpen} onOpenChange={setIsServicesOpen}>
          <DialogContent className="sm:max-w-md">
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Accelerate Your Growth
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Scale faster with our premium agency services, exclusive to
                Enterprise partners.
              </p>
              <ul className="space-y-3">
                {customServices.map((service, index) => (
                  <li
                    key={index}
                    className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg"
                  >
                    <Check className="h-5 w-5 text-[#5BC0BE] mr-3 shrink-0" />
                    <span className="font-medium text-sm">{service}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3">
                <Button className="w-full bg-[#5BC0BE] hover:bg-[#4aaeb0] text-white">
                  Contact Us for a Quote
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsServicesOpen(false)}
                  className="w-full text-gray-500 hover:text-gray-900"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
