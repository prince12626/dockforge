import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getServerSession } from "@/lib/get-server-session";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function redirectTo(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isProtected = matchesRoute(pathname, protectedRoutes);
  const isAuthRoute = matchesRoute(pathname, authRoutes);

  if (!isProtected && !isAuthRoute) {
    return NextResponse.next();
  }

  const result = await getServerSession(req.headers.get("cookie"));

  console.log("[proxy]", pathname, result.state);

  // Unknown state (API error, Cloudflare block, timeout): don't force a redirect.
  if (result.state === "error") {
    return NextResponse.next();
  }

  const isAuthenticated = result.state === "authenticated";

  if (isProtected && !isAuthenticated) {
    return redirectTo(req, "/login");
  }

  if (isAuthRoute && isAuthenticated) {
    return redirectTo(req, "/dashboard");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
