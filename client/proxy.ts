import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

async function getAuthenticatedState(
  req: NextRequest,
): Promise<boolean | null> {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  if (!apiURL) {
    return null;
  }

  try {
    const headers = new Headers();
    const cookie = req.headers.get("cookie");

    if (cookie) {
      headers.set("cookie", cookie);
    }

    const response = await fetch(
      new URL("/api/v1/authentication/get-session", apiURL),
      { headers, cache: "no-store" },
    );

    if (!response.ok) {
      return null;
    }

    const session: unknown = await response.json();

    if (!session || typeof session !== "object") {
      return false;
    }

    const data = session as {
      session?: { id?: string };
      user?: { id?: string };
    };

    return Boolean(data.session?.id && data.user?.id);
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!isProtected && !isAuthRoute) {
    return NextResponse.next();
  }

  const isAuthenticated = await getAuthenticatedState(req);

  if (isProtected && isAuthenticated === false) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthRoute && isAuthenticated === true) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
