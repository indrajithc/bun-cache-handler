import express from "express";

import configurations from "@/config";
import cacheRoutes from "./routes/cache";
import { monitorMiddleware, metricsRoute } from "./middlewares/monitor";

const app = express();
const PORT = configurations.port;

// Middleware
app.use(express.json());
app.use(monitorMiddleware); // Logging and performance monitoring middleware

// Cache routes
app.use("/cache", cacheRoutes);

// Metrics route for Prometheus
app.get("/metrics", metricsRoute);

// Start server
app.listen(PORT, () => {
  console.info(`Cache service running on http://localhost:${PORT}`);
});
