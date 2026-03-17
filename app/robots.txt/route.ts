import { NextResponse } from 'next/server';

/**
 * GET /robots.txt
 * Generate dynamic robots.txt file
 */
export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';

  const robotsTxt = `# Nexova — robots.txt
User-agent: *
Allow: /

# Private / authenticated pages — do not index
Disallow: /dashboard
Disallow: /dashboard/
Disallow: /builder
Disallow: /builder/
Disallow: /projects/
Disallow: /account/
Disallow: /auth/
Disallow: /api/
Disallow: /payment/
Disallow: /s/
Disallow: /d/
Disallow: /p/

# Sitemap
Sitemap: ${appUrl}/sitemap.xml
Sitemap: ${appUrl}/sitemap-marketing.xml
`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
