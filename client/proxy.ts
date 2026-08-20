import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

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

      try {
            const response = await fetch(
                  "https://dockforge-backend.princechaurasiya.in/api/v1/authentication/get-session",
                  {
                        headers: {
                              cookie: req.headers.get("cookie") ?? "",
                        },
                        cache: "no-store",
                  },
            );

            const session = await response.json();

            const isAuthenticated = !!session?.user;

            if (isProtected && !isAuthenticated) {
                  return NextResponse.redirect(new URL("/login", req.url));
            }

            if (isAuthRoute && isAuthenticated) {
                  return NextResponse.redirect(new URL("/dashboard", req.url));
            }

            return NextResponse.next();
      } catch (error) {
            console.error("Proxy auth error:", error);

            if (isProtected) {
                  return NextResponse.redirect(new URL("/login", req.url));
            }

            return NextResponse.next();
      }
}

export const config = {
      matcher: ["/dashboard/:path*", "/login", "/register"],
};
