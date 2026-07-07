import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];

export function middleware(req: NextRequest) {
      const isProtected = protectedRoutes.some((route) =>
            req.nextUrl.pathname.startsWith(route),
      );

      if (!isProtected) {
            return NextResponse.next();
      }

      const session =
            req.cookies.get("better-auth.session_token") ??
            req.cookies.get("__Secure-better-auth.session_token");

      if (!session) {
            return NextResponse.redirect(new URL("/login", req.url));
      }

      return NextResponse.next();
}

export const config = {
      matcher: ["/dashboard/:path*"],
};
