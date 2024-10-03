import { CacheHandler } from "../cacheHandler";
import logger from "../logger";

// Cache handler instance
const cacheHandler = new CacheHandler();

// Define interface for request body
interface SetCacheRequest {
  key: string;
  value: unknown;
  tags?: string[];
}

interface RevalidateCacheRequest {
  tags: string[];
}

// Route handler for Bun
export async function cacheRoutesHandler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const { method } = req;

  // Handle GET request to get cache entry by key
  if (method === "GET" && url.pathname.startsWith("/cache/")) {
    const key = url.pathname.split("/cache/")[1];
    if (!key) return new Response(JSON.stringify({ error: "Key not provided" }), { status: 400 });

    const cacheEntry = cacheHandler.get(key);
    if (cacheEntry) {
      logger.info(`Cache hit for key: ${key}`);
      return new Response(JSON.stringify(cacheEntry), { status: 200 });
    }
    logger.warn(`Cache miss for key: ${key}`);
    return new Response(JSON.stringify({ error: "Key not found" }), { status: 404 });
  }

  // Handle POST request to set cache entry
  if (method === "POST" && url.pathname === "/cache") {
    const body = (await req.json()) as SetCacheRequest;

    const { key, value, tags } = body;
    if (!key || !value) {
      logger.error("Key and value are required");
      return new Response(JSON.stringify({ error: "Key and value are required" }), { status: 400 });
    }

    cacheHandler.set(key, value, tags);
    logger.info(`Cache set for key: ${key}${tags ? ` with tags: ${tags.join(", ")}` : ""}`);
    return new Response(JSON.stringify({ message: "Cache set successfully" }), { status: 200 });
  }

  // Handle POST request to revalidate cache by tags
  if (method === "POST" && url.pathname === "/cache/revalidate") {
    const body = (await req.json()) as RevalidateCacheRequest;

    const { tags } = body;
    if (!tags || !tags.length) {
      logger.error("Tags are required");
      return new Response(JSON.stringify({ error: "Tags are required" }), { status: 400 });
    }

    cacheHandler.revalidateTag(tags);
    logger.info(`Cache revalidated for tags: ${tags.join(", ")}`);
    return new Response(JSON.stringify({ message: "Cache revalidated by tags" }), { status: 200 });
  }

  // Fallback for unrecognized routes
  return new Response(JSON.stringify({ error: "Not Found" }), { status: 404 });
}
