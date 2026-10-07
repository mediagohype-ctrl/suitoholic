import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import adminRoutes from "./routes/admin.routes.js";
import publicRoutes from "./routes/public.routes.js";
import { invalidateOnWrite } from "./services/siteCache.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin(origin, cb) {
        // Allow same-origin/server-to-server requests (no Origin header) and configured origins.
        if (!origin || env.corsOrigins.includes("*") || env.corsOrigins.includes(origin)) return cb(null, true);
        cb(null, false);
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: 86400,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan(env.isProd ? "combined" : "dev"));

  app.get("/", (req, res) => res.json({ name: "Suitoholic API", status: "ok", docs: "/api/health" }));
  app.get("/api/health", async (req, res) => {
    const started = Date.now();
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "up", dbLatencyMs: Date.now() - started, uptimeSec: Math.round(process.uptime()) });
  });

  // Admin writes and orders (stock changes) refresh the cached storefront bundle.
  app.use(["/api/admin", "/api/orders"], invalidateOnWrite);
  app.use("/api/admin", adminRoutes);
  app.use("/api", publicRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
