import { NextRequest } from 'next/server';

/**
 * Validates CSRF protection by checking Origin and Referer headers
 * This prevents Cross-Site Request Forgery attacks
 *
 * @param request - The incoming request
 * @returns true if the request is safe, false if it's potentially a CSRF attack
 */
export function validateCsrf(request: NextRequest): boolean {
  // Only check POST, PUT, PATCH, DELETE requests
  const method = request.method.toUpperCase();
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return true; // GET requests don't need CSRF protection
  }

  // Get the request host
  const requestHost = request.headers.get('host');

  // Check Origin header (preferred)
  const origin = request.headers.get('origin');
  if (origin) {
    const isValid = isOriginAllowed(origin, requestHost);
    if (!isValid) {
      console.error('CSRF validation failed for origin:', origin, 'host:', requestHost);
    }
    return isValid;
  }

  // Fallback to Referer header if Origin is not present
  const referer = request.headers.get('referer');
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
      const isValid = isOriginAllowed(refererOrigin, requestHost);
      if (!isValid) {
        console.error('CSRF validation failed for referer:', refererOrigin, 'host:', requestHost);
      }
      return isValid;
    } catch (error) {
      console.error('Invalid referer URL:', referer);
      return false;
    }
  }

  // If neither Origin nor Referer is present, reject the request
  // This is a security measure to prevent CSRF attacks
  console.warn('CSRF validation failed: No Origin or Referer header');
  return false;
}

/**
 * Check if an origin is allowed
 * @param origin - The origin from the request header
 * @param requestHost - The host header from the request
 */
function isOriginAllowed(origin: string, requestHost: string | null): boolean {
  if (!requestHost) {
    return false;
  }

  try {
    const originUrl = new URL(origin);
    const originHost = originUrl.host;

    // Same-origin check: if the origin host matches the request host, allow it
    if (originHost === requestHost) {
      return true;
    }

    // For Vercel preview deployments, allow all vercel.app domains
    // This is safe because they're all from the same deployment
    if (originHost.endsWith('.vercel.app') && requestHost.endsWith('.vercel.app')) {
      return true;
    }

    // Check against configured allowed origins
    const allowedOrigins = getAllowedOrigins();
    const normalizedOrigin = origin.replace(/\/$/, '');

    return allowedOrigins.some(allowed => {
      const normalizedAllowed = allowed.replace(/\/$/, '');
      return normalizedOrigin === normalizedAllowed;
    });
  } catch (error) {
    console.error('Error parsing origin URL:', origin, error);
    return false;
  }
}

/**
 * Get list of allowed origins for CSRF validation
 */
function getAllowedOrigins(): string[] {
  const origins: string[] = [];

  // Add production URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    origins.push(process.env.NEXT_PUBLIC_APP_URL);
  }

  // Add Vercel deployment URLs
  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }

  // Add localhost for development
  if (process.env.NODE_ENV === 'development') {
    origins.push('http://localhost:3000');
    origins.push('http://127.0.0.1:3000');
    origins.push('http://localhost:3002');
  }

  return origins;
}

/**
 * CSRF error response
 */
export const CSRF_ERROR_RESPONSE = {
  error: 'CSRF validation failed',
  message: 'Request origin does not match expected origin',
} as const;
