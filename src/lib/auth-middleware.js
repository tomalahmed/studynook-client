import { NextResponse } from "next/server";
import {
  getTokenCookieOptions,
  TOKEN_COOKIE,
  verifyAccessToken,
} from "./jwt-token";

/** Copy a freshly minted JWT from one NextResponse onto another (e.g. redirects). */
export function applyMintedTokenCookie(target, source) {
  const value = source.cookies.get(TOKEN_COOKIE)?.value;
  if (!value) {
    return target;
  }
  target.cookies.set(TOKEN_COOKIE, value, getTokenCookieOptions());
  return target;
}

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

/**
 * Resolve user from JWT, or Better Auth session (and mint JWT when missing).
 * Returns { user, response } where response is a NextResponse with Set-Cookie when a token was minted.
 */
export async function resolveAuthUser(request) {
  const jwtUser = await verifyAuth(request);
  if (jwtUser) {
    return { user: jwtUser, response: null };
  }

  try {
    const mintUrl = new URL("/api/auth/mint-token", request.url);
    const mintRes = await fetch(mintUrl, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });

    if (mintRes.ok) {
      const { user, token } = await mintRes.json();
      const response = NextResponse.next();
      response.cookies.set(TOKEN_COOKIE, token, getTokenCookieOptions());
      return { user, response };
    }
  } catch {
    // Session lookup unavailable — treat as unauthenticated
  }

  return { user: null, response: null };
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
