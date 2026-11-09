import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";

import { AdminPagePlaceholder } from "@/components/admin/admin-page-placeholder";

export const metadata: Metadata = { title: "Overview" };

export default function Page() {
  return (
    <AdminPagePlaceholder
      icon={LayoutDashboard}
      title="Overview is not built yet"
      description="Platform-wide summary will appear here."
    />
  );
}
