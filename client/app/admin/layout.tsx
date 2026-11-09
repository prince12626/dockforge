import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: {
    default: "Admin Console · Dockforge",
    template: "%s · Dockforge Admin",
  },
  robots: { index: false, follow: false },
};

async function verifyAdmin() {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  if (!apiURL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
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

    if (!response.ok) {
      redirect("/login");
    }

    const session = await response.json();

    if (!session?.user) {
      redirect("/login");
    }

    const role = session.user.role;

    if (role !== "admin" && role !== "superadmin") {
      redirect("/dashboard");
    }
  } catch (error) {
    // Next.js redirect exceptions must not be swallowed.
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Admin authorization failed:", error);
    redirect("/login");
  }
}

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await verifyAdmin();

  return <AdminShell>{children}</AdminShell>;
}
