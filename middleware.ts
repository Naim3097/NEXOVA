import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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

  // Check if this is a subdomain request
  const isSubdomain = hostnameWithoutPort !== mainDomainWithoutPort &&
                      hostnameWithoutPort.endsWith(`.${mainDomainWithoutPort}`);

  if (isSubdomain) {
    // Extract subdomain
    const subdomain = hostnameWithoutPort.replace(`.${mainDomainWithoutPort}`, '');

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
  const isCustomDomain = !hostnameWithoutPort.includes(mainDomainWithoutPort) &&
                         !hostnameWithoutPort.includes('localhost') &&
                         !hostnameWithoutPort.includes('vercel.app');

  if (isCustomDomain) {
    // Rewrite to custom domain route
    // e.g., www.acmecorp.com → /d/www.acmecorp.com
    url.pathname = `/d/${hostname}${url.pathname}`;

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
