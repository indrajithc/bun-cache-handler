import { Router } from "express";
import type { Request, Response } from "express"; // Type-only import
import { CacheHandler } from "../cacheHandler";
import logger from "../logger";

const router = Router();
const cacheHandler = new CacheHandler();

// Define interface for request body
interface SetCacheRequest {
  key: string;
  value: unknown; // or a more specific type, if known
  tags?: string[];
}

interface RevalidateCacheRequest {
  tags: string[];
}

// Route to get cache entry by key
router.get("/:key", (req: Request, res: Response) => {
  const { key } = req.params;
  const cacheEntry = cacheHandler.get(key);

  if (cacheEntry) {
    logger.info(`Cache hit for key: ${key}`);
    return res.json(cacheEntry);
  }
  logger.warn(`Cache miss for key: ${key}`);
  return res.status(404).json({ error: "Key not found" });
});

// Route to set cache entry
router.post("/", (req: Request<{}, {}, SetCacheRequest>, res: Response) => {
  const { key, value, tags } = req.body;

  if (!key || !value) {
    logger.error("Key and value are required");
    return res.status(400).json({ error: "Key and value are required" });
  }

  cacheHandler.set(key, value, tags);
  logger.info(`Cache set for key: ${key}${tags ? ` with tags: ${tags.join(", ")}` : ""}`); // Convert tags array to a string
  return res.json({ message: "Cache set successfully" });
});

// Route to revalidate cache by tags
router.post("/revalidate", (req: Request<{}, {}, RevalidateCacheRequest>, res: Response) => {
  const { tags } = req.body;

  if (!tags || !tags.length) {
    logger.error("Tags are required");
    return res.status(400).json({ error: "Tags are required" });
  }

  cacheHandler.revalidateTag(tags);
  logger.info(`Cache revalidated for tags: ${tags.join(", ")}`); // Convert tags array to a string
  return res.json({ message: "Cache revalidated by tags" });
});

export default router;
