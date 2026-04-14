import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { POSTS, CATEGORY_COLORS } from '@/lib/blog-posts';

/* ─────────────────────────────────────────────────────── */
/*  Static params                                          */
/* ─────────────────────────────────────────────────────── */

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

/* ─────────────────────────────────────────────────────── */
/*  Metadata                                               */
/* ─────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://nexova.co/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://nexova.co/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

/* ─────────────────────────────────────────────────────── */
/*  Page                                                   */
/* ─────────────────────────────────────────────────────── */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Turn inline `LeanX (https://leanx.io/)` references into clickable links. */
function renderBody(text: string): React.ReactNode {
  const regex =
    /(LeanX)((?:['''']s)?[^(]*?)\s*\(https?:\/\/leanx\.io\/?[^)]*\)/g;
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }
    result.push(
      <a
        key={key++}
        href="https://leanx.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#5BC0BE] font-semibold hover:underline transition-colors"
      >
        {match[1]}
      </a>
    );
    if (match[2]) result.push(match[2]);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex === 0) return text;
  if (lastIndex < text.length) result.push(text.slice(lastIndex));
  return <>{result}</>;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'Nexova',
      url: 'https://nexova.co',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nexova',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nexova.co/assets/logo.png',
      },
    },
    url: `https://nexova.co/blog/${post.slug}`,
    mainEntityOfPage: `https://nexova.co/blog/${post.slug}`,
  };

  const breadcrumbSchema = {
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
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://nexova.co/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb nav */}
      <nav
        className="bg-white border-b border-gray-100 py-3"
        aria-label="Breadcrumb"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li>
              <Link href="/" className="hover:text-[#5BC0BE] transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/blog"
                className="hover:text-[#5BC0BE] transition-colors"
              >
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-600 truncate max-w-[200px]">
              {post.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Article header */}
      <header className="bg-white pt-12 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <RevealOnScroll>
            <div className="flex items-center gap-3 mb-6">
              <span
                className={`text-xs font-semibold rounded-full px-3 py-1 ${
                  CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-600'
                }`}
              >
                {post.category}
              </span>
              <span className="text-sm text-gray-400">
                {post.readTime} read
              </span>
              <span className="text-sm text-gray-400">·</span>
              <time className="text-sm text-gray-400">
                {formatDate(post.date)}
              </time>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#455263] leading-tight mb-6">
              {post.title}
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>
          </RevealOnScroll>
        </div>
      </header>

      {/* Cover image */}
      <div className="relative h-72 bg-gradient-to-br from-[#5BC0BE]/10 to-[#7C74EA]/10 overflow-hidden">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        )}
      </div>

      {/* Article body */}
      <article className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <RevealOnScroll>
            <div className="prose prose-lg max-w-none">
              {post.sections.map((section, i) => (
                <div key={i} className="mb-10">
                  {section.heading && (
                    <h2 className="text-2xl font-bold text-[#455263] mb-4">
                      {section.heading}
                    </h2>
                  )}
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {renderBody(section.body)}
                  </p>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* Author card */}
          <RevealOnScroll delay={200}>
            <div className="mt-16 pt-8 border-t border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5BC0BE] to-[#7C74EA] flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#455263]">Nexova Team</p>
                <p className="text-sm text-gray-500">
                  Building X.IDE, Lean.x, and the tools Malaysian businesses
                  need to grow online.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* Back to blog */}
          <RevealOnScroll delay={300}>
            <div className="mt-10">
              <Link href="/blog">
                <Button
                  variant="outline"
                  className="rounded-full border-[#E2E8F0] text-[#455263] hover:text-[#5FC7CD] hover:border-[#5FC7CD] transition-all duration-300"
                >
                  ← Back to Blog
                </Button>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <RevealOnScroll>
              <h2 className="text-2xl font-bold text-[#455263] mb-10 text-center">
                More from the blog
              </h2>
            </RevealOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rp) => (
                <RevealOnScroll key={rp.slug} delay={200}>
                  <Link href={`/blog/${rp.slug}`}>
                    <article className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                      <div className="aspect-video relative bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-[#5BC0BE]/10 group-hover:to-[#7C74EA]/10 transition-all overflow-hidden">
                        {rp.image && (
                          <img
                            src={rp.image}
                            alt={rp.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <span
                          className={`self-start text-xs font-semibold rounded-full px-2.5 py-0.5 mb-3 ${
                            CATEGORY_COLORS[rp.category] ||
                            'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {rp.category}
                        </span>
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#5BC0BE] transition-colors leading-snug mb-2">
                          {rp.title}
                        </h3>
                        <time className="text-xs text-gray-400 mt-auto">
                          {formatDate(rp.date)}
                        </time>
                      </div>
                    </article>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] py-20 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <RevealOnScroll>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Build your landing page today
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              X.IDE gives you templates, elements, Lean.x payments — everything
              in one platform.
            </p>
            <Link href="/signup">
              <Button className="bg-white text-[#5BC0BE] hover:bg-gray-50 font-semibold rounded-full px-10 py-3 shadow-md border-0">
                Start Building Free →
              </Button>
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
