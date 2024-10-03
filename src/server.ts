import configurations from "@/config";
import { cacheRoutesHandler } from "./routes/cache";
// import { monitorMiddleware, metricsRouteHandler } from "./middlewares/monitor";

const PORT = configurations.port;

// Create a unified request handler
async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Use the monitorMiddleware for logging and performance monitoring
  // Apply the monitor middleware
  // const monitorResponse = await monitorMiddleware(req);
  // if (monitorResponse) return monitorResponse;
  // Routes
  if (url.pathname.startsWith("/cache")) {
    return cacheRoutesHandler(req);
  }
  // if (url.pathname === "/metrics") {
  //   return metricsRouteHandler(req);
  // }
  return new Response("Not Found", { status: 404 });
}

// Start the Bun server
Bun.serve({
  port: PORT,
  fetch: handler,
  error: (e) => {
    console.error(`Error: ${e?.message}`);
    return new Response("Internal Server Error", { status: 500 });
  },
});

console.info(`Cache service running on http://localhost:${PORT}`);
