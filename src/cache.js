/**
 * Cache utility for TokenRing
 * 
 * This module provides a simple in-memory caching mechanism with TTL support
 * to improve performance by reducing database queries for frequently accessed data.
 */

class Cache {
  constructor() {
    this.cache = new Map();
    this.ttls = new Map();
  }

  /**
   * Set a value in the cache with an optional TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   */
  set(key, value, ttl = null) {
    this.cache.set(key, value);
    
    // If TTL is provided, set expiration
    if (ttl) {
      const expiry = Date.now() + ttl;
      this.ttls.set(key, expiry);
      
      // Schedule cleanup
      setTimeout(() => {
        if (this.ttls.get(key) <= Date.now()) {
          this.delete(key);
        }
      }, ttl);
    }
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {any} - Cached value or undefined if not found
   */
  get(key) {
    // Check if key exists and not expired
    if (this.ttls.has(key) && this.ttls.get(key) <= Date.now()) {
      this.delete(key);
      return undefined;
    }
    
    return this.cache.get(key);
  }

  /**
   * Delete a value from the cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
    this.ttls.delete(key);
  }

  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
    this.ttls.clear();
  }

  /**
   * Get a value from the cache or compute it if not found
   * @param {string} key - Cache key
   * @param {Function} fn - Function to compute the value if not in cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   * @returns {Promise<any>} - Cached or computed value
   */
  async getOrSet(key, fn, ttl = null) {
    const cachedValue = this.get(key);
    if (cachedValue !== undefined) {
      return cachedValue;
    }
    
    const value = await fn();
    this.set(key, value, ttl);
    return value;
  }
}

// Create a singleton instance
const cache = new Cache();

export default cache;