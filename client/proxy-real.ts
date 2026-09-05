import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

export function proxy(req: NextRequest) {
      console.log("\n========== DOCKFORGE PROXY ==========");

      console.log("[1] Request URL:", req.url);
      console.log("[2] Pathname:", req.nextUrl.pathname);
      console.log("[3] Method:", req.method);

      const pathname = req.nextUrl.pathname;

      const isProtected = protectedRoutes.some((route) =>
            pathname.startsWith(route),
      );

      console.log("[4] Is protected route:", isProtected);

      const isAuthRoute = authRoutes.some((route) =>
            pathname.startsWith(route),
      );

      console.log("[5] Is auth route:", isAuthRoute);

      const allCookies = req.cookies.getAll();

      console.log(
            "[6] All cookies:",
            allCookies.map((cookie) => cookie.name),
      );

      const normalCookie = req.cookies.get("better-auth.session_token")?.value;

      console.log(
            "[7] better-auth.session_token:",
            normalCookie ? "FOUND" : "NOT FOUND",
      );

      const secureCookie = req.cookies.get(
            "__Secure-better-auth.session_token",
      )?.value;

      console.log(
            "[8] __Secure-better-auth.session_token:",
            secureCookie ? "FOUND" : "NOT FOUND",
      );

      const sessionToken = secureCookie ?? normalCookie;

      console.log(
            "[9] Final session token:",
            sessionToken ? "FOUND" : "NOT FOUND",
      );

      const isAuthenticated = Boolean(sessionToken);

      console.log("[10] Is authenticated:", isAuthenticated);

      if (!isProtected && !isAuthRoute) {
            console.log("[11] Not auth route → ALLOW");
            console.log("========== END PROXY ==========\n");

            return NextResponse.next();
      }

      if (isProtected && !isAuthenticated) {
            console.log("[12] Protected + NO SESSION → REDIRECT /login");
            console.log("========== END PROXY ==========\n");

            return NextResponse.redirect(new URL("/login", req.url));
      }

      if (isAuthRoute && isAuthenticated) {
            console.log("[13] Auth route + SESSION → REDIRECT /dashboard");
            console.log("========== END PROXY ==========\n");

            return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      console.log("[14] Everything OK → ALLOW");
      console.log("========== END PROXY ==========\n");

      return NextResponse.next();
}

export const config = {
      matcher: ["/dashboard/:path*", "/login", "/register"],
};
