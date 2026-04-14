import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { AnimationShowcase } from '@/components/elements/AnimationShowcase';

// Re-generate at most once per day on Vercel (ISR)
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Elements — UI Animations & Layouts | Nexova',
  description:
    'Explore 100+ production-ready UI animations and 29 pre-built section layouts. Drag into X.IDE or copy the code directly into your project.',
  alternates: { canonical: 'https://nexova.co/elements' },
  openGraph: {
    title: 'Elements — UI Animations & Layouts | Nexova',
    description:
      '100+ UI animations and 29 layouts — free to preview, drag-and-drop with X.IDE.',
    url: 'https://nexova.co/elements',
    type: 'website',
  },
};

const ANIMATION_CATEGORIES = [
  { label: '3D & Immersion', count: 14 },
  { label: 'Interaction', count: 18 },
  { label: 'Typography', count: 12 },
  { label: 'Background', count: 16 },
  { label: 'Vector', count: 10 },
  { label: 'Scroll', count: 15 },
  { label: 'Micro-interactions', count: 20 },
];

const LAYOUT_CATEGORIES = [
  { label: 'Headers / Navbars', count: 3 },
  { label: 'Hero Sections', count: 6 },
  { label: 'Features', count: 5 },
  { label: 'Pricing', count: 2 },
  { label: 'Testimonials', count: 2 },
  { label: 'CTA Blocks', count: 3 },
  { label: 'Gallery', count: 1 },
  { label: 'Stats', count: 1 },
  { label: 'FAQ', count: 1 },
  { label: 'Contact', count: 1 },
  { label: 'Blog Grid', count: 1 },
  { label: 'Footers', count: 2 },
];

const ANIMATION_HIGHLIGHTS = [
  {
    title: 'Real-Time Rendering',
    category: '3D & Immersion',
    description:
      'Hyper-realistic 3D environments adding depth, detail, and interactivity.',
    icon: 1,
  },
  {
    title: 'Scrollytelling',
    category: 'Interaction',
    description:
      'Narrative-driven scroll experiences that guide users through your story.',
    icon: 2,
  },
  {
    title: 'Expressive Typography',
    category: 'Typography',
    description:
      'Bold kinetic type and glitch effects to convey brand personality.',
    icon: 3,
  },
  {
    title: 'Ambient Background Motion',
    category: 'Background',
    description:
      'Subtle gradients, particles and liquid flows creating depth and atmosphere.',
    icon: 4,
  },
  {
    title: 'Magnetic Cursor Effects',
    category: 'Interaction',
    description:
      'UI elements that attract, repel, or warp in response to cursor proximity.',
    icon: 5,
  },
  {
    title: 'Morphing SVGs',
    category: 'Vector',
    description:
      'Smooth shape-to-shape transitions driven by scroll or user actions.',
    icon: 6,
  },
];

export default function ElementsPage() {
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
                name: 'Elements',
                item: 'https://nexova.co/elements',
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
              UI Elements Library
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight">
              100+ animations.{' '}
              <span className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] bg-clip-text text-transparent">
                29 layouts.
              </span>{' '}
              Zero compromises.
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
              Production-ready UI components — freely explorable in the browser,
              drag-and-drop inside X.IDE.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/builder">
                <Button className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full px-8 py-3 shadow-md border-0">
                  Open in X.IDE Builder
                </Button>
              </Link>
              <Link href="/elements/layouts">
                <Button variant="outline" className="rounded-full px-8 py-3">
                  Browse Layouts
                </Button>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-gray-50 border-y border-gray-100 py-10">
        <RevealOnScroll>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl grid grid-cols-3 gap-8 text-center">
            {[
              { value: '100+', label: 'Animations' },
              { value: '29', label: 'Layout Sections' },
              { value: 'Free', label: 'to Preview' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] bg-clip-text text-transparent">
                  {value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      {/* Live Elements demo embed */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <RevealOnScroll>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Animation library — live preview
              </h2>
              <p className="text-gray-500">
                Every card below is a real, working animation — CSS only, no
                JavaScript required.
              </p>
            </div>
          </RevealOnScroll>

          {/* Category pills */}
          <RevealOnScroll delay={100}>
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {ANIMATION_CATEGORIES.map(({ label, count }) => (
                <span
                  key={label}
                  className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 bg-gray-50"
                >
                  {label}
                  <span className="ml-2 text-xs font-semibold text-[#5FC7CD]">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          </RevealOnScroll>

          {/* Animated demo cards */}
          <RevealOnScroll delay={100}>
            <AnimationShowcase />
          </RevealOnScroll>
        </div>
      </section>

      {/* Layouts section */}
      <section className="bg-gray-50 py-20" id="layouts">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Pre-built layouts
              </h2>
              <p className="text-gray-500">
                29 battle-tested section blocks — pick, drop, ship.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {LAYOUT_CATEGORIES.map(({ label, count }) => (
              <RevealOnScroll key={label} delay={80}>
                <Link href="/elements/layouts">
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#5BC0BE]/40 hover:shadow-md transition-all cursor-pointer group text-center">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5BC0BE]/20 to-[#7C74EA]/20 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-[#5BC0BE] transition-colors">
                      {label}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {count} layouts
                    </p>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={100}>
            <div className="text-center mt-10">
              <Link href="/elements/layouts">
                <Button className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full px-10 py-3 shadow-md border-0">
                  Explore all layouts
                </Button>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] py-20 text-white text-center">
        <RevealOnScroll>
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Use elements inside X.IDE
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Every animation and layout block is one click away inside the
              builder.
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
