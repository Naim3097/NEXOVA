/**
 * Rate Limiting Utility
 * Implements token bucket algorithm for rate limiting API requests
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

// In-memory store for rate limiting
// In production, consider using Redis for distributed rate limiting
const store = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  maxRequests: number; // Maximum requests allowed
  windowMs: number; // Time window in milliseconds
}

/**
 * Rate limit a request by identifier (usually IP address)
 * Returns true if request should be allowed, false if rate limited
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const { maxRequests, windowMs } = options;

  // Get or create rate limit entry
  let entry = store.get(identifier);

  if (!entry) {
    // First request from this identifier
    entry = {
      tokens: maxRequests - 1,
      lastRefill: now,
    };
    store.set(identifier, entry);
    return {
      success: true,
      remaining: entry.tokens,
      resetAt: now + windowMs,
    };
  }

  // Calculate tokens to refill based on time elapsed
  const timeElapsed = now - entry.lastRefill;
  const tokensToAdd = Math.floor((timeElapsed / windowMs) * maxRequests);

  if (tokensToAdd > 0) {
    // Refill tokens
    entry.tokens = Math.min(maxRequests, entry.tokens + tokensToAdd);
    entry.lastRefill = now;
  }

  // Check if request can be allowed
  if (entry.tokens > 0) {
    entry.tokens -= 1;
    store.set(identifier, entry);
    return {
      success: true,
      remaining: entry.tokens,
      resetAt: entry.lastRefill + windowMs,
    };
  }

  // Rate limit exceeded
  return {
    success: false,
    remaining: 0,
    resetAt: entry.lastRefill + windowMs,
  };
}

/**
 * Get client identifier from request (IP address)
 */
export function getClientIdentifier(request: Request): string {
  const headers = request.headers;

  // Try to get IP from various headers (for proxies/load balancers)
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback
  return 'unknown';
}

/**
 * Cleanup old entries from store (call periodically)
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  const maxAge = 60 * 60 * 1000; // 1 hour

  for (const [key, entry] of store.entries()) {
    if (now - entry.lastRefill > maxAge) {
      store.delete(key);
    }
  }
}

// Run cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 10 * 60 * 1000);
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // Strict: For sensitive operations like payments
  STRICT: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 5 requests per minute
  },
  // Moderate: For form submissions
  MODERATE: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 10 requests per minute
  },
  // Lenient: For webhooks from trusted sources
  LENIENT: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 100 requests per minute
  },
};
