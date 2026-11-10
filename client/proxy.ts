import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/admin"];
const authRoutes = ["/login", "/register"];

type AuthenticatedState = {
  authenticated: boolean;
  role: string | null;
};

async function getAuthenticatedState(
  req: NextRequest,
): Promise<AuthenticatedState | null> {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  if (!apiURL) return null;

  try {
    const headers = new Headers();
    const cookie = req.headers.get("cookie");

    if (cookie) headers.set("cookie", cookie);

    const response = await fetch(
      new URL("/api/v1/authentication/get-session", apiURL),
      {
        headers,
        cache: "no-store",
      },
    );

    if (!response.ok) return null;

    const session: unknown = await response.json();

    if (!session || typeof session !== "object") {
      return { authenticated: false, role: null };
    }

    const data = session as {
      session?: { id?: string };
      user?: { id?: string; role?: string };
    };

    if (!data.session?.id || !data.user?.id) {
      return { authenticated: false, role: null };
    }

    return {
      authenticated: true,
      role: data.user.role ?? null,
    };
  } catch {
    return null;
  }
}

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isAdmin(role: string | null) {
  return role === "admin" || role === "superadmin";
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isProtected = matchesRoute(pathname, protectedRoutes);
  const isAdminRoute = matchesRoute(pathname, ["/admin"]);
  const isAuthRoute = matchesRoute(pathname, authRoutes);

  if (!isProtected && !isAuthRoute) {
    return NextResponse.next();
  }

  const auth = await getAuthenticatedState(req);

  // Fail closed for protected routes when authentication cannot be verified.
  if (auth === null) {
    if (isProtected) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  }

  if (isProtected && !auth.authenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminRoute && auth.authenticated && !isAdmin(auth.role)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAuthRoute && auth.authenticated) {
    return NextResponse.redirect(
      new URL(isAdmin(auth.role) ? "/admin" : "/dashboard", req.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
