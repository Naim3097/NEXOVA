'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mo',
    description: 'Perfect for trying out the builder and personal projects.',
    features: [
      '3 Projects',
      'Basic Templates',
      'HTML Export',
    ],
    cta: 'Get Started',
    href: '/signup',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'For professional marketers and agencies.',
    features: [
      'Unlimited Projects',
      'All Premium Templates',
      'Priority Support',
      'Custom Domain',
      'Advanced Analytics',
    ],
    cta: 'Upgrade to Pro',
    href: '/signup?plan=pro',
    popular: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start for free, upgrade when you need more power.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-lg border-2 overflow-hidden ${
                plan.popular
                  ? 'border-blue-500 bg-gray-900 text-white shadow-xl'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                </div>
              )}

              <div className="p-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>

                <div className="flex items-baseline mb-4">
                  <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-lg ml-1 ${plan.popular ? 'text-gray-300' : 'text-gray-600'}`}>
                    {plan.period}
                  </span>
                </div>

                <p className={`mb-6 ${plan.popular ? 'text-gray-300' : 'text-gray-600'}`}>
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-blue-400' : 'text-green-600'}`} />
                      <span className={plan.popular ? 'text-gray-200' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className="block">
                  <Button
                    size="lg"
                    className={`w-full ${
                      plan.popular
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
