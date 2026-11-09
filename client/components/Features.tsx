"use client";

import type { MouseEvent, ReactNode } from "react";
import {
  Terminal,
  Boxes,
  ShieldCheck,
  Gauge,
  Network,
  Rocket,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  featured?: boolean;
  visual?: "deploy" | "terminal";
};

const features: Feature[] = [
  {
    icon: Rocket,
    title: "60-second deployment",
    description:
      "Spin up a fresh VPS instance with your stack pre-configured. No manual setup, no waiting around.",
    featured: true,
    visual: "deploy",
  },
  {
    icon: Terminal,
    title: "Full web terminal",
    description:
      "Real SSH-grade shell access straight from the browser, powered by a native exec bridge, no plugins needed.",
    featured: true,
    visual: "terminal",
  },
  {
    icon: Boxes,
    title: "Docker-native",
    description:
      "Every instance runs on Docker under the hood. Pull images, manage containers, and ship without leaving the dashboard.",
  },
  {
    icon: Gauge,
    title: "Real-time monitoring",
    description:
      "Live CPU, memory, and network graphs so you know exactly how your server is performing, at every moment.",
  },
  {
    icon: Network,
    title: "Instant networking",
    description:
      "Firewalls, custom domains, and reverse proxy routing configured with a few clicks, no YAML required.",
  },
  {
    icon: ShieldCheck,
    title: "Isolated & secure",
    description:
      "Every container runs sandboxed with resource limits, keeping your workloads isolated from everyone else's.",
  },
];

/* ---------- Small visuals for the two featured cards ---------- */

const DEPLOY_STEPS = ["Allocate", "Network", "Docker", "Live"];

const DeployVisual = () => (
  <div className="fx-visual mt-8 rounded-xl px-5 py-6">
    <ol className="flex items-start justify-between">
      {DEPLOY_STEPS.map((step, i) => {
        const last = i === DEPLOY_STEPS.length - 1;
        return (
          <li key={step} className="relative flex flex-1 flex-col items-center">
            {!last && <span className="fx-step-line" aria-hidden="true" />}
            <span
              className={`fx-step-dot relative z-10 flex h-7 w-7 items-center justify-center rounded-full ${
                last ? "fx-step-dot-live" : ""
              }`}
            >
              {last ? (
                <span className="fx-step-core h-2.5 w-2.5 rounded-full" />
              ) : (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                  <path
                    d="m3.5 8.5 3 3 6-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span
              className={`mt-3 text-xs md:text-sm ${
                last ? "fx-title" : "fx-muted-2"
              }`}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  </div>
);

const TerminalVisual = () => (
  <div className="fx-visual mt-8 rounded-xl px-5 py-5 font-mono text-[13px] leading-7">
    <div>
      <span className="fx-yellow">$</span>{" "}
      <span className="fx-title">docker ps</span>
    </div>
    <div className="fx-muted-2">api-server&nbsp;&nbsp;&nbsp;Up 3 hours</div>
    <div className="fx-muted-2">
      postgres&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Up 3 hours
    </div>
    <div>
      <span className="fx-yellow">$</span>
      <span className="fx-cursor ml-2 inline-block h-4 w-[7px] align-middle" />
    </div>
  </div>
);

/* ---------- Card with cursor spotlight ---------- */

const Card = ({
  feature,
  children,
}: {
  feature: Feature;
  children?: ReactNode;
}) => {
  const Icon = feature.icon;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      onMouseMove={onMove}
      className={`fx-card group relative overflow-hidden rounded-2xl p-8 md:p-9 ${
        feature.featured ? "md:col-span-2 lg:col-span-6" : "lg:col-span-3"
      }`}
    >
      <span className="fx-spot pointer-events-none absolute inset-0" />

      <div className="relative">
        <div className="fx-icon flex h-12 w-12 items-center justify-center rounded-xl">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>

        <h3 className="fx-title mt-7 text-xl font-semibold tracking-tight md:text-[1.35rem]">
          {feature.title}
        </h3>
        <p className="fx-muted mt-3 max-w-md text-[15px] leading-7">
          {feature.description}
        </p>

        {children}
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section className="fx-root relative isolate overflow-hidden py-24 md:py-32">
      <div className="fx-glow pointer-events-none absolute -left-40 top-0 -z-10 h-[520px] w-[520px] rounded-full" />

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="max-w-3xl">
          <h2 className="fx-title text-4xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-5xl lg:text-6xl">
            Everything you need to ship,
            <span className="fx-title-dim block">nothing you don&apos;t.</span>
          </h2>
          <p className="fx-muted mt-6 max-w-xl text-lg leading-8">
            A hosting platform built around Docker, made for developers who just
            want their containers running fast.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
          {features.map((feature) => (
            <Card key={feature.title} feature={feature}>
              {feature.visual === "deploy" && <DeployVisual />}
              {feature.visual === "terminal" && <TerminalVisual />}
            </Card>
          ))}
        </div>
      </div>

      <style>{`
        .fx-root {
          --fx-black: var(--color-black, #08090B);
          --fx-white: var(--color-white, #F5F3EF);
          --fx-yellow: var(--color-yellow, #FFC900);
          background: var(--fx-black);
          color: var(--fx-white);
          border-bottom: 1px solid color-mix(in srgb, var(--fx-white) 10%, transparent);
        }
        .fx-glow {
          background: radial-gradient(circle, color-mix(in srgb, var(--fx-yellow) 10%, transparent) 0%, transparent 70%);
          filter: blur(40px);
        }

        /* Text */
        .fx-title { color: var(--fx-white); }
        .fx-title-dim { color: color-mix(in srgb, var(--fx-white) 48%, transparent); }
        .fx-muted { color: color-mix(in srgb, var(--fx-white) 62%, transparent); }
        .fx-muted-2 { color: color-mix(in srgb, var(--fx-white) 45%, transparent); }
        .fx-yellow { color: var(--fx-yellow); }

        /* Card */
        .fx-card {
          --mx: 50%;
          --my: 0%;
          background: color-mix(in srgb, var(--fx-white) 3%, var(--fx-black));
          border: 1px solid color-mix(in srgb, var(--fx-white) 10%, transparent);
          transition: border-color .35s ease, transform .35s ease;
        }
        .fx-card:hover {
          border-color: color-mix(in srgb, var(--fx-yellow) 38%, transparent);
          transform: translateY(-3px);
        }
        .fx-spot {
          opacity: 0;
          transition: opacity .35s ease;
          background: radial-gradient(
            420px circle at var(--mx) var(--my),
            color-mix(in srgb, var(--fx-yellow) 13%, transparent),
            transparent 65%
          );
        }
        .fx-card:hover .fx-spot { opacity: 1; }

        /* Icon */
        .fx-icon {
          color: color-mix(in srgb, var(--fx-white) 75%, transparent);
          background: color-mix(in srgb, var(--fx-white) 5%, transparent);
          border: 1px solid color-mix(in srgb, var(--fx-white) 12%, transparent);
          transition: color .3s ease, background .3s ease, border-color .3s ease, box-shadow .3s ease;
        }
        .fx-card:hover .fx-icon {
          color: var(--fx-black);
          background: var(--fx-yellow);
          border-color: var(--fx-yellow);
          box-shadow: 0 0 28px -4px color-mix(in srgb, var(--fx-yellow) 70%, transparent);
        }

        /* Visual blocks */
        .fx-visual {
          background: color-mix(in srgb, var(--fx-black) 70%, transparent);
          border: 1px solid color-mix(in srgb, var(--fx-white) 9%, transparent);
        }
        .fx-step-line {
          position: absolute;
          top: 13px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: color-mix(in srgb, var(--fx-yellow) 55%, transparent);
        }
        .fx-step-dot {
          color: var(--fx-black);
          background: var(--fx-yellow);
        }
        .fx-step-dot-live {
          background: color-mix(in srgb, var(--fx-yellow) 16%, var(--fx-black));
          border: 1px solid var(--fx-yellow);
          box-shadow: 0 0 22px -2px color-mix(in srgb, var(--fx-yellow) 65%, transparent);
        }
        .fx-step-core {
          background: var(--fx-yellow);
          animation: fx-pulse 1.8s ease-in-out infinite;
        }
        .fx-cursor {
          background: var(--fx-yellow);
          animation: fx-blink 1.1s steps(1) infinite;
        }

        @keyframes fx-blink { 50% { opacity: 0; } }
        @keyframes fx-pulse { 50% { transform: scale(.6); opacity: .6; } }

        @media (prefers-reduced-motion: reduce) {
          .fx-card, .fx-icon, .fx-spot { transition: none; }
          .fx-card:hover { transform: none; }
          .fx-step-core, .fx-cursor { animation: none; }
        }
      `}</style>
    </section>
  );
};

export default Features;
