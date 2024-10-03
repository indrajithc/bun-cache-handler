import LRU from "lru-cache";

// Define the cache entry structure
interface CacheEntry<T> {
  value: T;
  tags?: string[];
}

// Initialize the LRU cache with typed entries
const cache = new LRU<string, CacheEntry<unknown>>({
  max: 500, // Maximum number of cache items
  ttl: 1000 * 60 * 60, // Time-to-live: 1 hour
});

// Cache handler class for setting, getting, and revalidating
export class CacheHandler<T> {
  // Get cache entry by key
  get(key: string): CacheEntry<T> | undefined {
    return cache.get(key) as CacheEntry<T> | undefined;
  }

  // Set cache entry with a key, value, and optional tags
  set(key: string, value: T, tags?: string[]): void {
    cache.set(key, { value, tags });
  }

  // Revalidate cache by tags
  revalidateTag(tags: string[]): void {
    cache.forEach((value, key) => {
      if (value.tags && value.tags.some((tag) => tags.includes(tag))) {
        cache.delete(key);
      }
    });
  }
}
