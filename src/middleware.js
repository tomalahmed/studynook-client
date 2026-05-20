import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";

const authRoutes = ["/login", "/register"];
const privateRoutes = ["/add-room", "/my-listings", "/my-bookings"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const user = await verifyAuth(request);

  if (user && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !user &&
    privateRoutes.some((route) => pathname.startsWith(route))
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/add-room", "/my-listings", "/my-bookings"],
};
