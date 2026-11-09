import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AdminDebugPage() {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  if (!apiURL) {
    return <pre>NEXT_PUBLIC_API_URL is not configured</pre>;
  }

  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie") ?? "";

  try {
    const response = await fetch(
      `${apiURL}/api/v1/authentication/get-session`,
      {
        headers: { cookie },
        cache: "no-store",
      },
    );

    const session = await response.json();

    const debug = {
      httpStatus: response.status,
      authenticated: Boolean(session?.user),
      userId: session?.user?.id ?? null,
      email: session?.user?.email ?? null,
      role: session?.user?.role ?? null,
      expectedRole: ["admin", "superadmin"],
      isAdmin:
        session?.user?.role === "admin" || session?.user?.role === "superadmin",
      sessionResponse: session,
    };

    const responseText = await response.text();

    return (
      <main className="min-h-screen bg-[#050506] p-8 text-white">
        <h1 className="mb-6 text-2xl">API Response Diagnostic</h1>

        <pre className="overflow-auto whitespace-pre-wrap rounded-xl bg-white/5 p-6 text-sm text-green-400">
          {JSON.stringify(
            {
              apiURL,
              status: response.status,
              contentType: response.headers.get("content-type"),
              response: responseText.slice(0, 3000),
            },
            null,
            2,
          )}
        </pre>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-[#050506] p-8 text-white">
        <h1 className="text-2xl">Auth Diagnostic Failed</h1>
        <pre className="mt-6 whitespace-pre-wrap text-red-400">
          {String(error)}
        </pre>
      </main>
    );
  }
}
