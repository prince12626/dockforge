"use client";

import { getVpsById } from "@/features/vps/vps.thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Terminal } from "lucide-react";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-db-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-db-body",
  display: "swap",
});

function ServerGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="6.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <rect
        x="3"
        y="13.5"
        width="18"
        height="6.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M7 7.25h.01M7 16.75h.01"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <main
      className={`${display.variable} ${body.variable} db-root relative isolate min-h-screen overflow-hidden`}
    >
      <div className="db-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="db-glow pointer-events-none absolute -right-40 -top-48 -z-10 h-[560px] w-[560px] rounded-full" />
      <div className="db-grain pointer-events-none fixed inset-0 z-50" />

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        {children}
      </section>

      <style>{styles}</style>
    </main>
  );
}

const VPSDetails = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { selected } = useAppSelector((state) => state.vps);

  useEffect(() => {
    dispatch(getVpsById(id));
  }, [id, dispatch]);

  if (!selected) {
    return (
      <Shell>
        <div className="flex items-center gap-4">
          <div className="db-skel h-14 w-14 rounded-2xl" />
          <div className="space-y-3">
            <div className="db-skel h-8 w-56 rounded" />
            <div className="db-skel h-4 w-40 rounded" />
          </div>
        </div>
        <div className="db-skel mt-10 h-36 rounded-3xl" />
        <div className="db-skel mt-14 h-64 rounded-2xl" />
      </Shell>
    );
  }

  const memoryGB = (selected.resources.memory / 1024).toFixed(1);
  const running = Boolean(selected.runtime?.running);
  const runtimeStatus =
    selected.runtime?.status || (running ? "running" : "stopped");

  const stats = [
    { label: "CPU", value: `${selected.resources.cpu}`, unit: "vCPU" },
    { label: "Memory", value: memoryGB, unit: "GB" },
    { label: "Storage", value: `${selected.resources.storage}`, unit: "GB" },
  ];

  const connection = [
    {
      label: "Container ID",
      value: selected.container?.id?.slice(0, 18) ?? "–",
      mono: true,
    },
    {
      label: "Container Name",
      value: selected.container?.name ?? "–",
      mono: true,
    },
    { label: "OS", value: selected.os, mono: false },
    { label: "Status", value: selected.status, mono: false },
  ];

  return (
    <Shell>
      {/* ---------- Header ---------- */}
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="db-back inline-flex items-center gap-2 text-sm"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M15 5l-7 7 7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to dashboard
      </button>

      <header className="mt-6 flex flex-wrap items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-4 md:gap-5">
          <div
            className={`db-node ${running ? "db-node-on" : ""} flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl`}
          >
            <ServerGlyph className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <h1 className="db-display db-title truncate text-3xl font-semibold md:text-5xl">
              {selected.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span
                className={`db-badge ${
                  running ? "db-badge-on" : "db-badge-off"
                } inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium capitalize`}
              >
                <span className="db-badge-dot h-1.5 w-1.5 rounded-full" />
                {runtimeStatus}
              </span>

              <span className="db-muted text-sm">
                Created {new Date(selected.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            router.push(`/dashboard/vps/${selected._id}/terminal`);
          }}
          className="db-btn-primary inline-flex h-11 items-center gap-2.5 rounded-xl px-6 text-sm font-semibold"
        >
          <Terminal size={18} />
          Open Terminal
        </button>
      </header>

      {/* ---------- Overview ---------- */}
      <div className="db-fleet mt-10 rounded-3xl md:mt-12">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          <div className="db-cell p-6 md:p-8">
            <p className="db-muted text-sm">Status</p>
            <p className="mt-3">
              <span
                className={`db-badge ${
                  running ? "db-badge-on" : "db-badge-off"
                } inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-base font-medium`}
              >
                <span className="db-badge-dot h-2 w-2 rounded-full" />
                {running ? "Running" : "Stopped"}
              </span>
            </p>
          </div>

          {stats.map((stat) => (
            <div key={stat.label} className="db-cell p-6 md:p-8">
              <p className="db-muted text-sm">{stat.label}</p>
              <p className="db-display db-title mt-2 flex items-baseline gap-2 tabular-nums">
                <span className="db-stat-num">{stat.value}</span>
                <span className="db-muted-2 text-base font-medium">
                  {stat.unit}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Connection ---------- */}
      <section className="mt-14">
        <h2 className="db-display db-title text-xl font-semibold md:text-2xl">
          Connection
        </h2>

        <div className="db-table mt-5 overflow-hidden rounded-2xl">
          {connection.map((item) => (
            <div
              key={item.label}
              className="db-row flex items-center justify-between gap-6 px-5 py-4 md:px-7 md:py-5"
            >
              <span className="db-muted text-sm">{item.label}</span>

              <span
                className={`db-title min-w-0 truncate text-sm font-medium md:text-base ${
                  item.mono ? "font-mono" : ""
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Runtime ---------- */}
      <section className="mt-14">
        <h2 className="db-display db-title text-xl font-semibold md:text-2xl">
          Runtime
        </h2>

        <div className="mt-5 grid gap-4 md:gap-6 lg:grid-cols-2">
          <div className="db-card rounded-2xl p-6 md:p-8">
            <p className="db-muted text-sm">Process ID</p>

            <h3 className="db-display db-title mt-3 text-4xl font-semibold tabular-nums">
              {selected.runtime?.pid ?? "–"}
            </h3>
          </div>

          <div className="db-card rounded-2xl p-6 md:p-8">
            <p className="db-muted text-sm">Started At</p>

            <h3 className="db-display db-title mt-3 text-2xl font-semibold md:text-3xl">
              {selected.runtime?.startedAt
                ? new Date(selected.runtime.startedAt).toLocaleString()
                : "Not started"}
            </h3>
          </div>
        </div>
      </section>
    </Shell>
  );
};

export default VPSDetails;

const styles = `
  .db-root {
    --db-black: var(--color-black, #08090B);
    --db-white: var(--color-white, #F5F3EF);
    --db-yellow: var(--color-yellow, #FFC900);
    background: var(--db-black);
    color: var(--db-white);
    font-family: var(--font-db-body), ui-sans-serif, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .db-display {
    font-family: var(--font-db-display), var(--font-db-body), ui-sans-serif, system-ui, sans-serif;
    letter-spacing: -0.03em;
  }

  /* Backdrop */
  .db-grid {
    background-image:
      linear-gradient(to right, color-mix(in srgb, var(--db-white) 5%, transparent) 1px, transparent 1px),
      linear-gradient(to bottom, color-mix(in srgb, var(--db-white) 5%, transparent) 1px, transparent 1px);
    background-size: 64px 64px;
    -webkit-mask-image: radial-gradient(ellipse 70% 50% at 80% 0%, #000 10%, transparent 75%);
            mask-image: radial-gradient(ellipse 70% 50% at 80% 0%, #000 10%, transparent 75%);
  }
  .db-glow {
    background: radial-gradient(circle, color-mix(in srgb, var(--db-yellow) 16%, transparent) 0%, transparent 65%);
    filter: blur(48px);
  }
  .db-grain {
    opacity: .07;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  /* Text */
  .db-title { color: var(--db-white); }
  .db-muted { color: color-mix(in srgb, var(--db-white) 60%, transparent); }
  .db-muted-2 { color: color-mix(in srgb, var(--db-white) 42%, transparent); }

  .db-back {
    color: color-mix(in srgb, var(--db-white) 60%, transparent);
    transition: color .2s ease;
  }
  .db-back:hover { color: var(--db-yellow); }
  .db-back:focus-visible {
    outline: 2px solid var(--db-yellow);
    outline-offset: 4px;
    border-radius: 6px;
  }

  /* Server node */
  .db-node {
    color: color-mix(in srgb, var(--db-white) 50%, transparent);
    background: color-mix(in srgb, var(--db-white) 5%, transparent);
    border: 1px solid color-mix(in srgb, var(--db-white) 11%, transparent);
  }
  .db-node-on {
    color: var(--db-yellow);
    background: color-mix(in srgb, var(--db-yellow) 9%, transparent);
    border-color: color-mix(in srgb, var(--db-yellow) 30%, transparent);
    box-shadow: 0 0 40px -10px color-mix(in srgb, var(--db-yellow) 55%, transparent);
  }

  /* Surfaces */
  .db-card {
    background: color-mix(in srgb, var(--db-white) 3%, var(--db-black));
    border: 1px solid color-mix(in srgb, var(--db-white) 10%, transparent);
    box-shadow: 0 30px 60px -40px #000;
  }
  .db-fleet {
    position: relative;
    background:
      radial-gradient(ellipse 60% 120% at 0% 0%, color-mix(in srgb, var(--db-yellow) 9%, transparent), transparent 60%),
      color-mix(in srgb, var(--db-white) 3%, var(--db-black));
    border: 1px solid color-mix(in srgb, var(--db-white) 11%, transparent);
    box-shadow: 0 40px 80px -50px color-mix(in srgb, var(--db-yellow) 35%, transparent);
  }
  .db-fleet::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 8%;
    right: 8%;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--db-yellow), transparent);
    opacity: .75;
  }
  .db-table {
    background: color-mix(in srgb, var(--db-white) 3%, var(--db-black));
    border: 1px solid color-mix(in srgb, var(--db-white) 10%, transparent);
    box-shadow: 0 30px 60px -40px #000;
  }
  .db-row { border-bottom: 1px solid color-mix(in srgb, var(--db-white) 7%, transparent); }
  .db-row:last-child { border-bottom: 0; }

  /* Overview strip dividers */
  .db-cell {
    border-right: 1px solid color-mix(in srgb, var(--db-white) 9%, transparent);
    border-bottom: 1px solid color-mix(in srgb, var(--db-white) 9%, transparent);
  }
  .db-cell:nth-child(2n) { border-right: 0; }
  .db-cell:nth-child(n+3) { border-bottom: 0; }
  @media (min-width: 1024px) {
    .db-cell { border-bottom: 0; border-right: 1px solid color-mix(in srgb, var(--db-white) 9%, transparent); }
    .db-cell:nth-child(2n) { border-right: 1px solid color-mix(in srgb, var(--db-white) 9%, transparent); }
    .db-cell:last-child { border-right: 0; }
  }
  .db-stat-num {
    font-size: clamp(2.25rem, 5vw, 3.5rem);
    line-height: 1;
    font-weight: 600;
    letter-spacing: -0.05em;
  }

  /* Status badge */
  .db-badge {
    border: 1px solid color-mix(in srgb, var(--db-white) 12%, transparent);
  }
  .db-badge-dot { position: relative; }
  .db-badge-on {
    color: var(--db-yellow);
    background: color-mix(in srgb, var(--db-yellow) 10%, transparent);
    border-color: color-mix(in srgb, var(--db-yellow) 35%, transparent);
  }
  .db-badge-on .db-badge-dot {
    background: var(--db-yellow);
    box-shadow: 0 0 10px var(--db-yellow);
  }
  .db-badge-on .db-badge-dot::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: var(--db-yellow);
    animation: db-ping 2s cubic-bezier(0, 0, .2, 1) infinite;
  }
  @keyframes db-ping { 0% { transform: scale(1); opacity: .7; } 80%, 100% { transform: scale(3.2); opacity: 0; } }
  .db-badge-off {
    color: color-mix(in srgb, var(--db-white) 55%, transparent);
    background: color-mix(in srgb, var(--db-white) 4%, transparent);
  }
  .db-badge-off .db-badge-dot { background: color-mix(in srgb, var(--db-white) 40%, transparent); }

  /* Primary button */
  .db-btn-primary {
    background: var(--db-yellow);
    color: var(--db-black);
    box-shadow:
      0 8px 28px -10px color-mix(in srgb, var(--db-yellow) 70%, transparent),
      inset 0 1px 0 color-mix(in srgb, var(--db-white) 45%, transparent);
    transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
  }
  .db-btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow:
      0 12px 36px -8px color-mix(in srgb, var(--db-yellow) 85%, transparent),
      inset 0 1px 0 color-mix(in srgb, var(--db-white) 45%, transparent);
  }
  .db-btn-primary:focus-visible {
    outline: 2px solid var(--db-white);
    outline-offset: 2px;
  }

  /* Skeleton */
  .db-skel {
    background: color-mix(in srgb, var(--db-white) 8%, transparent);
    animation: db-pulse 1.4s ease-in-out infinite;
  }
  @keyframes db-pulse { 50% { opacity: .45; } }

  @media (prefers-reduced-motion: reduce) {
    .db-skel, .db-badge-on .db-badge-dot::after { animation: none; }
    .db-btn-primary, .db-back { transition: none; }
    .db-btn-primary:hover:not(:disabled) { transform: none; }
  }
`;
