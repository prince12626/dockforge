import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

const BACKEND_URL = "https://dockforge-backend.princechaurasiya.in";

export async function proxy(req: NextRequest) {
      const pathname = req.nextUrl.pathname;

      const isProtected = protectedRoutes.some((route) =>
            pathname.startsWith(route),
      );

      const isAuthRoute = authRoutes.some((route) =>
            pathname.startsWith(route),
      );

      if (!isProtected && !isAuthRoute) {
            return NextResponse.next();
      }

      const sessionResponse = await fetch(
            `${BACKEND_URL}/api/v1/authentication/get-session`,
            {
                  headers: {
                        cookie: req.headers.get("cookie") ?? "",
                  },
                  cache: "no-store",
            },
      );

      const session = await sessionResponse.json();

      const isAuthenticated = !!session?.user;

      if (isProtected && !isAuthenticated) {
            return NextResponse.redirect(new URL("/login", req.url));
      }

      if (isAuthRoute && isAuthenticated) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.next();
}

export const config = {
      matcher: ["/dashboard/:path*", "/login", "/register"],
};
