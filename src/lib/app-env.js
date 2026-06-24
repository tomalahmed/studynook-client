/**
 * Resolve app URLs for local dev vs production (Vercel + Render).
 * MongoDB: always use MONGODB_URI + MONGODB_DB_NAME (same Atlas DB in prod).
 */

function stripSlash(url) {
  if (!url || typeof url !== "string") return "";
  return url.trim().replace(/\/+$/, "");
}

const isProduction = process.env.NODE_ENV === "production";

/** Express API — rewrites + SSR (Render in production). */
export function getApiUrl() {
  const url = isProduction
    ? process.env.API_URL_PROD || process.env.API_URL
    : process.env.API_URL;
  return stripSlash(url) || "http://localhost:5000";
}

/** Better Auth server base URL (Vercel app origin in production). */
export function getBetterAuthUrl() {
  const url = isProduction
    ? process.env.BETTER_AUTH_URL_PROD || process.env.BETTER_AUTH_URL
    : process.env.BETTER_AUTH_URL;
  return stripSlash(url) || "http://localhost:3000";
}

/** Better Auth in the browser (must be NEXT_PUBLIC_* on Vercel). */
export function getPublicBetterAuthUrl() {
  const url = isProduction
    ? process.env.NEXT_PUBLIC_BETTER_AUTH_URL_PROD ||
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
      process.env.BETTER_AUTH_URL_PROD ||
      process.env.BETTER_AUTH_URL
    : process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL;
  return stripSlash(url) || "http://localhost:3000";
}

/** Shared MongoDB database name (client Better Auth + Express via API). */
export function getMongoDbName() {
  return process.env.MONGODB_DB_NAME?.trim() || "StudyNook";
}
