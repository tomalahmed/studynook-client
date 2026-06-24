import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getTokenCookieOptions,
  signAccessToken,
  TOKEN_COOKIE,
} from "@/lib/jwt-token";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role ?? session.user.roleId ?? undefined;
  const token = await signAccessToken({
    userId: session.user.id,
    role,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(TOKEN_COOKIE, token, getTokenCookieOptions());
  return response;
}
