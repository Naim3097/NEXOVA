import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { POSTS, CATEGORY_COLORS } from '@/lib/blog-posts';
import { BlogFilteredGrid } from '@/components/landing/BlogFilteredGrid';

// Re-generate this page at most once per hour on Vercel (ISR)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog — Nexova',
  description:
    'Design, development, and business growth insights from the Nexova team. Tutorials, case studies, and web creation tips.',
  alternates: { canonical: 'https://nexova.co/blog' },
  openGraph: {
    title: 'Blog — Nexova',
    description: 'Design and web creation insights from the Nexova team.',
    url: 'https://nexova.co/blog',
    type: 'website',
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogPage() {
  const [featured, ...rest] = POSTS;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Nexova Blog',
            url: 'https://nexova.co/blog',
            description:
              'Design, development, and growth insights from Nexova.',
          }),
        }}
      />
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
                name: 'Blog',
                item: 'https://nexova.co/blog',
              },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-white pt-20 pb-10 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <RevealOnScroll>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5FC7CD] mb-4">
              Nexova Blog
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Insights from the{' '}
              <span className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] bg-clip-text text-transparent">
                team
              </span>
            </h1>
            <p className="text-gray-500 text-lg">
              Design, development, payments, and growth — straight from the
              source.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Featured post */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <RevealOnScroll>
            <Link href={`/blog/${featured.slug}`}>
              <article className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col lg:flex-row">
                <div className="lg:w-1/2 aspect-video lg:aspect-auto relative bg-gradient-to-br from-[#5BC0BE]/10 to-[#7C74EA]/10 overflow-hidden">
                  {featured.image && (
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="eager"
                    />
                  )}
                </div>
                <div className="p-8 lg:w-1/2 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`text-xs font-semibold rounded-full px-3 py-1 ${
                        CATEGORY_COLORS[featured.category] ||
                        'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {featured.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {featured.readTime} read
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#5BC0BE] transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {featured.excerpt}
                  </p>
                  <time className="text-xs text-gray-400">
                    {formatDate(featured.date)}
                  </time>
                </div>
              </article>
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      <BlogFilteredGrid posts={rest} />

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] py-20 text-white text-center">
        <RevealOnScroll>
          <div className="container mx-auto px-4 max-w-xl">
            <h2 className="text-3xl font-bold mb-3">Stay in the loop</h2>
            <p className="text-white/80 mb-8">
              Monthly digest — new templates, elements, and product updates.
            </p>
            <form
              action="https://formsubmit.co/hello@nexova.co"
              method="POST"
              className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto"
            >
              <input
                type="hidden"
                name="_subject"
                value="Newsletter subscription"
              />
              <input type="hidden" name="_captcha" value="false" />
              <input
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                className="flex-1 rounded-full px-5 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-white bg-white/90"
              />
              <Button
                type="submit"
                className="bg-white text-[#5BC0BE] hover:bg-gray-50 font-semibold rounded-full px-6 py-3 border-0 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
