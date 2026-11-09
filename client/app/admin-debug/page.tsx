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

    const responseText = await response.text();

    let session: any = null;

    try {
      session = JSON.parse(responseText);
    } catch {
      // API returned HTML or invalid JSON.
    }

    const debug = {
      apiURL,
      httpStatus: response.status,
      contentType: response.headers.get("content-type"),
      authenticated: Boolean(session?.user),
      userId: session?.user?.id ?? null,
      email: session?.user?.email ?? null,
      role: session?.user?.role ?? null,
      isAdmin:
        session?.user?.role === "admin" || session?.user?.role === "superadmin",
      response: responseText.slice(0, 3000),
    };

    return (
      <main className="min-h-screen bg-[#050506] p-8 text-white">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-2xl font-semibold">Dockforge Auth Diagnostics</h1>

          <pre className="overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-green-400">
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
