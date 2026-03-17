import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

export const metadata: Metadata = {
  title: 'About Nexova — Building the future of web creation',
  description:
    'Nexova is a Malaysian technology company building tools that make professional web creation accessible to everyone — from solo founders to agencies.',
  alternates: { canonical: 'https://nexova.co/about' },
  openGraph: {
    title: 'About Nexova',
    description: 'Building the future of web creation in Malaysia.',
    url: 'https://nexova.co/about',
    type: 'website',
  },
};

const VALUES = [
  {
    title: 'Simplicity over complexity',
    description:
      'Every feature we ship reduces friction. If something is hard to use, we fix it before adding new things.',
  },
  {
    title: 'Design as a first-class concern',
    description:
      'Beautiful defaults. Every template, element, and interface is crafted to look great without customisation.',
  },
  {
    title: 'Speed for the builder',
    description:
      'Going from idea to live site should take hours, not weeks. We obsess over reducing every unnecessary step.',
  },
  {
    title: 'Transparent pricing',
    description:
      "No hidden fees. No lock-in. You always know what you're paying and why.",
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Nexova',
            url: 'https://nexova.co',
            description:
              'Malaysian technology company building modern web creation tools.',
            foundingLocation: 'Malaysia',
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-white pt-24 pb-16 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <RevealOnScroll>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5FC7CD] mb-4">
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Building the future of{' '}
              <span className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] bg-clip-text text-transparent">
                web creation
              </span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed">
              Nexova is a Malaysian technology company on a mission to make
              professional-grade web creation accessible to every business —
              from solo founders to full-service agencies.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <RevealOnScroll>
            <div className="bg-gradient-to-br from-[#5BC0BE]/10 to-[#7C74EA]/10 rounded-3xl p-10 sm:p-14 text-center border border-[#5BC0BE]/20">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Our mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                We believe anyone should be able to launch a world-class website
                without writing code, hiring an expensive agency, or fighting
                confusing tools. We&apos;re building X.IDE, a template
                marketplace, a UI element library, and Lean.x payments — all
                working together, all under one roof.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              What we believe in
            </h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {VALUES.map(({ title, description }) => (
              <RevealOnScroll key={title} delay={100}>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-7 hover:border-[#5BC0BE]/30 hover:shadow-sm transition-all">
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

      {/* Products strip */}
      <section className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
          <RevealOnScroll>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What we make
            </h2>
            <p className="text-gray-500 mb-10">
              Four products. One unified platform.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                {
                  name: 'X.IDE Builder',
                  desc: 'Drag-and-drop page builder',
                  href: '/builder',
                },
                {
                  name: 'Templates',
                  desc: '70+ pro website templates',
                  href: '/marketplace',
                },
                {
                  name: 'Elements',
                  desc: '100+ UI animations & layouts',
                  href: '/elements',
                },
                {
                  name: 'Lean.x',
                  desc: 'Malaysian payment gateway',
                  href: '/leanx',
                },
              ].map(({ name, desc, href }) => (
                <Link key={name} href={href}>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:border-[#5BC0BE]/40 hover:shadow-md transition-all group">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-[#5BC0BE] transition-colors mb-1">
                      {name}
                    </p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] py-20 text-white text-center">
        <RevealOnScroll>
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Come build with us
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Start for free with X.IDE and see what&apos;s possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/builder">
                <Button className="bg-white text-[#5BC0BE] hover:bg-gray-50 font-semibold rounded-full px-10 py-3 shadow-md border-0">
                  Launch Builder →
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="rounded-full px-10 py-3 border-white text-white hover:bg-white/10"
                >
                  Get in touch
                </Button>
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
