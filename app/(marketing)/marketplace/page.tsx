import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { MarketplaceGrid } from '@/components/templates/MarketplaceGrid';

// Re-generate at most once per day (ISR) — allows adding new templates without a rebuild
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Template Marketplace — Nexova',
  description:
    'Browse 70+ professionally designed website templates for SaaS, e-commerce, agencies, portfolios, and more. Open in X.IDE and publish in minutes.',
  alternates: {
    canonical: 'https://nexova.co/marketplace',
  },
  openGraph: {
    title: 'Template Marketplace — Nexova',
    description: 'Browse 70+ professionally designed website templates.',
    url: 'https://nexova.co/marketplace',
    type: 'website',
  },
};

export default function MarketplacePage() {
  return (
    <>
      {/* JSON-LD breadcrumb */}
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
                name: 'Marketplace',
                item: 'https://nexova.co/marketplace',
              },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-white pt-20 pb-12 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <RevealOnScroll>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5FC7CD] mb-4">
              Template Marketplace
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight">
              Launch faster with a{' '}
              <span className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] bg-clip-text text-transparent">
                professional template
              </span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
              70+ expertly crafted templates for every industry. Open in X.IDE,
              customise in minutes, publish instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full px-8 py-3 shadow-md border-0">
                  Start Building Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="rounded-full px-8 py-3">
                  View Pricing
                </Button>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Interactive filter + grid — client component */}
      <MarketplaceGrid />

      {/* CTA band */}
      <section className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] py-20 text-white text-center">
        <RevealOnScroll>
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to build?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Pick a template, open it in X.IDE, and publish your site today.
            </p>
            <Link href="/signup">
              <Button className="bg-white text-[#5BC0BE] hover:bg-gray-50 font-semibold rounded-full px-10 py-3 shadow-md border-0">
                Launch X.IDE Builder →
              </Button>
            </Link>
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
