import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-white">
      <aside className="w-80 border-r border-border shrink-0">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
