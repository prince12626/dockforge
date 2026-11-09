"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import axiosInstance from "@/lib/api";
import Link from "next/link";

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

interface BillingData {
  subscription: any;
  plans: any[];
  payments: any[];
  usage: {
    usedVps: number;
    maxVps: number | any;
  };
}

function CardGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M7 15h3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <span className="db-check mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
      <svg
        viewBox="0 0 24 24"
        className="h-3 w-3"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 12.5l4.5 4.5L19 7.5"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const statusTone = (status?: string) => {
  const value = (status || "").toLowerCase();
  if (
    ["success", "paid", "completed", "captured", "succeeded"].includes(value)
  ) {
    return "db-badge-on";
  }
  if (/fail|error|declin|cancel/.test(value)) return "db-badge-bad";
  return "db-badge-off";
};

function Shell({ children }: { children: ReactNode }) {
  return (
    <main
      className={`${display.variable} ${body.variable} db-root relative isolate min-h-screen overflow-hidden`}
    >
      <div className="db-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="db-glow pointer-events-none absolute -right-40 -top-48 -z-10 h-[560px] w-[560px] rounded-full" />
      <div className="db-grain pointer-events-none fixed inset-0 z-50" />

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <header className="flex items-center gap-4">
          <div className="db-mark flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
            <CardGlyph className="h-6 w-6" />
          </div>
          <div>
            <h1 className="db-display db-title text-3xl font-semibold md:text-4xl">
              Billing
            </h1>
            <p className="db-muted mt-1 text-sm md:text-base">
              Manage your subscription and payments.
            </p>
          </div>
        </header>

        {children}
      </section>

      <style>{styles}</style>
    </main>
  );
}

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const { data } = await axiosInstance.get("/billing");
        setBilling(data.data);
      } finally {
        setLoading(false);
      }
    };

    fetchBilling();
  }, []);

  if (loading) {
    return (
      <Shell>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="db-skel h-64 rounded-3xl lg:col-span-2" />
          <div className="db-skel h-64 rounded-3xl" />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="db-skel h-72 rounded-2xl" />
          ))}
        </div>
      </Shell>
    );
  }

  if (!billing) return null;

  const { subscription, usage, plans, payments } = billing;
  const currentPlan = subscription?.planId;

  // Backend is sending the full plan object instead of just the number
  const maxVps: number =
    typeof usage.maxVps === "object" && usage.maxVps !== null
      ? usage.maxVps.maxVps
      : usage.maxVps;

  const hasLimit = Number.isFinite(maxVps) && maxVps > 0;
  const usedPct = hasLimit ? Math.min((usage.usedVps / maxVps) * 100, 100) : 0;
  const remaining = hasLimit ? Math.max(maxVps - usage.usedVps, 0) : 0;

  return (
    <Shell>
      {/* ---------- Current plan + usage ---------- */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:mt-12 lg:grid-cols-3">
        {/* Current Plan */}
        <section className="db-fleet rounded-3xl p-6 md:p-10 lg:col-span-2">
          <h2 className="db-muted text-sm">Current Plan</h2>

          {subscription && currentPlan ? (
            <div className="mt-3 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <h3 className="db-display db-title text-4xl font-semibold md:text-5xl">
                  {currentPlan.name}
                </h3>

                <p className="mt-3 flex items-baseline gap-1.5">
                  <span className="db-display db-title text-2xl font-semibold tabular-nums">
                    ₹{currentPlan.price}
                  </span>
                  <span className="db-muted text-sm">/month</span>
                </p>

                <p className="db-muted-2 mt-2 text-sm">
                  Expires{" "}
                  {subscription.expiresAt
                    ? new Date(subscription.expiresAt).toLocaleDateString()
                    : "No expiry date"}
                </p>

                <ul className="mt-7 space-y-3">
                  {currentPlan.features?.map((feature: string) => (
                    <li
                      key={feature}
                      className="db-title flex items-start gap-3 text-sm"
                    >
                      <Check />
                      <span className="opacity-80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/plans"
                className="db-btn-ghost h-11 shrink-0 rounded-xl px-6 text-sm font-medium"
              >
                Upgrade Plan
              </Link>
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="db-empty-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
                <CardGlyph className="h-6 w-6" />
              </div>
              <div>
                <h3 className="db-display db-title text-2xl font-semibold">
                  No Active Subscription
                </h3>
                <p className="db-muted mt-2 max-w-md text-sm leading-6">
                  You haven&apos;t subscribed to any plan yet. Choose a plan
                  below to get started.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Usage */}
        <section className="db-card flex flex-col justify-between rounded-3xl p-6 md:p-8">
          <div>
            <p className="db-muted text-sm">VPS Usage</p>

            <p className="db-display db-title mt-3 tabular-nums">
              <span className="db-usage-num">{usage.usedVps}</span>
              <span className="db-muted-2 ml-2 text-2xl font-medium">
                / {maxVps}
              </span>
            </p>
          </div>

          <div className="mt-8">
            <div
              className="db-bar"
              role="img"
              aria-label={`${usage.usedVps} of ${maxVps} VPS used`}
            >
              {usedPct > 0 && (
                <span
                  className="db-seg db-seg-on"
                  style={{ width: `${usedPct}%` }}
                />
              )}
            </div>

            {hasLimit && (
              <p className="db-muted mt-3 text-sm tabular-nums">
                {remaining > 0
                  ? `${remaining} VPS left on your plan`
                  : "You've reached your plan limit"}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* ---------- Plans ---------- */}
      <section className="mt-14">
        <h2 className="db-display db-title text-xl font-semibold md:text-2xl">
          Available Plans
        </h2>

        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = currentPlan?._id === plan._id;

            return (
              <div
                key={plan._id}
                className={`db-plan ${isCurrent ? "db-plan-on" : ""} flex flex-col rounded-2xl p-6 md:p-7`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="db-display db-title text-2xl font-semibold">
                    {plan.name}
                  </h3>
                  {isCurrent && (
                    <span className="db-count rounded-full px-2.5 py-0.5 text-xs font-medium">
                      Current
                    </span>
                  )}
                </div>

                <p className="mt-4 flex items-baseline gap-1.5">
                  <span className="db-display db-title text-4xl font-semibold tabular-nums">
                    ₹{plan.price}
                  </span>
                  <span className="db-muted text-sm">/month</span>
                </p>

                <ul className="mt-7 flex-1 space-y-3 border-t border-white/10 pt-6">
                  {plan.features?.map((feature: string) => (
                    <li
                      key={feature}
                      className="db-title flex items-start gap-3 text-sm"
                    >
                      <Check />
                      <span className="opacity-80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <button
                    className="db-btn-ghost mt-8 h-11 w-full rounded-xl text-sm font-medium"
                    disabled
                  >
                    Current Plan
                  </button>
                ) : (
                  <Link
                    href="/plans"
                    className="db-btn-primary mt-8 h-11 w-full rounded-xl text-sm font-semibold"
                  >
                    Upgrade
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- Payment history ---------- */}
      <section className="mt-14">
        <h2 className="db-display db-title text-xl font-semibold md:text-2xl">
          Payment History
        </h2>

        <div className="db-table mt-5 overflow-hidden rounded-2xl">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="db-empty-icon flex h-14 w-14 items-center justify-center rounded-2xl">
                <CardGlyph className="h-6 w-6" />
              </div>
              <p className="db-muted mt-5 text-sm">No payments found.</p>
            </div>
          ) : (
            payments.map((payment: any) => (
              <div
                key={payment._id}
                className="db-row flex items-center justify-between gap-4 px-5 py-5 md:px-6"
              >
                <div className="min-w-0">
                  <p className="db-display db-title text-xl font-semibold tabular-nums">
                    ₹{payment.amount}
                  </p>

                  <p className="db-muted-2 mt-0.5 text-sm">
                    {new Date(payment.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`db-badge ${statusTone(payment.status)} inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium capitalize`}
                >
                  <span className="db-badge-dot h-1.5 w-1.5 rounded-full" />
                  {payment.status}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
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

  .db-mark {
    color: var(--db-black);
    background: var(--db-yellow);
    box-shadow:
      0 10px 30px -10px color-mix(in srgb, var(--db-yellow) 75%, transparent),
      inset 0 1px 0 color-mix(in srgb, var(--db-white) 55%, transparent);
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

  /* Plan cards */
  .db-plan {
    position: relative;
    background: color-mix(in srgb, var(--db-white) 3%, var(--db-black));
    border: 1px solid color-mix(in srgb, var(--db-white) 10%, transparent);
    transition: border-color .25s ease;
  }
  .db-plan:hover { border-color: color-mix(in srgb, var(--db-white) 24%, transparent); }
  .db-plan-on,
  .db-plan-on:hover {
    border-color: var(--db-yellow);
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--db-yellow) 9%, transparent), transparent 70%),
      color-mix(in srgb, var(--db-white) 3%, var(--db-black));
    box-shadow: 0 30px 70px -40px color-mix(in srgb, var(--db-yellow) 55%, transparent);
  }
  .db-count {
    color: var(--db-yellow);
    background: color-mix(in srgb, var(--db-yellow) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--db-yellow) 28%, transparent);
  }
  .db-check {
    color: var(--db-yellow);
    background: color-mix(in srgb, var(--db-yellow) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--db-yellow) 30%, transparent);
  }

  /* Usage */
  .db-usage-num {
    font-size: clamp(3.5rem, 8vw, 5rem);
    line-height: .95;
    font-weight: 600;
    letter-spacing: -0.06em;
  }
  .db-bar {
    display: flex;
    gap: 4px;
    height: 14px;
    border-radius: 999px;
    padding: 2px;
    background: color-mix(in srgb, var(--db-white) 6%, transparent);
    border: 1px solid color-mix(in srgb, var(--db-white) 8%, transparent);
  }
  .db-seg {
    display: block;
    height: 100%;
    min-width: 6px;
    border-radius: 999px;
    transform-origin: left center;
    animation: db-grow .9s cubic-bezier(.22, 1, .36, 1) both;
  }
  .db-seg-on {
    background: var(--db-yellow);
    box-shadow: 0 0 18px color-mix(in srgb, var(--db-yellow) 55%, transparent);
  }
  @keyframes db-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

  /* Status badge */
  .db-badge { border: 1px solid color-mix(in srgb, var(--db-white) 12%, transparent); }
  .db-badge-on {
    color: var(--db-yellow);
    background: color-mix(in srgb, var(--db-yellow) 10%, transparent);
    border-color: color-mix(in srgb, var(--db-yellow) 35%, transparent);
  }
  .db-badge-on .db-badge-dot {
    background: var(--db-yellow);
    box-shadow: 0 0 10px var(--db-yellow);
  }
  .db-badge-off {
    color: color-mix(in srgb, var(--db-white) 55%, transparent);
    background: color-mix(in srgb, var(--db-white) 4%, transparent);
  }
  .db-badge-off .db-badge-dot { background: color-mix(in srgb, var(--db-white) 40%, transparent); }
  .db-badge-bad {
    color: #ff7a7a;
    background: color-mix(in srgb, #ff7a7a 8%, transparent);
    border-color: color-mix(in srgb, #ff7a7a 35%, transparent);
  }
  .db-badge-bad .db-badge-dot { background: #ff7a7a; }

  /* Buttons */
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
  .db-btn-ghost {
    color: color-mix(in srgb, var(--db-white) 85%, transparent);
    background: color-mix(in srgb, var(--db-white) 4%, transparent);
    border: 1px solid color-mix(in srgb, var(--db-white) 14%, transparent);
    transition: background .2s ease, border-color .2s ease, color .2s ease;
  }
  .db-btn-ghost:hover:not(:disabled) {
    background: color-mix(in srgb, var(--db-white) 9%, transparent);
    border-color: color-mix(in srgb, var(--db-white) 30%, transparent);
  }
  .db-btn-primary:disabled, .db-btn-ghost:disabled {
    opacity: .5;
    cursor: not-allowed;
  }
  .db-btn-primary:focus-visible, .db-btn-ghost:focus-visible {
    outline: 2px solid var(--db-white);
    outline-offset: 2px;
  }

  /* Empty + skeleton */
  .db-empty-icon {
    color: var(--db-yellow);
    background: color-mix(in srgb, var(--db-yellow) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--db-yellow) 30%, transparent);
    box-shadow: 0 0 40px -8px color-mix(in srgb, var(--db-yellow) 45%, transparent);
  }
  .db-skel {
    background: color-mix(in srgb, var(--db-white) 8%, transparent);
    animation: db-pulse 1.4s ease-in-out infinite;
  }
  @keyframes db-pulse { 50% { opacity: .45; } }

  @media (prefers-reduced-motion: reduce) {
    .db-skel, .db-seg { animation: none; }
    .db-btn-primary, .db-btn-ghost, .db-plan { transition: none; }
    .db-btn-primary:hover:not(:disabled) { transform: none; }
  }
`;
