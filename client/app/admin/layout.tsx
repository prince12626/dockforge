import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { getServerSession } from "@/lib/get-server-session";

export const metadata: Metadata = {
  title: {
    default: "Admin Console · Dockforge",
    template: "%s · Dockforge Admin",
  },
  robots: { index: false, follow: false },
};

async function verifyAdmin() {
  const cookie = (await headers()).get("cookie");
  const result = await getServerSession(cookie);

  console.log(
    "[admin]",
    result.state,
    result.state === "authenticated" ? result.user.role : "",
  );

  // Fail closed, but loudly: an error page instead of a silent redirect loop.
  if (result.state === "error") {
    throw new Error(`Admin session check failed: ${result.reason}`);
  }

  if (result.state === "unauthenticated") redirect("/login");

  const role = result.user.role;
  if (role !== "admin" && role !== "superadmin") redirect("/dashboard");
}

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await verifyAdmin();

  return <AdminShell>{children}</AdminShell>;
}
