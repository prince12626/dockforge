"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Container, Loader2, LogOut } from "lucide-react";

// Adjust this import if your Better Auth client lives elsewhere.
import { authClient } from "@/lib/auth-client";

import { AdminAvatar } from "./admin-avatar";
import { ADMIN_NAV_ITEMS, isNavItemActive } from "./admin-nav";
import { cn } from "./cn";

interface AdminSidebarProps {
  /** Called after a nav link is clicked (used to close the mobile drawer). */
  onNavigate?: () => void;
}

const LOGIN_PATH = "/login";

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [signingOut, setSigningOut] = useState(false);

  const user = session?.user;

  async function handleLogout() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push(LOGIN_PATH);
            router.refresh();
          },
        },
      });
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-[#050506]">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.07] px-5">
        <span className="flex size-8 items-center justify-center rounded-md border border-[#D9A53A]/30 bg-[#D9A53A]/10 text-[#D9A53A]">
          <Container className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold tracking-tight text-zinc-100">
            Dockforge
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            Admin Console
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Admin navigation"
        className="flex-1 overflow-y-auto px-3 py-4"
      >
        <ul className="space-y-0.5">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    "outline-none focus-visible:ring-1 focus-visible:ring-[#D9A53A]/70",
                    active
                      ? "bg-[#D9A53A]/10 font-medium text-[#D9A53A]"
                      : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100",
                  )}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-[#D9A53A]"
                    />
                  )}
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      active
                        ? "text-[#D9A53A]"
                        : "text-zinc-500 group-hover:text-zinc-300",
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile + logout */}
      <div className="shrink-0 border-t border-white/[0.07] p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <AdminAvatar
            name={user?.name}
            image={user?.image}
            className="size-8"
          />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium text-zinc-200">
              {user?.name ?? "Administrator"}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {user?.email ?? "Signed in"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={signingOut}
          className={cn(
            "mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors",
            "hover:bg-white/[0.04] hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-60",
            "outline-none focus-visible:ring-1 focus-visible:ring-[#D9A53A]/70",
          )}
        >
          {signingOut ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogOut className="size-4 text-zinc-500" aria-hidden="true" />
          )}
          <span>{signingOut ? "Signing out…" : "Log out"}</span>
        </button>
      </div>
    </div>
  );
}
