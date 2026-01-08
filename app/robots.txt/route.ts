import { NextResponse } from 'next/server';

/**
 * GET /robots.txt
 * Generate dynamic robots.txt file
 */
export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

  const robotsTxt = `# Allow all crawlers
User-agent: *
Allow: /

# Disallow private pages
Disallow: /dashboard
Disallow: /projects/*/edit
Disallow: /api/

# Sitemap
Sitemap: ${appUrl}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
