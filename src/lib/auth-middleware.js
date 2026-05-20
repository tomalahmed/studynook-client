import { NextResponse } from "next/server";
import { TOKEN_COOKIE, verifyAccessToken } from "./jwt-token";

/**
 * Read JWT from the HTTP-only `token` cookie.
 */
export function getTokenFromRequest(request) {
  return request.cookies.get(TOKEN_COOKIE)?.value ?? null;
}

/**
 * Verify JWT and return { id, role? } or null if invalid/expired.
 */
export async function verifyAuth(request) {
  const token = getTokenFromRequest(request);
  return verifyAccessToken(token);
}

/** @deprecated Use verifyAuth — same shape as Express req.user */
export async function getAuthUser(request) {
  return verifyAuth(request);
}

export function unauthorizedJsonResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * For API route handlers: returns user or a 401 Response.
 */
export async function requireAuth(request) {
  const user = await verifyAuth(request);
  if (!user) {
    return { user: null, response: unauthorizedJsonResponse() };
  }
  return { user, response: null };
}
