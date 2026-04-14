'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { CATEGORY_COLORS } from '@/lib/blog-posts';
import type { BlogPost } from '@/lib/blog-posts';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function BlogFilteredGrid({ posts }: { posts: BlogPost[] }) {
  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const [active, setActive] = useState<string | null>(null);

  const filtered = active ? posts.filter((p) => p.category === active) : posts;

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          <button
            onClick={() => setActive(null)}
            className={`text-xs font-semibold rounded-full px-4 py-1.5 border transition-colors ${
              active === null
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`text-xs font-semibold rounded-full px-4 py-1.5 border transition-colors ${
                active === cat
                  ? 'bg-gray-900 text-white border-gray-900'
                  : `${CATEGORY_COLORS[cat] || 'bg-gray-100 text-gray-600'} border-transparent hover:opacity-80`
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <RevealOnScroll key={post.slug} delay={80}>
              <Link href={`/blog/${post.slug}`}>
                <article className="group bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="aspect-video relative bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-[#5BC0BE]/10 group-hover:to-[#7C74EA]/10 transition-all overflow-hidden">
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${
                          CATEGORY_COLORS[post.category] ||
                          'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-[#5BC0BE] transition-colors leading-snug flex-1">
                      {post.title}
                    </h2>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <time className="text-xs text-gray-400 mt-auto">
                      {formatDate(post.date)}
                    </time>
                  </div>
                </article>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            No posts in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
