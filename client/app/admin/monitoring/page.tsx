import type { Metadata } from "next";
import { Activity } from "lucide-react";

import { AdminPagePlaceholder } from "@/components/admin/admin-page-placeholder";

export const metadata: Metadata = { title: "System Monitoring" };

export default function Page() {
  return (
    <AdminPagePlaceholder
      icon={Activity}
      title="System Monitoring page is not built yet"
      description="Host and service health will appear here."
    />
  );
}
