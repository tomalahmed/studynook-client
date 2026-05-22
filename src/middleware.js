import { NextResponse } from "next/server";
import {
  applyMintedTokenCookie,
  resolveAuthUser,
} from "@/lib/auth-middleware";
import { isProtectedPath, loginUrl, ROUTES, safeCallbackUrl } from "@/lib/routes";

const authRoutes = [ROUTES.login, ROUTES.register];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const { user, response: tokenResponse } = await resolveAuthUser(request);

  const withAuthCookie = (res) =>
    tokenResponse ? applyMintedTokenCookie(res, tokenResponse) : res;

  if (user && authRoutes.some((route) => pathname.startsWith(route))) {
    const callbackUrl = safeCallbackUrl(
      request.nextUrl.searchParams.get("callbackUrl"),
    );
    const destination =
      callbackUrl !== ROUTES.home ? callbackUrl : ROUTES.home;
    return withAuthCookie(NextResponse.redirect(new URL(destination, request.url)));
  }

  if (!user && isProtectedPath(pathname)) {
    return NextResponse.redirect(
      new URL(loginUrl(pathname), request.url),
    );
  }

  if (tokenResponse) {
    return withAuthCookie(tokenResponse);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/add-room",
    "/my-listings",
    "/my-bookings",
    "/my-favorites",
    "/rooms/:path+",
  ],
};
