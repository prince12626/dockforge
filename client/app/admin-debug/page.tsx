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

    return (
      <main className="min-h-screen bg-[#050506] p-8 text-white">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-2xl font-semibold">Dockforge Auth Diagnostics</h1>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <p className="mb-4 text-sm text-white/50">Authentication status</p>
            <p className="text-xl">
              {debug.isAdmin
                ? "Admin access detected"
                : "Admin access NOT detected"}
            </p>
          </div>

          <pre className="overflow-auto rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-green-400">
            {JSON.stringify(debug, null, 2)}
          </pre>
        </div>
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
