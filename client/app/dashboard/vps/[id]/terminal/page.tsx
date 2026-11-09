"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, type ReactNode } from "react";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getVpsById } from "@/features/vps/vps.thunk";

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

const TerminalComponent = dynamic(
  () => import("@/components/terminal/Terminal"),
  {
    ssr: false,
  },
);

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
      className={`${display.variable} ${body.variable} db-root relative isolate flex h-[calc(100vh-72px)] min-h-0 flex-col overflow-hidden`}
    >
      <div className="db-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="db-glow pointer-events-none absolute -right-40 -top-56 -z-10 h-[520px] w-[520px] rounded-full" />

      {children}

      <style>{styles}</style>
    </main>
  );
}

export default function TerminalPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { selected, isLoading } = useAppSelector((state) => state.vps);

  useEffect(() => {
    if (!id) return;

    if (selected?._id !== id) {
      dispatch(getVpsById(id));
    }
  }, [id, dispatch]);

  if (isLoading || !selected) {
    return (
      <Shell>
        <div className="db-bar-top flex items-center gap-4 px-5 py-4 md:px-8">
          <div className="db-skel h-10 w-10 rounded-xl" />
          <div className="space-y-2.5">
            <div className="db-skel h-6 w-48 rounded" />
            <div className="db-skel h-3.5 w-28 rounded" />
          </div>
        </div>
        <div className="min-h-0 flex-1 p-4 md:p-6">
          <div className="db-skel h-full rounded-2xl" />
        </div>
      </Shell>
    );
  }

  const running = Boolean(selected.runtime?.running);

  return (
    <Shell>
      {/* ---------- Header ---------- */}
      <div className="db-bar-top flex items-center justify-between gap-4 px-5 py-4 md:px-8">
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => router.push(`/dashboard/vps/${selected._id}`)}
            aria-label="Back to VPS details"
            className="db-btn-ghost flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
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
          </button>

          <div
            className={`db-node ${running ? "db-node-on" : ""} hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:flex`}
          >
            <ServerGlyph className="h-[18px] w-[18px]" />
          </div>

          <div className="min-w-0">
            <h1 className="db-display db-title truncate text-xl font-semibold md:text-2xl">
              {selected.name}
            </h1>
            <p className="db-muted text-sm">Browser Terminal</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {selected.container?.name && (
            <span className="db-chip hidden rounded-full px-3 py-1 font-mono text-xs md:inline-block">
              {selected.container.name}
            </span>
          )}

          <span
            className={`db-badge ${
              running ? "db-badge-on" : "db-badge-off"
            } inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium`}
          >
            <span className="db-badge-dot h-1.5 w-1.5 rounded-full" />
            {running ? "Running" : "Stopped"}
          </span>
        </div>
      </div>

      {/* ---------- Terminal ---------- */}
      <div className="min-h-0 flex-1 p-4 md:p-6">
        <div className="db-frame h-full min-h-0 overflow-hidden rounded-2xl">
          <TerminalComponent vpsId={selected.container.id} />
        </div>
      </div>
    </Shell>
  );
}

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
    background: radial-gradient(circle, color-mix(in srgb, var(--db-yellow) 14%, transparent) 0%, transparent 65%);
    filter: blur(48px);
  }

  /* Text */
  .db-title { color: var(--db-white); }
  .db-muted { color: color-mix(in srgb, var(--db-white) 60%, transparent); }

  /* Top bar */
  .db-bar-top {
    border-bottom: 1px solid color-mix(in srgb, var(--db-white) 9%, transparent);
    background: color-mix(in srgb, var(--db-black) 70%, transparent);
    -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
  }

  .db-node {
    color: color-mix(in srgb, var(--db-white) 50%, transparent);
    background: color-mix(in srgb, var(--db-white) 5%, transparent);
    border: 1px solid color-mix(in srgb, var(--db-white) 11%, transparent);
  }
  .db-node-on {
    color: var(--db-yellow);
    background: color-mix(in srgb, var(--db-yellow) 9%, transparent);
    border-color: color-mix(in srgb, var(--db-yellow) 30%, transparent);
  }

  .db-chip {
    color: color-mix(in srgb, var(--db-white) 70%, transparent);
    background: color-mix(in srgb, var(--db-white) 5%, transparent);
    border: 1px solid color-mix(in srgb, var(--db-white) 12%, transparent);
  }

  /* Terminal frame */
  .db-frame {
    position: relative;
    background: var(--db-black);
    border: 1px solid color-mix(in srgb, var(--db-white) 12%, transparent);
    box-shadow: 0 40px 80px -50px color-mix(in srgb, var(--db-yellow) 40%, transparent);
  }
  .db-frame::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 8%;
    right: 8%;
    height: 1px;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(to right, transparent, var(--db-yellow), transparent);
    opacity: .75;
  }

  /* Status badge */
  .db-badge { border: 1px solid color-mix(in srgb, var(--db-white) 12%, transparent); }
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

  /* Ghost button */
  .db-btn-ghost {
    color: color-mix(in srgb, var(--db-white) 85%, transparent);
    background: color-mix(in srgb, var(--db-white) 4%, transparent);
    border: 1px solid color-mix(in srgb, var(--db-white) 14%, transparent);
    transition: background .2s ease, border-color .2s ease, color .2s ease;
  }
  .db-btn-ghost:hover {
    color: var(--db-yellow);
    background: color-mix(in srgb, var(--db-white) 9%, transparent);
    border-color: color-mix(in srgb, var(--db-yellow) 40%, transparent);
  }
  .db-btn-ghost:focus-visible {
    outline: 2px solid var(--db-yellow);
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
    .db-btn-ghost { transition: none; }
  }
`;
