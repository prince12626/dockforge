import type { Metadata } from "next";
import { ScrollText } from "lucide-react";

import { AdminPagePlaceholder } from "@/components/admin/admin-page-placeholder";

export const metadata: Metadata = { title: "Audit Logs" };

export default function Page() {
  return (
    <AdminPagePlaceholder
      icon={ScrollText}
      title="Audit Logs page is not built yet"
      description="A record of admin actions will appear here."
    />
  );
}
