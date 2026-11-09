"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusSquare,
  CreditCard,
  CircleHelp,
  LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import axiosInstance from "@/lib/api";

type Billing = {
  plan?: string;
  usage: {
    usedVps: number;
    maxVps: {
      maxVps: number;
    };
  };
};

const sections = [
  {
    title: "Infrastructure",
    items: [
      { icon: LayoutDashboard, name: "Overview", href: "/dashboard" },
      { icon: PlusSquare, name: "Create VPS", href: "/dashboard/vps/create" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { icon: CreditCard, name: "Billing", href: "/dashboard/billing" },
      { icon: CircleHelp, name: "Support", href: "/dashboard/support" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const [billing, setBilling] = useState<Billing | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  // Fetch on mount, and again on route change so the count stays fresh
  // after a VPS is created or deleted. Skeleton only shows on first load.
  useEffect(() => {
    let cancelled = false;

    const fetchBilling = async () => {
      try {
        const { data } = await axiosInstance.get("/billing");
        if (cancelled) return;
        setBilling(data.data);
        setFailed(false);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBilling();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const logout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  const used = billing?.usage.usedVps ?? 0;
  const limit = billing?.usage.maxVps.maxVps ?? 0;
  const planName = billing?.plan ?? "Free";
  const percent = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const atLimit = limit > 0 && used >= limit;

  const userName = session?.user?.name ?? "Account";

  return (
    <aside className="sb-root fixed flex h-screen w-80 flex-col">
      {/* ---------- Logo ---------- */}
      <div className="sb-rule-b px-6 py-6">
        <Link href="/" className="sb-focus flex items-center gap-3">
          <span className="sb-logo flex h-10 w-10 items-center justify-center rounded-xl">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path
                d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M4 8.5 12 13l8-4.5M12 13v7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>
            <span className="sb-title block text-xl font-semibold leading-none tracking-tight">
              DockForge
            </span>
            <span className="sb-muted-2 mt-1.5 block text-xs">
              Infrastructure Platform
            </span>
          </span>
        </Link>
      </div>

      {/* ---------- Navigation ---------- */}
      <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Sidebar">
        {sections.map((section) => (
          <div key={section.title} className="mb-8">
            <p className="sb-muted-2 mb-2 px-3 text-xs font-medium">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`sb-item sb-focus group relative flex items-center gap-3 rounded-xl px-3 py-2.5 ${
                      active ? "sb-item-active" : ""
                    }`}
                  >
                    {active && <span className="sb-bar" aria-hidden="true" />}

                    <Icon size={18} className="sb-item-icon" />

                    <span className="flex-1 text-[15px] font-medium">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ---------- Bottom ---------- */}
      <div className="sb-rule-t p-4">
        <div className="sb-card rounded-2xl p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="sb-title truncate font-medium">{userName}</p>
            <span className="sb-plan rounded-full px-2.5 py-0.5 text-xs font-medium capitalize">
              {loading ? "…" : planName}
            </span>
          </div>

          <div className="mt-5">
            <div className="mb-2.5 flex items-center justify-between text-xs">
              <span className="sb-muted">VPS usage</span>
              {loading ? (
                <span className="sb-skel h-3.5 w-10 rounded" />
              ) : failed ? (
                <span className="sb-muted-2">Unavailable</span>
              ) : (
                <span
                  className={`tabular-nums ${
                    atLimit ? "sb-yellow font-semibold" : "sb-title"
                  }`}
                >
                  {used} / {limit}
                </span>
              )}
            </div>

            <div
              className="sb-track h-2 overflow-hidden rounded-full"
              role="progressbar"
              aria-label="VPS usage"
              aria-valuemin={0}
              aria-valuemax={limit}
              aria-valuenow={used}
            >
              {loading ? (
                <div className="sb-skel h-full w-full" />
              ) : (
                <div
                  className="sb-fill h-full rounded-full"
                  style={{ width: `${failed ? 0 : percent}%` }}
                />
              )}
            </div>

            {atLimit && !failed && (
              <p className="sb-muted mt-2.5 text-xs leading-5">
                You&apos;ve reached your plan limit.
              </p>
            )}
          </div>

          <Link
            href="/dashboard/billing"
            className={`sb-focus mt-5 flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold ${
              atLimit ? "sb-btn-primary" : "sb-btn-ghost"
            }`}
          >
            Upgrade Plan
          </Link>
        </div>

        <button
          onClick={logout}
          className="sb-btn-ghost sb-btn-danger sb-focus mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <style>{`
        .sb-root {
          --sb-black: var(--color-black, #08090B);
          --sb-white: var(--color-white, #F5F3EF);
          --sb-yellow: var(--color-yellow, #FFC900);
          background: var(--sb-black);
          color: var(--sb-white);
          border-right: 1px solid color-mix(in srgb, var(--sb-white) 10%, transparent);
        }
        .sb-rule-b { border-bottom: 1px solid color-mix(in srgb, var(--sb-white) 9%, transparent); }
        .sb-rule-t { border-top: 1px solid color-mix(in srgb, var(--sb-white) 9%, transparent); }

        /* Text */
        .sb-title { color: var(--sb-white); }
        .sb-muted { color: color-mix(in srgb, var(--sb-white) 60%, transparent); }
        .sb-muted-2 { color: color-mix(in srgb, var(--sb-white) 42%, transparent); }
        .sb-yellow { color: var(--sb-yellow); }

        .sb-focus:focus-visible {
          outline: 2px solid var(--sb-yellow);
          outline-offset: 2px;
        }

        /* Logo */
        .sb-logo {
          color: var(--sb-black);
          background: var(--sb-yellow);
          box-shadow: 0 0 28px -4px color-mix(in srgb, var(--sb-yellow) 60%, transparent);
        }

        /* Nav items */
        .sb-item {
          color: color-mix(in srgb, var(--sb-white) 62%, transparent);
          border: 1px solid transparent;
          transition: background .2s ease, color .2s ease, border-color .2s ease;
        }
        .sb-item:hover {
          color: var(--sb-white);
          background: color-mix(in srgb, var(--sb-white) 5%, transparent);
        }
        .sb-item-icon {
          color: color-mix(in srgb, var(--sb-white) 42%, transparent);
          transition: color .2s ease;
        }
        .sb-item:hover .sb-item-icon { color: var(--sb-white); }
        .sb-item-active {
          color: var(--sb-white);
          background: color-mix(in srgb, var(--sb-yellow) 9%, transparent);
          border-color: color-mix(in srgb, var(--sb-yellow) 22%, transparent);
        }
        .sb-item-active:hover { background: color-mix(in srgb, var(--sb-yellow) 12%, transparent); }
        .sb-item-active .sb-item-icon { color: var(--sb-yellow); }
        .sb-bar {
          position: absolute;
          left: -17px;
          top: 20%;
          bottom: 20%;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background: var(--sb-yellow);
          box-shadow: 0 0 14px var(--sb-yellow);
        }

        /* Usage card */
        .sb-card {
          background: color-mix(in srgb, var(--sb-white) 3.5%, var(--sb-black));
          border: 1px solid color-mix(in srgb, var(--sb-white) 11%, transparent);
        }
        .sb-plan {
          color: var(--sb-yellow);
          background: color-mix(in srgb, var(--sb-yellow) 11%, transparent);
          border: 1px solid color-mix(in srgb, var(--sb-yellow) 32%, transparent);
        }
        .sb-track { background: color-mix(in srgb, var(--sb-white) 10%, transparent); }
        .sb-fill {
          background: linear-gradient(90deg,
            color-mix(in srgb, var(--sb-yellow) 70%, var(--sb-black)), var(--sb-yellow));
          box-shadow: 0 0 12px color-mix(in srgb, var(--sb-yellow) 60%, transparent);
          transition: width .6s cubic-bezier(.4,0,.2,1);
        }
        .sb-skel {
          background: color-mix(in srgb, var(--sb-white) 10%, transparent);
          animation: sb-pulse 1.4s ease-in-out infinite;
        }
        @keyframes sb-pulse { 50% { opacity: .45; } }

        /* Buttons */
        .sb-btn-primary {
          background: var(--sb-yellow);
          color: var(--sb-black);
          box-shadow: 0 8px 28px -10px color-mix(in srgb, var(--sb-yellow) 70%, transparent);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .sb-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 34px -8px color-mix(in srgb, var(--sb-yellow) 85%, transparent);
        }
        .sb-btn-ghost {
          color: color-mix(in srgb, var(--sb-white) 85%, transparent);
          background: color-mix(in srgb, var(--sb-white) 4%, transparent);
          border: 1px solid color-mix(in srgb, var(--sb-white) 14%, transparent);
          transition: background .2s ease, border-color .2s ease, color .2s ease;
        }
        .sb-btn-ghost:hover {
          background: color-mix(in srgb, var(--sb-white) 9%, transparent);
          border-color: color-mix(in srgb, var(--sb-white) 30%, transparent);
        }
        .sb-btn-danger:hover {
          color: #ff7a7a;
          border-color: color-mix(in srgb, #ff7a7a 45%, transparent);
          background: color-mix(in srgb, #ff7a7a 8%, transparent);
        }

        @media (prefers-reduced-motion: reduce) {
          .sb-skel { animation: none; }
          .sb-fill, .sb-item, .sb-btn-primary, .sb-btn-ghost { transition: none; }
          .sb-btn-primary:hover { transform: none; }
        }
      `}</style>
    </aside>
  );
}
