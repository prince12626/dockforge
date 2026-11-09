import type { Metadata } from "next";
import { VpsManagement } from "@/components/admin/vps-management";

export const metadata: Metadata = {
  title: "VPS Instances",
};

export default function Page() {
  return <VpsManagement />;
}
