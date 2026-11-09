import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";

import { AdminPagePlaceholder } from "@/components/admin/admin-page-placeholder";

export const metadata: Metadata = { title: "Abuse & Security" };

export default function Page() {
  return (
    <AdminPagePlaceholder
      icon={ShieldAlert}
      title="Abuse & Security page is not built yet"
      description="Abuse reports and security events will appear here."
    />
  );
}
