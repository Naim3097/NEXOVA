import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Single-level subdomain suffix for Vercel
// e.g., subdomain-ide-page-builder.vercel.app
const VERCEL_APP_SUFFIX = '-ide-page-builder.vercel.app';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  let response = NextResponse.next();

  // Create Supabase client to refresh session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if needed
  await supabase.auth.getUser();

  // Get the main domain from environment or default to localhost
  const mainDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3002';

  // Remove port for comparison
  const mainDomainWithoutPort = mainDomain.split(':')[0];
  const hostnameWithoutPort = hostname.split(':')[0];

  // Check if this is a single-level subdomain request (new format)
  // e.g., kurtagorilla-ide-page-builder.vercel.app
  if (hostnameWithoutPort.endsWith(VERCEL_APP_SUFFIX)) {
    // Extract subdomain from single-level format
    const subdomain = hostnameWithoutPort.slice(0, -VERCEL_APP_SUFFIX.length);

    if (subdomain && subdomain !== 'ide-page-builder') {
      // Rewrite to subdomain route
      // e.g., kurtagorilla-ide-page-builder.vercel.app → /s/kurtagorilla
      url.pathname = `/s/${subdomain}${url.pathname}`;

      response = NextResponse.rewrite(url);

      // Re-apply cookies to the rewritten response
      request.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value);
      });

      return response;
    }
  }

  // Legacy: Check if this is a nested subdomain request (old format)
  // e.g., subdomain.ide-page-builder.vercel.app
  const isLegacySubdomain =
    hostnameWithoutPort !== mainDomainWithoutPort &&
    hostnameWithoutPort.endsWith(`.${mainDomainWithoutPort}`);

  if (isLegacySubdomain) {
    // Extract subdomain
    const subdomain = hostnameWithoutPort.replace(
      `.${mainDomainWithoutPort}`,
      ''
    );

    // Rewrite to subdomain route
    // e.g., johndoe.xide.app → /s/johndoe
    url.pathname = `/s/${subdomain}${url.pathname}`;

    response = NextResponse.rewrite(url);

    // Re-apply cookies to the rewritten response
    request.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value);
    });

    return response;
  }

  // Check if this might be a custom domain (not our main domain)
  const isCustomDomain =
    !hostnameWithoutPort.includes(mainDomainWithoutPort) &&
    !hostnameWithoutPort.includes('localhost') &&
    !hostnameWithoutPort.includes('vercel.app');

  if (isCustomDomain) {
    // Normalize hostname: remove port and get the base hostname
    // e.g., www.acmecorp.com → /d/www.acmecorp.com
    // Also handles non-www: acmecorp.com → /d/acmecorp.com
    // The page handler will check both www and non-www versions
    const normalizedHostname = hostnameWithoutPort.toLowerCase();
    url.pathname = `/d/${normalizedHostname}${url.pathname}`;

    response = NextResponse.rewrite(url);

    // Re-apply cookies to the rewritten response
    request.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value);
    });

    return response;
  }

  return response;
}

// Configure middleware to run on all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
