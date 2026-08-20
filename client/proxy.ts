import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

export function proxy(req: NextRequest) {
      const pathname = req.nextUrl.pathname;

      const isProtected = protectedRoutes.some((route) =>
            pathname.startsWith(route),
      );

      const isAuthRoute = authRoutes.some((route) =>
            pathname.startsWith(route),
      );

      const sessionToken =
            req.cookies.get("__Secure-better-auth.session_token")?.value ??
            req.cookies.get("better-auth.session_token")?.value;

      const isAuthenticated = Boolean(sessionToken);

      // Not an auth-related route
      if (!isProtected && !isAuthRoute) {
            return NextResponse.next();
      }

      // User is not logged in → login
      if (isProtected && !isAuthenticated) {
            return NextResponse.redirect(new URL("/login", req.url));
      }

      // User is already logged in → dashboard
      if (isAuthRoute && isAuthenticated) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.next();
}

export const config = {
      matcher: ["/dashboard/:path*", "/login", "/register"],
};
