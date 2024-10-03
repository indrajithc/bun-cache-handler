// Define the cache entry structure
interface CacheEntry<T> {
  value: T;
  tags?: string[];
  expiration?: number; // Add TTL support manually
}

// Global Map to store the cache
const globalCache = new Map<string, CacheEntry<unknown>>();

// Cache handler class for setting, getting, and revalidating
export class CacheHandler<T> {
  private ttl: number; // Time-to-live in milliseconds

  constructor(ttl: number = 1000 * 60 * 60) {
    // Default TTL is 1 hour
    this.ttl = ttl;
  }

  // Get cache entry by key
  get(key: string): CacheEntry<T> | undefined {
    const entry = globalCache.get(key) as CacheEntry<T> | undefined;

    if (entry && this.isExpired(entry)) {
      globalCache.delete(key);
      return undefined;
    }

    return entry;
  }

  // Set cache entry with a key, value, and optional tags
  set(key: string, value: T, tags?: string[]): void {
    const expiration = Date.now() + this.ttl;
    globalCache.set(key, { value, tags, expiration });
  }

  // Revalidate cache by tags
  revalidateTag(tags: string[]): void {
    globalCache.forEach((value, key) => {
      if (value.tags && value.tags.some((tag) => tags.includes(tag))) {
        globalCache.delete(key);
      }
    });
  }

  // Check if a cache entry is expired
  private isExpired(entry: CacheEntry<T>): boolean {
    return entry.expiration !== undefined && Date.now() > entry.expiration;
  }
}
