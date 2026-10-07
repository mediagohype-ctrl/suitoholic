import "dotenv/config";

const toBool = (v, fallback) => (v === undefined || v === "" ? fallback : ["1", "true", "yes"].includes(String(v).toLowerCase()));
const toList = (v) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);

const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";
const port = Number(process.env.PORT || 4000);

export const env = {
  nodeEnv,
  isProd,
  port,
  // Public base URL of this API, used to build absolute media URLs.
  publicUrl: (process.env.PUBLIC_URL || `http://localhost:${port}`).replace(/\/$/, ""),
  databaseUrl: process.env.DATABASE_URL || "",
  dbSsl: toBool(process.env.DB_SSL, undefined),
  dbPoolMax: Number(process.env.DB_POOL_MAX || 10),
  autoMigrate: toBool(process.env.AUTO_MIGRATE, true),
  autoSeed: toBool(process.env.AUTO_SEED, true),
  jwtSecret: process.env.JWT_SECRET || (isProd ? "" : "dev-only-insecure-secret-change-me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigins: toList(process.env.CORS_ORIGINS || "http://localhost:3000"),
  adminEmail: (process.env.ADMIN_EMAIL || "admin@suitoholic.com").toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD || (isProd ? "" : "Admin@12345"),
  adminName: process.env.ADMIN_NAME || "Suitoholic Admin",
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 8),
};

if (!env.databaseUrl) {
  throw new Error("DATABASE_URL is not set. Copy server/.env.example to server/.env and add your Neon connection string.");
}
if (isProd && !env.jwtSecret) {
  throw new Error("JWT_SECRET must be set in production.");
}
