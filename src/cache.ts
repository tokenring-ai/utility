/**
 * Cache utility for TokenRing (TypeScript)
 *
 * This module provides a simple in-memory caching mechanism with TTL support
 * to improve performance by reducing database queries for frequently accessed data.
 */

class Cache<V = unknown> {
  private cache: Map<string, V>;
  private ttls: Map<string, number>;

  constructor() {
    this.cache = new Map<string, V>();
    this.ttls = new Map<string, number>();
  }

  /**
   * Set a value in the cache with an optional TTL
   */
  set(key: string, value: V, ttl: number | null = null): void {
    this.cache.set(key, value);

    // If TTL is provided, set expiration
    if (ttl) {
      const expiry = Date.now() + ttl;
      this.ttls.set(key, expiry);

      // Schedule cleanup
      setTimeout(() => {
        const exp = this.ttls.get(key);
        if (typeof exp === "number" && exp <= Date.now()) {
          this.delete(key);
        }
      }, ttl).unref();
    }
  }

  /**
   * Get a value from the cache
   */
  get(key: string): V | undefined {
    // Check if key exists and not expired
    const exp = this.ttls.get(key);
    if (typeof exp === "number" && exp <= Date.now()) {
      this.delete(key);
      return undefined;
    }

    return this.cache.get(key);
  }

  /**
   * Delete a value from the cache
   */
  delete(key: string): void {
    this.cache.delete(key);
    this.ttls.delete(key);
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
    this.ttls.clear();
  }

  /**
   * Get a value from the cache or compute it if not found
   */
  async getOrSet(
    key: string,
    fn: () => Promise<V> | V,
    ttl: number | null = null,
  ): Promise<V> {
    const cachedValue = this.get(key);
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    const value = await fn();
    this.set(key, value as V, ttl);
    return value as V;
  }
}

// Create a singleton instance
const cache = new Cache();

export default cache;
export {Cache};
