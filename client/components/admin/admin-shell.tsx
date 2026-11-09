"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";
import { cn } from "./cn";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Escape to close + lock background scroll while the drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-[#050506] text-zinc-200 antialiased [color-scheme:dark] selection:bg-[#D9A53A]/30">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-[#D9A53A] focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.07] lg:block">
        <AdminSidebar />
      </aside>

      {/* Mobile / tablet drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          !mobileOpen && "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={closeMobile}
          className={cn(
            "absolute inset-0 bg-black/70 transition-opacity duration-200",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          id="admin-mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation"
          className={cn(
            "absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-white/[0.07] transition-transform duration-200 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close navigation"
            tabIndex={mobileOpen ? 0 : -1}
            className="absolute right-3 top-3.5 z-10 inline-flex size-8 items-center justify-center rounded-md text-zinc-400 outline-none transition-colors hover:bg-white/[0.05] hover:text-zinc-100 focus-visible:ring-1 focus-visible:ring-[#D9A53A]/70"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
          <AdminSidebar onNavigate={closeMobile} />
        </div>
      </div>

      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <AdminHeader
          onOpenMobileNav={() => setMobileOpen(true)}
          mobileNavOpen={mobileOpen}
        />
        <main
          id="admin-main"
          className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
