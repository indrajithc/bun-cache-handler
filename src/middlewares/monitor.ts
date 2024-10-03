import type { Request, Response, NextFunction } from "express"; // Type-only import
import { Counter, Histogram, register } from "prom-client";
import logger from "../logger";

// Define an interface that combines Request and the optional route property
interface ExtendedRequest extends Request {
  route: {
    path: string; // Define path as a string
  };
}

// Initialize Prometheus metrics
const requestCounter = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests made",
  labelNames: ["method", "route", "status"],
});

const responseTimeHistogram = new Histogram({
  name: "http_response_time_seconds",
  help: "HTTP response time in seconds",
  labelNames: ["method", "route", "status"],
});

// Function to get the duration in seconds
function getDurationInSeconds(start: [number, number]): number {
  const diff = process.hrtime(start);
  return diff[0] + diff[1] / 1e9;
}

export function monitorMiddleware(req: ExtendedRequest, res: Response, next: NextFunction) {
  const start = process.hrtime();

  res.on("finish", () => {
    const durationInSeconds = getDurationInSeconds(start);
    const { method } = req;
    const status = res.statusCode;

    // Safely determine the route
    const route = req.route?.path || req.path; // Now TypeScript knows `path` is a string

    // Log the request and response time
    logger.info(`${method} ${route} ${status} - ${durationInSeconds.toFixed(3)}s`);

    // Update Prometheus metrics
    requestCounter.labels(method, route, status.toString()).inc();
    responseTimeHistogram.labels(method, route, status.toString()).observe(durationInSeconds);
  });

  next();
}

// Metrics endpoint to expose Prometheus metrics
export function metricsRoute(req: ExtendedRequest, res: Response) {
  res.set("Content-Type", register.contentType);
  register
    .metrics()
    .then((metrics) => res.end(metrics))
    .catch((err) => {
      res.status(500).end(err);

      // Log the error
      logger.error(err);
    });
}
