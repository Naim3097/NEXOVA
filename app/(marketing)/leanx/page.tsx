import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import {
  CheckCircle,
  Zap,
  Shield,
  Globe,
  CreditCard,
  BarChart,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lean.x Payments — Accept Payments in Malaysia | Nexova',
  description:
    "Lean.x is Malaysia's modern payment gateway — built for developers and merchants. Integrate card, FPX, e-wallet, and BNPL payments in minutes.",
  alternates: { canonical: 'https://nexova.co/leanx' },
  openGraph: {
    title: 'Lean.x Payments — Accept Payments in Malaysia',
    description:
      'Modern Malaysian payment gateway. Cards, FPX, e-wallets, BNPL — all in one API.',
    url: 'https://nexova.co/leanx',
    type: 'website',
  },
};

const FEATURES = [
  {
    icon: CreditCard,
    title: 'All Malaysian payment methods',
    description:
      "Accept Visa/Mastercard, FPX online banking, GrabPay, Touch'n Go, Boost, ShopeePay, and BNPL — all through a single Lean.x integration.",
  },
  {
    icon: Zap,
    title: 'Fast developer API',
    description:
      'RESTful API with comprehensive documentation, sandbox environment, and SDKs. Go live in hours, not weeks.',
  },
  {
    icon: Shield,
    title: 'PCI DSS compliant',
    description:
      "Bank-grade encryption and PCI DSS Level 1 compliance. Your customers' data is always safe.",
  },
  {
    icon: Globe,
    title: 'Multi-currency support',
    description:
      'Settle in MYR with automatic currency detection for international customers.',
  },
  {
    icon: BarChart,
    title: 'Real-time dashboard',
    description:
      'Monitor transactions, refunds, and payouts in a clean, real-time merchant dashboard.',
  },
  {
    icon: CheckCircle,
    title: 'X.IDE native integration',
    description:
      'If you build with X.IDE, Lean.x connects in one click — no code required.',
  },
];

const PAYMENT_METHODS = [
  'Visa / Mastercard',
  'FPX Online Banking',
  'GrabPay',
  "Touch'n Go eWallet",
  'Boost',
  'ShopeePay',
  'Atome (BNPL)',
];

const PRICING_TIERS = [
  {
    name: 'Starter',
    rate: '2.5% + RM 0.50',
    description: 'For new businesses and side-projects.',
    features: [
      'All payment methods',
      'Sandbox environment',
      'Email support',
      'Basic dashboard',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Growth',
    rate: '2.0% + RM 0.30',
    description: 'For growing merchants processing RM20k+/month.',
    features: [
      'Everything in Starter',
      'Priority support',
      'Advanced analytics',
      'Webhook events',
      'Fraud shield',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    rate: 'Custom',
    description: 'Negotiated rates for high-volume merchants.',
    features: [
      'Everything in Growth',
      'Dedicated account manager',
      'Custom settlement schedule',
      'SLA guarantee',
      'On-premise option',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function LeanxPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://nexova.co',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Lean.x',
                item: 'https://nexova.co/leanx',
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Lean.x Payment Gateway',
            applicationCategory: 'FinancialApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'MYR',
              description: 'Free to start — pay per transaction only',
            },
          }),
        }}
      />

      {/* Hero */}
      <section
        id="how-it-works"
        className="bg-white pt-20 pb-20 text-center overflow-hidden relative"
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#5BC0BE]/5 via-transparent to-[#7C74EA]/5"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative">
          <RevealOnScroll>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5FC7CD] mb-4">
              Lean.x by Nexova
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight">
              Accept payments in Malaysia{' '}
              <span className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] bg-clip-text text-transparent">
                the modern way
              </span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
              One API. All payment methods Malaysians love — FPX, cards,
              e-wallets, and BNPL. No complicated setup. No surprises.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full px-8 py-3 shadow-md border-0">
                  Get Started — It&apos;s Free
                </Button>
              </Link>
              <a href="mailto:sales@nexova.co">
                <Button variant="outline" className="rounded-full px-8 py-3">
                  Contact Sales
                </Button>
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              No monthly fees. Pay only when you get paid.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Supported payment methods */}
      <section className="bg-gray-50 border-y border-gray-100 py-10">
        <RevealOnScroll>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
              Supported payment methods
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {PAYMENT_METHODS.map((method) => (
                <span
                  key={method}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Features grid */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Everything a Malaysian business needs
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Built from the ground up for the Malaysian market — compliant,
                fast, and developer-friendly.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <RevealOnScroll key={title} delay={100}>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-[#5BC0BE]/40 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5BC0BE]/20 to-[#7C74EA]/20 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#5BC0BE]" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Malaysian payment behaviour stats */}
      <section className="bg-gradient-to-br from-[#455263] to-[#2D2B4A] py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5FC7CD] mb-4">
                Malaysian market reality
              </span>
              <h2 className="text-3xl font-bold text-white mb-3">
                How Malaysians actually pay
              </h2>
              <p className="text-white/60 max-w-xl mx-auto">
                If your checkout doesn&apos;t support these methods, you&apos;re
                leaving money on the table.
              </p>
            </div>
          </RevealOnScroll>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                number: '87%',
                label:
                  'of Malaysians use e-wallets (GrabPay, TnG, Boost) for online shopping',
              },
              {
                number: '73%',
                label:
                  'expect instant payment confirmation — not hours, not days',
              },
              {
                number: '2.3×',
                label:
                  'more likely to complete purchase when their preferred method is available',
              },
              {
                number: '65%',
                label:
                  'abandon checkout if their payment method is not offered',
              },
            ].map(({ number, label }) => (
              <RevealOnScroll key={number} delay={100}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                  <span className="block text-4xl font-black bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] bg-clip-text text-transparent mb-3">
                    {number}
                  </span>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {label}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Security & compliance */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <RevealOnScroll>
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5FC7CD] mb-4">
                Enterprise-grade security
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Built for compliance from day one
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Infrastructure hosted in MY1 Data Centre, Cyberjaya — not some
                overseas cloud you can&apos;t verify.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Security', value: 'PCI-DSS Certified' },
                { label: 'Certificate', value: 'Trusted CA' },
                { label: 'Compliance', value: 'Sanction Filtration' },
                { label: 'Verification', value: 'Digital KYB/KYC' },
                { label: 'Support', value: '24/7 Available' },
                { label: 'Infrastructure', value: 'MY1 Data Centre' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center hover:border-[#5BC0BE]/40 hover:shadow-sm transition-all"
                >
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                    {label}
                  </p>
                  <p className="text-xs font-bold text-gray-800 leading-snug">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Malaysian merchant testimonials */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5FC7CD] mb-4">
                Real results
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Malaysian businesses already{' '}
                <span className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] bg-clip-text text-transparent">
                  winning
                </span>
              </h2>
            </div>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  'Dulu memang stress gila! 6 app payment kena manage, duit masuk seminggu kemudian. Sekarang dengan Lean.x, semua masuk satu dashboard je. Same-day settlement ni game changer — boleh restock barang trending terus. Sales naik 40%!',
                name: 'Siti Rahman',
                role: 'Owner, Butik Modest Wear — Wangsa Maju',
              },
              {
                quote:
                  'Sebagai pemilik kedai elektronik, cash flow memang penting. Lean.x bagi kita duit masuk hari yang sama — boleh bayar supplier terus! Customer pun suka sebab ada banyak pilihan payment. Setup pun cepat je, dalam sejam dah boleh operate!',
                name: 'Ahmad Fauzi',
                role: 'Owner, Tech Haven Electronics — Shah Alam',
              },
              {
                quote:
                  'Online business memang rely on payment gateway yang fast. Lean.x solve masalah besar kita — international customers pun boleh bayar, settlement cepat, dan fees lebih murah. Support team responsive 24/7. Terbaik untuk e-commerce!',
                name: 'Lisa Wong',
                role: 'Founder, HomeDecorMY — Penang',
              },
            ].map(({ quote, name, role }) => (
              <RevealOnScroll key={name} delay={100}>
                <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-md transition-all h-full flex flex-col">
                  <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-6">
                    &ldquo;{quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {name}
                    </p>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5FC7CD] mb-4">
                Industries
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Built for every Malaysian business
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Whether you sell online or offline, Lean.x adapts to your
                industry&apos;s unique payment needs.
              </p>
            </div>
          </RevealOnScroll>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {[
              {
                emoji: '🛍️',
                title: 'Retail',
                desc: 'Physical & online stores, POS integration, inventory reconciliation via same-day settlement.',
              },
              {
                emoji: '👗',
                title: 'Fashion & Apparel',
                desc: 'Boutiques and brand stores accepting instalments via Atome BNPL to increase basket size.',
              },
              {
                emoji: '🍜',
                title: 'Food & Beverage',
                desc: 'Restaurants, cloud kitchens, and catering — QR pay, GrabFood, and direct link checkout.',
              },
              {
                emoji: '💼',
                title: 'Professional Services',
                desc: 'Freelancers, agencies, and consultancies — instant invoice payment links via WhatsApp or email.',
              },
              {
                emoji: '📱',
                title: 'Electronics',
                desc: 'High-AOV stores benefit from FPX instant transfer & card payments with fraud shield built in.',
              },
            ].map(({ emoji, title, desc }) => (
              <RevealOnScroll key={title} delay={100}>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:border-[#5BC0BE]/40 hover:shadow-md transition-all h-full flex flex-col items-center">
                  <span className="text-4xl mb-4 block">{emoji}</span>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Go live in 3 steps
            </h2>
            <p className="text-gray-500 mb-12">
              From sign-up to first transaction in under a day.
            </p>
          </RevealOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create your account',
                description:
                  'Sign up free and complete KYB verification — usually approved within 24 hours.',
              },
              {
                step: '02',
                title: 'Integrate the API',
                description:
                  'Copy your API keys, follow our quickstart guide, and test in sandbox mode.',
              },
              {
                step: '03',
                title: 'Go live & get paid',
                description:
                  'Flip to production mode and start accepting real payments — settlement in T+1.',
              },
            ].map(({ step, title, description }) => (
              <RevealOnScroll key={step} delay={100}>
                <div className="text-center">
                  <span className="inline-block text-4xl font-black bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] bg-clip-text text-transparent mb-3">
                    {step}
                  </span>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-20" id="pricing">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Simple, transparent pricing
              </h2>
              <p className="text-gray-500">
                No monthly fees. No hidden charges.
              </p>
            </div>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_TIERS.map((tier) => (
              <RevealOnScroll key={tier.name} delay={100}>
                <div
                  className={`rounded-2xl border p-8 flex flex-col ${
                    tier.highlighted
                      ? 'bg-gradient-to-br from-[#5BC0BE] to-[#7C74EA] text-white border-transparent shadow-xl'
                      : 'bg-white border-gray-100 shadow-sm'
                  }`}
                >
                  <h3
                    className={`text-lg font-bold mb-1 ${
                      tier.highlighted ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={`text-2xl font-black mb-2 ${
                      tier.highlighted ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {tier.rate}
                  </p>
                  <p
                    className={`text-sm mb-6 ${
                      tier.highlighted ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {tier.description}
                  </p>
                  <ul className="space-y-3 flex-1 mb-8">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle
                          size={16}
                          className={
                            tier.highlighted
                              ? 'text-white/80'
                              : 'text-[#5BC0BE]'
                          }
                        />
                        <span
                          className={
                            tier.highlighted ? 'text-white/90' : 'text-gray-600'
                          }
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={
                      tier.name === 'Enterprise'
                        ? 'mailto:sales@nexova.co'
                        : '/signup'
                    }
                  >
                    <Button
                      className={`w-full rounded-full ${
                        tier.highlighted
                          ? 'bg-white text-[#5BC0BE] hover:bg-gray-50 border-0'
                          : 'bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white border-0'
                      }`}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <RevealOnScroll delay={100}>
            <p className="text-center text-sm text-gray-400 mt-10">
              Lean.x is included in all Nexova platform plans.{' '}
              <Link
                href="/pricing"
                className="text-[#5FC7CD] font-medium hover:underline"
              >
                Compare platform plans →
              </Link>
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] py-20 text-white text-center">
        <RevealOnScroll>
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to accept your first payment?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Sign up free and get your API keys in minutes.
            </p>
            <Link href="/signup">
              <Button className="bg-white text-[#5BC0BE] hover:bg-gray-50 font-semibold rounded-full px-10 py-3 shadow-md border-0">
                Create Free Account →
              </Button>
            </Link>
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
