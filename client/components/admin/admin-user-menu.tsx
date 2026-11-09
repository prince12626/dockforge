"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { AdminAvatar } from "./admin-avatar";
import { cn } from "./cn";

const LOGIN_PATH = "/login";
const USER_DASHBOARD_PATH = "/dashboard";

export function AdminUserMenu() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const user = session?.user;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(LOGIN_PATH);
          router.refresh();
        },
      },
    });
  }

  const itemClass =
    "flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-sm text-zinc-300 outline-none transition-colors hover:bg-white/[0.05] hover:text-zinc-100 focus-visible:bg-white/[0.05]";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
        className={cn(
          "flex items-center gap-1.5 rounded-full p-0.5 pr-1.5 transition-colors",
          "hover:bg-white/[0.05] outline-none focus-visible:ring-1 focus-visible:ring-[#D9A53A]/70",
        )}
      >
        <AdminAvatar name={user?.name} image={user?.image} className="size-8" />
        <ChevronDown
          className={cn(
            "hidden size-3.5 text-zinc-500 transition-transform sm:block",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 rounded-lg border border-white/[0.09] bg-[#0a0a0c] p-1.5 shadow-xl shadow-black/60"
        >
          <div className="border-b border-white/[0.07] px-2.5 pb-2.5 pt-2">
            <p className="truncate text-sm font-medium text-zinc-100">
              {user?.name ?? "Administrator"}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {user?.email ?? "Signed in"}
            </p>
          </div>

          <div className="pt-1.5">
            <Link
              href={USER_DASHBOARD_PATH}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={itemClass}
            >
              <LayoutDashboard
                className="size-4 text-zinc-500"
                aria-hidden="true"
              />
              User dashboard
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className={itemClass}
            >
              <LogOut className="size-4 text-zinc-500" aria-hidden="true" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
