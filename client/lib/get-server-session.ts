export type ServerSession =
  | {
      state: "authenticated";
      user: { id: string; email?: string; role?: string };
    }
  | { state: "unauthenticated" }
  | { state: "error"; reason: string };

export async function getServerSession(
  cookie: string | null,
): Promise<ServerSession> {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  if (!apiURL) {
    console.error("[session] NEXT_PUBLIC_API_URL is not set");
    return { state: "error", reason: "NEXT_PUBLIC_API_URL is not set" };
  }

  // No cookie means there cannot be a session.
  if (!cookie) return { state: "unauthenticated" };

  const url = new URL("/api/v1/authentication/get-session", apiURL);

  try {
    const res = await fetch(url, {
      headers: {
        cookie,
        accept: "application/json",
        "user-agent": "dockforge-web/1.0",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    const text = await res.text();

    if (!res.ok) {
      const reason = `get-session returned ${res.status}`;
      console.error("[session]", reason, {
        host: url.host,
        server: res.headers.get("server"),
        cfMitigated: res.headers.get("cf-mitigated"),
        cfRay: res.headers.get("cf-ray"),
        body: text.slice(0, 150),
      });
      return { state: "error", reason };
    }

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("[session] non-JSON response", {
        host: url.host,
        status: res.status,
        body: text.slice(0, 150),
      });
      return { state: "error", reason: "non-JSON response from get-session" };
    }

    // Better Auth returns 200 with null when there is no valid session.
    if (!data || typeof data !== "object") {
      return { state: "unauthenticated" };
    }

    const { session, user } = data as {
      session?: { id?: string };
      user?: { id?: string; email?: string; role?: string };
    };

    if (!session?.id || !user?.id) return { state: "unauthenticated" };

    return {
      state: "authenticated",
      user: { id: user.id, email: user.email, role: user.role },
    };
  } catch (error) {
    console.error("[session] request error:", error);
    return { state: "error", reason: "request failed" };
  }
}
