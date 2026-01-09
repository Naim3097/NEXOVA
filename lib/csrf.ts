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

  // Get the expected origin
  const allowedOrigins = getAllowedOrigins();

  // Check Origin header (preferred)
  const origin = request.headers.get('origin');
  if (origin) {
    return isOriginAllowed(origin, allowedOrigins);
  }

  // Fallback to Referer header if Origin is not present
  const referer = request.headers.get('referer');
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
      return isOriginAllowed(refererOrigin, allowedOrigins);
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
  }

  return origins;
}

/**
 * Check if an origin is in the allowed list
 */
function isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
  // Normalize origin (remove trailing slash)
  const normalizedOrigin = origin.replace(/\/$/, '');

  return allowedOrigins.some(allowed => {
    const normalizedAllowed = allowed.replace(/\/$/, '');
    return normalizedOrigin === normalizedAllowed;
  });
}

/**
 * CSRF error response
 */
export const CSRF_ERROR_RESPONSE = {
  error: 'CSRF validation failed',
  message: 'Request origin does not match expected origin',
} as const;
