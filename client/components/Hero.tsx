"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const STATS = [
  { value: "60s", label: "Deployment" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Monitoring" },
  { value: "SSH", label: "Instant access" },
];

const Hero = () => {
  const { data: session, isPending } = authClient.useSession();

  return (
    <section className="hx-root relative isolate overflow-hidden">
      {/* ---------- Background ---------- */}
      <div className="hx-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="hx-glow pointer-events-none absolute -right-40 top-10 -z-10 h-[620px] w-[620px] rounded-full" />
      <div className="hx-glow-soft pointer-events-none absolute -left-52 bottom-0 -z-10 h-[420px] w-[420px] rounded-full" />

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* ---------- Main split ---------- */}
        <div className="grid min-h-[calc(100vh-72px-132px)] items-center gap-16 py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-24">
          {/* Left: copy */}
          <div>
            <div className="hx-badge mb-8 inline-flex items-center gap-3 rounded-full py-1.5 pl-2 pr-4 text-sm">
              <span className="hx-badge-dot relative flex h-5 w-5 items-center justify-center rounded-full">
                <span className="hx-ping absolute inline-flex h-full w-full rounded-full" />
                <span className="hx-dot relative inline-flex h-2 w-2 rounded-full" />
              </span>
              Launch VPS instances in under 60 seconds
            </div>

            <h1 className="hx-title text-5xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-6xl lg:text-[5.25rem]">
              Powerful VPS hosting.
              <span className="hx-title-dim block">Built for developers.</span>
            </h1>

            <p className="hx-muted mt-8 max-w-xl text-lg leading-8 md:text-xl md:leading-9">
              Deploy, manage and monitor high-performance virtual servers from
              one clean dashboard. Configure networking, storage, firewalls and
              Docker with a few clicks.
            </p>

            <div className="mt-11 flex flex-col gap-4 sm:flex-row sm:items-center">
              {isPending ? (
                <div className="hx-skeleton h-[52px] w-[190px] rounded-xl" />
              ) : (
                <Link
                  href={session ? "/dashboard" : "/register"}
                  className="hx-btn-primary group relative inline-flex h-[52px] items-center justify-center gap-2 overflow-hidden rounded-xl px-8 text-base font-semibold"
                >
                  <span className="relative z-10">
                    {session ? "Go to Dashboard" : "Create Account"}
                  </span>
                  <svg
                    className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8h10m0 0L9 4m4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="hx-shine" aria-hidden="true" />
                </Link>
              )}

              <Link
                href="/demo"
                className="hx-btn-secondary inline-flex h-[52px] items-center justify-center rounded-xl px-8 text-base font-medium"
              >
                Live Demo
              </Link>
            </div>
          </div>

          {/* Right: the deploy sequence (single hero moment) */}
          <div className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
            <div className="hx-card-halo pointer-events-none absolute -inset-px rounded-[22px]" />

            <div className="hx-card relative overflow-hidden rounded-[20px]">
              {/* Card header */}
              <div className="hx-card-head flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5" aria-hidden="true">
                    <span className="hx-win h-2.5 w-2.5 rounded-full" />
                    <span className="hx-win h-2.5 w-2.5 rounded-full" />
                    <span className="hx-win h-2.5 w-2.5 rounded-full" />
                  </div>
                  <span className="hx-muted-2 font-mono text-[13px]">
                    vps-01 / ubuntu-24.04
                  </span>
                </div>

                <span className="hx-status relative inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
                  <span className="hx-status-dot h-1.5 w-1.5 rounded-full" />
                  <span className="hx-status-text">Provisioning</span>
                  <span className="hx-status-text-done">Running</span>
                </span>
              </div>

              {/* Terminal body */}
              <div className="px-6 pb-6 pt-6 font-mono text-[13.5px] leading-7 md:text-sm">
                <div className="hx-step" style={{ ["--d" as string]: "0.3s" }}>
                  <span className="hx-prompt">$</span>{" "}
                  <span className="hx-cmd">forge deploy</span>{" "}
                  <span className="hx-muted-2">--plan 2vcpu-4gb</span>
                </div>

                <div
                  className="hx-step mt-3"
                  style={{ ["--d" as string]: "1s" }}
                >
                  <span className="hx-ok">✓</span>{" "}
                  <span className="hx-muted">
                    Allocated 2 vCPU, 4 GB RAM, 80 GB NVMe
                  </span>
                </div>
                <div className="hx-step" style={{ ["--d" as string]: "1.7s" }}>
                  <span className="hx-ok">✓</span>{" "}
                  <span className="hx-muted">Network and firewall ready</span>
                </div>
                <div className="hx-step" style={{ ["--d" as string]: "2.4s" }}>
                  <span className="hx-ok">✓</span>{" "}
                  <span className="hx-muted">Docker installed</span>
                </div>
                <div className="hx-step" style={{ ["--d" as string]: "3.1s" }}>
                  <span className="hx-ok">✓</span>{" "}
                  <span className="hx-muted">SSH key attached</span>
                </div>

                {/* Progress */}
                <div className="mt-6">
                  <div className="hx-track h-1.5 w-full overflow-hidden rounded-full">
                    <div className="hx-fill h-full rounded-full" />
                  </div>
                </div>

                {/* Final line */}
                <div
                  className="hx-final mt-6 rounded-xl px-4 py-3.5"
                  style={{ ["--d" as string]: "4.1s" }}
                >
                  <div className="hx-muted-2 text-xs">Your server is live</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="hx-prompt">$</span>
                    <span className="hx-cmd">ssh root@203.0.113.24</span>
                    <span className="hx-cursor ml-0.5 inline-block h-4 w-[7px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Stats strip ---------- */}
        <div className="hx-stats grid grid-cols-2 md:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="hx-stat px-2 py-8 md:px-8 md:first:pl-0"
            >
              <div className="hx-title text-3xl font-semibold tracking-tight md:text-4xl">
                {stat.value}
              </div>
              <div className="hx-muted-2 mt-1.5 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hx-root {
          --hx-black: var(--color-black, #08090B);
          --hx-white: var(--color-white, #F5F3EF);
          --hx-yellow: var(--color-yellow, #FFC900);
          background: var(--hx-black);
          color: var(--hx-white);
          border-bottom: 1px solid color-mix(in srgb, var(--hx-white) 10%, transparent);
        }

        /* Background */
        .hx-grid {
          background-image:
            linear-gradient(to right, color-mix(in srgb, var(--hx-white) 7%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb, var(--hx-white) 7%, transparent) 1px, transparent 1px);
          background-size: 64px 64px;
          -webkit-mask-image: radial-gradient(ellipse 75% 70% at 60% 35%, #000 20%, transparent 75%);
                  mask-image: radial-gradient(ellipse 75% 70% at 60% 35%, #000 20%, transparent 75%);
        }
        .hx-glow {
          background: radial-gradient(circle, color-mix(in srgb, var(--hx-yellow) 26%, transparent) 0%, transparent 65%);
          filter: blur(30px);
        }
        .hx-glow-soft {
          background: radial-gradient(circle, color-mix(in srgb, var(--hx-yellow) 9%, transparent) 0%, transparent 70%);
          filter: blur(40px);
        }

        /* Text */
        .hx-title { color: var(--hx-white); }
        .hx-title-dim { color: color-mix(in srgb, var(--hx-white) 48%, transparent); }
        .hx-muted { color: color-mix(in srgb, var(--hx-white) 62%, transparent); }
        .hx-muted-2 { color: color-mix(in srgb, var(--hx-white) 45%, transparent); }

        /* Badge */
        .hx-badge {
          color: color-mix(in srgb, var(--hx-white) 78%, transparent);
          background: color-mix(in srgb, var(--hx-white) 4%, transparent);
          border: 1px solid color-mix(in srgb, var(--hx-white) 12%, transparent);
          backdrop-filter: blur(10px);
        }
        .hx-badge-dot { background: color-mix(in srgb, var(--hx-yellow) 14%, transparent); }
        .hx-dot { background: var(--hx-yellow); }
        .hx-ping {
          background: var(--hx-yellow);
          opacity: .5;
          animation: hx-ping 2s cubic-bezier(0,0,.2,1) infinite;
        }

        /* Buttons */
        .hx-btn-primary {
          background: var(--hx-yellow);
          color: var(--hx-black);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--hx-yellow) 60%, transparent),
            0 10px 40px -10px color-mix(in srgb, var(--hx-yellow) 70%, transparent);
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .hx-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow:
            0 0 0 1px var(--hx-yellow),
            0 18px 55px -8px color-mix(in srgb, var(--hx-yellow) 85%, transparent);
        }
        .hx-shine {
          position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.55) 50%, transparent 70%);
          transform: translateX(-120%);
        }
        .hx-btn-primary:hover .hx-shine { transform: translateX(120%); transition: transform .8s ease; }

        .hx-btn-secondary {
          color: var(--hx-white);
          background: color-mix(in srgb, var(--hx-white) 4%, transparent);
          border: 1px solid color-mix(in srgb, var(--hx-white) 16%, transparent);
          transition: background .25s ease, border-color .25s ease, transform .25s ease;
        }
        .hx-btn-secondary:hover {
          background: color-mix(in srgb, var(--hx-white) 9%, transparent);
          border-color: color-mix(in srgb, var(--hx-white) 32%, transparent);
          transform: translateY(-2px);
        }
        .hx-btn-primary:focus-visible,
        .hx-btn-secondary:focus-visible {
          outline: 2px solid var(--hx-white);
          outline-offset: 3px;
        }
        .hx-skeleton {
          background: color-mix(in srgb, var(--hx-white) 8%, transparent);
          animation: hx-pulse 1.4s ease-in-out infinite;
        }

        /* Card */
        .hx-card {
          background: linear-gradient(180deg,
            color-mix(in srgb, var(--hx-white) 6%, var(--hx-black)) 0%,
            color-mix(in srgb, var(--hx-white) 2%, var(--hx-black)) 100%);
          border: 1px solid color-mix(in srgb, var(--hx-white) 12%, transparent);
          box-shadow: 0 40px 100px -30px rgba(0,0,0,.9);
          animation: hx-card-border 1s ease 4.1s forwards;
        }
        .hx-card-halo {
          background: linear-gradient(140deg,
            color-mix(in srgb, var(--hx-yellow) 55%, transparent),
            transparent 35%, transparent 65%,
            color-mix(in srgb, var(--hx-yellow) 25%, transparent));
          opacity: .5;
          filter: blur(.5px);
        }
        .hx-card-head { border-bottom: 1px solid color-mix(in srgb, var(--hx-white) 9%, transparent); }
        .hx-win { background: color-mix(in srgb, var(--hx-white) 18%, transparent); }

        .hx-status {
          background: color-mix(in srgb, var(--hx-white) 6%, transparent);
          border: 1px solid color-mix(in srgb, var(--hx-white) 12%, transparent);
          color: color-mix(in srgb, var(--hx-white) 70%, transparent);
          animation: hx-status-bg .6s ease 4.1s forwards;
        }
        .hx-status-dot { background: var(--hx-white); opacity: .6; animation: hx-dot-yellow .1s linear 4.1s forwards; }
        .hx-status-text { animation: hx-hide .1s linear 4.1s forwards; }
        .hx-status-text-done {
          position: absolute; left: 2.15rem;
          opacity: 0;
          color: var(--hx-yellow);
          animation: hx-show .4s ease 4.1s forwards;
        }
        .hx-status { min-width: 112px; }

        /* Terminal lines */
        .hx-prompt { color: var(--hx-yellow); }
        .hx-cmd { color: var(--hx-white); }
        .hx-ok { color: var(--hx-yellow); }
        .hx-step {
          opacity: 0;
          transform: translateY(6px);
          animation: hx-in .45s ease forwards;
          animation-delay: var(--d, 0s);
        }
        .hx-track { background: color-mix(in srgb, var(--hx-white) 9%, transparent); }
        .hx-fill {
          width: 0;
          background: linear-gradient(90deg,
            color-mix(in srgb, var(--hx-yellow) 70%, var(--hx-black)), var(--hx-yellow));
          box-shadow: 0 0 14px color-mix(in srgb, var(--hx-yellow) 70%, transparent);
          animation: hx-bar 3.6s cubic-bezier(.45,.05,.25,1) .4s forwards;
        }
        .hx-final {
          background: color-mix(in srgb, var(--hx-yellow) 8%, transparent);
          border: 1px solid color-mix(in srgb, var(--hx-yellow) 30%, transparent);
          opacity: 0;
          transform: translateY(8px);
          animation: hx-in .6s ease forwards;
          animation-delay: var(--d, 0s);
        }
        .hx-cursor {
          background: var(--hx-yellow);
          animation: hx-blink 1.1s steps(1) infinite;
        }

        /* Stats */
        .hx-stats { border-top: 1px solid color-mix(in srgb, var(--hx-white) 10%, transparent); }
        .hx-stat { border-left: 1px solid color-mix(in srgb, var(--hx-white) 10%, transparent); padding-left: 1.5rem; }
        .hx-stat:first-child { border-left: 0; padding-left: 0; }
        @media (max-width: 767px) {
          .hx-stat:nth-child(odd) { border-left: 0; padding-left: 0; }
          .hx-stat:nth-child(n+3) { border-top: 1px solid color-mix(in srgb, var(--hx-white) 10%, transparent); }
        }

        /* Keyframes */
        @keyframes hx-in { to { opacity: 1; transform: translateY(0); } }
        @keyframes hx-bar { to { width: 100%; } }
        @keyframes hx-blink { 50% { opacity: 0; } }
        @keyframes hx-ping { 75%, 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes hx-pulse { 50% { opacity: .45; } }
        @keyframes hx-hide { to { opacity: 0; } }
        @keyframes hx-show { to { opacity: 1; } }
        @keyframes hx-dot-yellow { to { background: var(--hx-yellow); opacity: 1; box-shadow: 0 0 10px var(--hx-yellow); } }
        @keyframes hx-status-bg {
          to {
            background: color-mix(in srgb, var(--hx-yellow) 12%, transparent);
            border-color: color-mix(in srgb, var(--hx-yellow) 40%, transparent);
          }
        }
        @keyframes hx-card-border {
          to {
            border-color: color-mix(in srgb, var(--hx-yellow) 45%, transparent);
            box-shadow: 0 40px 100px -30px rgba(0,0,0,.9),
                        0 0 80px -20px color-mix(in srgb, var(--hx-yellow) 45%, transparent);
          }
        }

        /* Reduced motion: show the finished state immediately */
        @media (prefers-reduced-motion: reduce) {
          .hx-step, .hx-final, .hx-status, .hx-status-dot,
          .hx-status-text, .hx-status-text-done, .hx-card, .hx-fill {
            animation-duration: .01ms !important;
            animation-delay: 0s !important;
          }
          .hx-ping, .hx-cursor, .hx-skeleton { animation: none !important; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
