/**
 * Simple in-memory cache for API responses
 * TTL (Time To Live) is set per cache entry
 */

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Get cached data if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set data in cache with TTL in seconds
   */
  set<T>(key: string, data: T, ttlSeconds: number = 3600): void {
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { data, expiry });
  }

  /**
   * Delete a specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const cache = new MemoryCache();

// Run cleanup every 10 minutes
if (typeof window === 'undefined') {
  // Only run on server
  setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000);
}
