import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { signAccessToken } from "@/lib/jwt-token";

/**
 * Edge-safe session bridge: middleware calls this with forwarded cookies
 * so Better Auth + MongoDB stay on the Node.js runtime.
 */
export async function GET(request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role ?? session.user.roleId ?? undefined;
  const token = await signAccessToken({
    userId: session.user.id,
    role,
  });

  return NextResponse.json({
    user: { id: String(session.user.id), role },
    token,
  });
}
