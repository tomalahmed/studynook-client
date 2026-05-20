import { NextResponse } from "next/server";
import { getClearTokenCookieOptions, TOKEN_COOKIE } from "@/lib/jwt-token";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(TOKEN_COOKIE, "", getClearTokenCookieOptions());
  return response;
}
