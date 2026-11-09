"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Menu, Search } from "lucide-react";

import { AdminUserMenu } from "./admin-user-menu";
import { getAdminPageMeta } from "./admin-nav";
import { cn } from "./cn";

interface AdminHeaderProps {
  onOpenMobileNav: () => void;
  mobileNavOpen: boolean;
}

const iconButton = cn(
  "inline-flex size-9 items-center justify-center rounded-md text-zinc-400 transition-colors",
  "hover:bg-white/[0.05] hover:text-zinc-100",
  "outline-none focus-visible:ring-1 focus-visible:ring-[#D9A53A]/70",
);

export function AdminHeader({
  onOpenMobileNav,
  mobileNavOpen,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const { title, crumbs } = getAdminPageMeta(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.07] bg-[#050506] px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        aria-expanded={mobileNavOpen}
        aria-controls="admin-mobile-nav"
        className={cn(iconButton, "-ml-2 lg:hidden")}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {/* Title + breadcrumb */}
      <div className="min-w-0 flex-1">
        <nav aria-label="Breadcrumb" className="hidden sm:block">
          <ol className="flex items-center gap-1 text-xs text-zinc-500">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              return (
                <li
                  key={`${crumb.label}-${index}`}
                  className="flex items-center gap-1"
                >
                  {index > 0 && (
                    <ChevronRight
                      className="size-3 text-zinc-700"
                      aria-hidden="true"
                    />
                  )}
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="rounded transition-colors hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D9A53A]/70"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current={isLast ? "page" : undefined}>
                      {crumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <h1 className="truncate text-base font-semibold tracking-tight text-zinc-100 sm:text-lg">
          {title}
        </h1>
      </div>

      {/* Search */}
      <button
        type="button"
        aria-label="Search"
        className={cn(
          "hidden h-9 w-64 items-center gap-2 rounded-md border border-white/[0.09] bg-white/[0.02] px-3 text-sm text-zinc-500 transition-colors md:flex lg:w-72",
          "hover:border-white/[0.16] hover:text-zinc-300",
          "outline-none focus-visible:ring-1 focus-visible:ring-[#D9A53A]/70",
        )}
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
          Ctrl K
        </kbd>
      </button>
      <button
        type="button"
        aria-label="Search"
        className={cn(iconButton, "md:hidden")}
      >
        <Search className="size-[18px]" aria-hidden="true" />
      </button>

      <button type="button" aria-label="Notifications" className={iconButton}>
        <Bell className="size-[18px]" aria-hidden="true" />
      </button>

      <AdminUserMenu />
    </header>
  );
}
