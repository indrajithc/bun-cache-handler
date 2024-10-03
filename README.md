# Bun Cache Handler

## Description

A high-performance caching handler using Bun and LRU cache for high-speed and high-load environments. This application provides an API for setting, getting, and revalidating cache entries with built-in logging and performance monitoring.

## Features

- High-speed LRU caching
- API endpoints for cache operations
- Performance monitoring using Prometheus
- Logging of requests and responses
- Supports TypeScript out of the box

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine. You can install it using the following command:

```
curl -fsSL https://bun.sh/install | bash
```

### Installation

1. Clone the repository:

```
git clone <repository-url>
cd bun-cache-handler
```

2. Install the dependencies:

```
bun install
```

### Running the Application

To start the application in development mode, use:

```
bun run dev
```

To start the application in production mode, use:

```
bun run start
```

### API Endpoints

- **Get Cache Entry**: `GET /cache/:key`
  - Retrieves a cache entry by key.

- **Set Cache Entry**: `POST /cache`
  - Sets a cache entry.
  - **Request Body**:
```
{
  "key": "string",
  "value": "any",
  "tags": ["string"]
}
```

- **Revalidate Cache by Tags**: `POST /cache/revalidate`
  - Revalidates cache entries by tags.
  - **Request Body**:
```
{
  "tags": ["string"]
}
```

- **Metrics**: `GET /metrics`
  - Exposes Prometheus metrics.

## Logging

Logs will be printed to the console and stored in a file named `combined.log`. Each log entry includes the timestamp, HTTP method, route, status code, and response time.

## Monitoring

You can access performance metrics at the `/metrics` endpoint for Prometheus monitoring.

## License

This project is licensed under the ISC License.
