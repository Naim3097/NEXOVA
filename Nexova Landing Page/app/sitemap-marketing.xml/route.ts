import { NextResponse } from 'next/server';
import { POSTS } from '@/lib/blog-posts';

/**
 * GET /sitemap-marketing.xml
 * Static sitemap for all public marketing pages.
 * The main /sitemap.xml is generated dynamically from Supabase (published projects).
 */
export async function GET() {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://nexova.co';
  const now = new Date().toISOString().split('T')[0];

  const routes: {
    url: string;
    changefreq: string;
    priority: string;
    lastmod?: string;
  }[] = [
    { url: '/', changefreq: 'weekly', priority: '1.0', lastmod: now },
    { url: '/marketplace', changefreq: 'daily', priority: '0.9', lastmod: now },
    { url: '/elements', changefreq: 'weekly', priority: '0.85', lastmod: now },
    {
      url: '/elements/layouts',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: now,
    },
    {
      url: '/elements/widgets',
      changefreq: 'monthly',
      priority: '0.75',
      lastmod: now,
    },
    { url: '/leanx', changefreq: 'monthly', priority: '0.85', lastmod: now },
    { url: '/pricing', changefreq: 'monthly', priority: '0.8', lastmod: now },
    { url: '/about', changefreq: 'monthly', priority: '0.6', lastmod: now },
    { url: '/blog', changefreq: 'daily', priority: '0.7', lastmod: now },
    // Blog posts — auto-generated from lib/blog-posts.ts
    ...POSTS.map((post) => ({
      url: `/blog/${post.slug}`,
      changefreq: 'yearly',
      priority: '0.65',
      lastmod: post.date,
    })),
    { url: '/changelog', changefreq: 'weekly', priority: '0.5', lastmod: now },
    { url: '/contact', changefreq: 'yearly', priority: '0.5', lastmod: now },
    { url: '/privacy', changefreq: 'yearly', priority: '0.3', lastmod: now },
    { url: '/terms', changefreq: 'yearly', priority: '0.3', lastmod: now },
    // Template detail pages
    {
      url: '/marketplace/saas-launch',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: now,
    },
    {
      url: '/marketplace/agency-pro',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: now,
    },
    {
      url: '/marketplace/store-minimal',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: now,
    },
    {
      url: '/marketplace/portfolio-grid',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: now,
    },
    {
      url: '/marketplace/restaurant-bistro',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: now,
    },
    {
      url: '/marketplace/event-summit',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: now,
    },
    {
      url: '/marketplace/education-academy',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: now,
    },
    {
      url: '/marketplace/health-clinic',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: now,
    },
    {
      url: '/marketplace/finance-advisor',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: now,
    },
    {
      url: '/marketplace/travel-explore',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: now,
    },
    {
      url: '/marketplace/fashion-brand',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: now,
    },
    {
      url: '/marketplace/startup-mvp',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: now,
    },
  ];

  const urlset = routes
    .map(
      (r) => `  <url>
    <loc>${base}${r.url}</loc>
    <lastmod>${r.lastmod ?? now}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control':
        'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
