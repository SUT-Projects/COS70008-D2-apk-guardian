// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Public routes & assets
  if (
    pathname.startsWith("/api/") ||           // NextAuth & other API routes
    pathname.startsWith("/_next/static") ||   // Next.js static chunks
    pathname.startsWith("/_next/image") ||    // Next.js image optimizer
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/login" ||                  // your login page
    pathname === "/auth-options" ||           // your auth-options endpoint
    pathname.match(/\.[^\/]+$/)               // anything with a “.ext” at the end
  ) {
    return NextResponse.next();
  }

  // 2) Try to pull a session token from the cookie
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 3) If no token, redirect to /login (and preserve callbackUrl)
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    // loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4) Token exists → allow access
  return NextResponse.next();
}

export const config = {
  // Run this middleware on *all* pages except the ones above
  matcher: [
    "/:path*"
  ],
};
