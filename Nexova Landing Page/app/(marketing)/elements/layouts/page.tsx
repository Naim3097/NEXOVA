import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

// Re-generate at most once per day on Vercel (ISR)
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Layout Sections — Nexova Elements',
  description:
    '29 pre-built layout sections — headers, heroes, features, pricing, testimonials, CTAs and more. Open in X.IDE or copy the code.',
  alternates: { canonical: 'https://nexova.co/elements/layouts' },
  openGraph: {
    title: 'Layout Sections — Nexova Elements',
    description: '29 pre-built responsive section layouts for every page.',
    url: 'https://nexova.co/elements/layouts',
    type: 'website',
  },
};

const LAYOUTS = [
  {
    id: 'modern-header',
    title: 'Modern Header',
    category: 'Header',
    description:
      'Responsive header with mega menu and transparent glassmorphism effect.',
  },
  {
    id: 'centered-header',
    title: 'Centered Header',
    category: 'Header',
    description: 'Minimal centered nav — perfect for SaaS and portfolio sites.',
  },
  {
    id: 'sidebar-navigation',
    title: 'Sidebar Navigation',
    category: 'Header',
    description: 'Off-canvas sidebar nav with smooth open/close transitions.',
  },
  {
    id: 'grid-hero',
    title: 'Grid Hero',
    category: 'Hero',
    description: 'Bold asymmetric grid hero with image-text split.',
  },
  {
    id: 'split-screen-hero',
    title: 'Split Screen Hero',
    category: 'Hero',
    description:
      'Left content, right full-bleed visual — timeless conversion layout.',
  },
  {
    id: 'video-background-hero',
    title: 'Video Background Hero',
    category: 'Hero',
    description: 'Cinematic video hero with overlay text and dual CTA buttons.',
  },
  {
    id: 'typographic-hero',
    title: 'Typographic Hero',
    category: 'Hero',
    description: 'Typography-led hero with animated text reveal.',
  },
  {
    id: 'slider-hero',
    title: 'Slider Hero',
    category: 'Hero',
    description: 'Auto-advancing hero carousel with dot pagination.',
  },
  {
    id: 'form-hero',
    title: 'Form Hero',
    category: 'Hero',
    description: 'Email capture hero — optimised for lead generation.',
  },
  {
    id: 'bento-grid-features',
    title: 'Bento Grid Features',
    category: 'Features',
    description: 'Pinterest-style bento grid for feature showcases.',
  },
  {
    id: 'alternating-features',
    title: 'Alternating Features',
    category: 'Features',
    description:
      'Image + text rows alternating left-right for deep storytelling.',
  },
  {
    id: 'card-grid-features',
    title: 'Card Grid Features',
    category: 'Features',
    description: 'Classic 3-column icon card grid — clear and scannable.',
  },
  {
    id: 'tabbed-features',
    title: 'Tabbed Features',
    category: 'Features',
    description:
      'Tab-switched content panel keeping long feature lists manageable.',
  },
  {
    id: 'sticky-scroll-features',
    title: 'Sticky Scroll Features',
    category: 'Features',
    description: 'Left text sticks while right panel scrolls through features.',
  },
  {
    id: 'simple-pricing-cards',
    title: 'Pricing Cards',
    category: 'Pricing',
    description:
      'Clean 3-tier pricing cards with highlighted recommended plan.',
  },
  {
    id: 'comparison-pricing-table',
    title: 'Comparison Table',
    category: 'Pricing',
    description: 'Full feature comparison table for complex SaaS pricing.',
  },
  {
    id: 'testimonial-marquee',
    title: 'Testimonial Marquee',
    category: 'Testimonials',
    description: 'Infinite-scroll marquee of customer quotes.',
  },
  {
    id: 'testimonial-grid',
    title: 'Testimonial Grid',
    category: 'Testimonials',
    description: 'Masonry-style testimonial grid with star ratings.',
  },
  {
    id: 'gradient-cta',
    title: 'Gradient CTA',
    category: 'CTA',
    description: 'Full-width gradient band with headline and action button.',
  },
  {
    id: 'split-image-cta',
    title: 'Split Image CTA',
    category: 'CTA',
    description: 'Visual half + action half — high-conversion CTA layout.',
  },
  {
    id: 'newsletter-section',
    title: 'Newsletter Section',
    category: 'CTA',
    description: 'Email subscription section with subtle background treatment.',
  },
  {
    id: 'team-grid',
    title: 'Team Grid',
    category: 'Team',
    description: 'Profile cards in a responsive grid with role labels.',
  },
  {
    id: 'masonry-gallery',
    title: 'Masonry Gallery',
    category: 'Gallery',
    description: 'CSS masonry image gallery with hover overlay.',
  },
  {
    id: 'animated-stats',
    title: 'Animated Stats',
    category: 'Stats',
    description: 'Number counters that animate into view on scroll.',
  },
  {
    id: 'accordion-faq',
    title: 'Accordion FAQ',
    category: 'FAQ',
    description: 'Accessible expand/collapse accordion for FAQ content.',
  },
  {
    id: 'split-contact',
    title: 'Split Contact',
    category: 'Contact',
    description: 'Contact form with map or image on the opposing half.',
  },
  {
    id: 'blog-grid',
    title: 'Blog Grid',
    category: 'Blog',
    description: 'Card-based blog post grid with category tags.',
  },
  {
    id: 'timeline',
    title: 'Process Timeline',
    category: 'Process',
    description: 'Vertical / horizontal timeline for step-by-step processes.',
  },
  {
    id: 'logo-cloud',
    title: 'Logo Cloud',
    category: 'Logos',
    description: 'Trusted-by logo cloud with optional marquee scroll.',
  },
  {
    id: 'minimal-footer',
    title: 'Minimal Footer',
    category: 'Footer',
    description: 'Clean single-row footer — brand, links, copyright.',
  },
  {
    id: 'large-footer',
    title: 'Large Footer',
    category: 'Footer',
    description: '4-column footer with rich link hierarchy and social icons.',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Header: 'bg-blue-50 text-blue-600',
  Hero: 'bg-purple-50 text-purple-600',
  Features: 'bg-teal-50 text-teal-600',
  Pricing: 'bg-emerald-50 text-emerald-600',
  Testimonials: 'bg-orange-50 text-orange-600',
  CTA: 'bg-rose-50 text-rose-600',
  Team: 'bg-indigo-50 text-indigo-600',
  Gallery: 'bg-pink-50 text-pink-600',
  Stats: 'bg-amber-50 text-amber-600',
  FAQ: 'bg-cyan-50 text-cyan-600',
  Contact: 'bg-sky-50 text-sky-600',
  Blog: 'bg-violet-50 text-violet-600',
  Process: 'bg-lime-50 text-lime-600',
  Logos: 'bg-gray-100 text-gray-600',
  Footer: 'bg-slate-100 text-slate-600',
};

export default function LayoutsPage() {
  const uniqueCategories = [...new Set(LAYOUTS.map((l) => l.category))];

  return (
    <>
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
                name: 'Elements',
                item: 'https://nexova.co/elements',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Layouts',
                item: 'https://nexova.co/elements/layouts',
              },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-white pt-20 pb-12 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <RevealOnScroll>
            <nav
              aria-label="Breadcrumb"
              className="flex justify-center gap-2 text-sm text-gray-400 mb-6"
            >
              <Link
                href="/elements"
                className="hover:text-gray-700 transition-colors"
              >
                Elements
              </Link>
              <span>/</span>
              <span className="text-gray-600">Layouts</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight">
              <span className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] bg-clip-text text-transparent">
                29 layout sections
              </span>{' '}
              — pick and build
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
              Every section type you need, production-ready. Drag into X.IDE or
              copy the source code.
            </p>
            <Link href="/builder">
              <Button className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full px-8 py-3 shadow-md border-0">
                Open in X.IDE Builder
              </Button>
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* Category jump bar */}
      <section className="bg-white border-b border-gray-100 sticky top-20 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-3 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 min-w-max">
            {uniqueCategories.map((cat) => (
              <a
                key={cat}
                href={`#${cat.toLowerCase()}`}
                className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border border-gray-200 text-gray-600 hover:border-[#5BC0BE] hover:text-[#5BC0BE] transition-colors"
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Layouts grid grouped by category */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-16">
          {uniqueCategories.map((cat) => (
            <div key={cat} id={cat.toLowerCase()}>
              <RevealOnScroll>
                <h2 className="text-xl font-bold text-gray-900 mb-6">{cat}</h2>
              </RevealOnScroll>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {LAYOUTS.filter((l) => l.category === cat).map((layout) => (
                  <RevealOnScroll key={layout.id} delay={80}>
                    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Preview placeholder */}
                      <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-xs text-gray-300 group-hover:from-[#5BC0BE]/5 group-hover:to-[#7C74EA]/5 transition-all duration-300">
                        Preview
                      </div>
                      <div className="p-5">
                        <span
                          className={`inline-block text-xs font-semibold rounded-full px-2.5 py-0.5 mb-2 ${
                            CATEGORY_COLORS[cat] || 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {layout.category}
                        </span>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {layout.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">
                          {layout.description}
                        </p>
                        <Link href="/builder">
                          <Button
                            size="sm"
                            className="w-full bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full border-0 text-xs"
                          >
                            Use in Builder
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] py-20 text-white text-center">
        <RevealOnScroll>
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Build faster with X.IDE
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Every layout block is available in the builder. Pick one, fill in
              your content, publish.
            </p>
            <Link href="/builder">
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
