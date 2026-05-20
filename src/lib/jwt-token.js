import { SignJWT, jwtVerify } from "jose";

export const TOKEN_COOKIE = "token";

const DEFAULT_EXPIRY = "7d";

function getSecretKey() {
  const secret = process.env.JWT_SECRET?.trim() || process.env.BETTER_AUTH_SECRET?.trim();
  if (!secret) {
    throw new Error("Missing JWT_SECRET or BETTER_AUTH_SECRET environment variable");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Sign a JWT with { userId } and optional role (HS256).
 */
export async function signAccessToken({ userId, role }) {
  const payload = { userId: String(userId) };
  if (role != null && role !== "") {
    payload.role = role;
  }

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN?.trim() || DEFAULT_EXPIRY)
    .sign(getSecretKey());
}

/**
 * Verify JWT and return req.user shape: { id, role? }.
 */
export async function verifyAccessToken(token) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });

    const userId = payload.userId;
    if (userId == null || userId === "") {
      return null;
    }

    return {
      id: String(userId),
      role: payload.role != null ? String(payload.role) : undefined,
    };
  } catch {
    return null;
  }
}

export function getTokenCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function getClearTokenCookieOptions() {
  return {
    ...getTokenCookieOptions(),
    maxAge: 0,
  };
}
