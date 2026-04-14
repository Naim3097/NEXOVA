import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Problem } from '@/components/landing/Problem';
import { Features } from '@/components/landing/Features';
import { Testimonials } from '@/components/landing/Testimonials';
import { Pipeline } from '@/components/landing/Pipeline';
import { JugglingTools } from '@/components/landing/JugglingTools';
import { GridFeatures } from '@/components/landing/GridFeatures';
import { BusinessTypes } from '@/components/landing/BusinessTypes';
import { Services } from '@/components/landing/Services';
import { Pricing } from '@/components/landing/Pricing';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

const APP_URL = 'https://nexova.co';

export const metadata: Metadata = {
  title: 'Nexova — Build, Publish & Grow',
  description:
    "X.IDE by Nexova lets Malaysian businesses build professional landing pages, manage inventory, and accept FPX, GrabPay, Touch'n Go & card payments — all in one platform. Start free.",
  alternates: { canonical: APP_URL },
  openGraph: {
    title: 'Nexova — Build, Publish & Grow',
    description:
      'Build landing pages with X.IDE, browse 70+ templates, use 100+ UI elements, and accept Malaysian payments with Lean.x.',
    url: APP_URL,
    type: 'website',
  },
};

const SOFTWARE_APP_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'X.IDE Builder by Nexova',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: `${APP_URL}/builder`,
  description:
    'No-code/low-code landing page builder with native Malaysian payment processing, inventory management, and conversion analytics.',
  offers: [
    { '@type': 'Offer', price: '0', priceCurrency: 'MYR', name: 'Free Plan' },
    {
      '@type': 'Offer',
      price: '79',
      priceCurrency: 'MYR',
      name: 'Premium Plan',
      billingIncrement: 'month',
    },
  ],
  featureList: [
    'Drag-and-drop page builder',
    'Native FPX & e-wallet payments via Lean.x',
    'Built-in inventory management',
    'Conversion analytics & pixel tracking',
    '70+ professional templates',
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(SOFTWARE_APP_SCHEMA),
        }}
      />
      <div className="flex min-h-screen flex-col font-sans">
        <Navbar />
        <main>
          <RevealOnScroll className="relative">
            <Hero />
          </RevealOnScroll>
          <RevealOnScroll delay={200} className="relative z-0">
            <Problem />
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <Features />
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <Testimonials />
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <Pipeline />
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <JugglingTools />
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <GridFeatures />
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <BusinessTypes />
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <Services />
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <Pricing />
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <CTA />
          </RevealOnScroll>
        </main>
        <Footer />
      </div>
    </>
  );
}
