import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

async function getAuthenticatedState(
  req: NextRequest,
): Promise<boolean | null> {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  if (!apiURL) {
    console.error("[proxy] NEXT_PUBLIC_API_URL is not set");
    return null;
  }

  const cookie = req.headers.get("cookie");

  // No cookies at all means there cannot be a session.
  if (!cookie) return false;

  try {
    const response = await fetch(
      new URL("/api/v1/authentication/get-session", apiURL),
      {
        headers: { cookie },
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      },
    );

    // 401/403 = definitely not logged in.
    if (response.status === 401 || response.status === 403) return false;

    // Any other non-OK status = unknown state.
    if (!response.ok) {
      console.error("[proxy] get-session failed with status", response.status);
      return null;
    }

    const session: unknown = await response.json();

    if (!session || typeof session !== "object") return false;

    const data = session as {
      session?: { id?: string };
      user?: { id?: string };
    };

    return Boolean(data.session?.id && data.user?.id);
  } catch (error) {
    console.error("[proxy] get-session request error:", error);
    return null;
  }
}

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

  const isAuthenticated = await getAuthenticatedState(req);

  console.log("[proxy]", pathname, "authenticated:", isAuthenticated);

  // Unknown state: let the request through.
  if (isAuthenticated === null) {
    return NextResponse.next();
  }

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
