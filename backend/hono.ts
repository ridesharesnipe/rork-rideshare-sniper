import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes with proper configuration
app.use("*", cors({
  origin: ["http://localhost:8081", "http://localhost:19006", "https://localhost:19006", "https://ridesharesniper.com"],
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

// Add request logging middleware
app.use("*", async (c, next) => {
  const start = Date.now();
  console.log(`🔄 ${c.req.method} ${c.req.url}`);
  
  await next();
  
  const ms = Date.now() - start;
  console.log(`✅ ${c.req.method} ${c.req.url} - ${c.res.status} (${ms}ms)`);
});

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
    onError: ({ error, path }) => {
      console.error(`❌ tRPC Error on ${path}:`, error);
    },
  })
);

// Simple health check endpoint
app.get("/", (c) => {
  return c.json({ 
    status: "ok", 
    message: "API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// API status endpoint
app.get("/status", (c) => {
  return c.json({
    status: "healthy",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not Found", path: c.req.url }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("❌ Server Error:", err);
  return c.json({ 
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  }, 500);
});

export default app;