import Link from "next/link";

type FooterLink = { label: string; href: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Live Demo", href: "/demo" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API reference", href: "/docs/api" },
      { label: "Changelog", href: "/changelog" },
      { label: "System status", href: "/status" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="ft-root relative isolate overflow-hidden">
      <div className="ft-glow pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* ---------- CTA band ---------- */}
        <div className="flex flex-col items-start justify-between gap-8 py-20 md:flex-row md:items-center md:py-24">
          <h2 className="ft-title max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-5xl">
            Your next server is
            <span className="ft-title-dim block">a minute away.</span>
          </h2>

          <Link
            href="/register"
            className="ft-btn group relative inline-flex h-[52px] shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl px-8 text-base font-semibold"
          >
            <span className="relative z-10">Create Account</span>
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
            <span className="ft-shine" aria-hidden="true" />
          </Link>
        </div>

        {/* ---------- Links ---------- */}
        <div className="ft-rule grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
          <div className="max-w-xs">
            <Link
              href="/"
              className="ft-title ft-focus inline-flex items-center gap-2.5 text-xl font-semibold tracking-tight"
            >
              <span className="ft-logo flex h-8 w-8 items-center justify-center rounded-lg">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
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
              DockForge
            </Link>
            <p className="ft-muted mt-5 text-[15px] leading-7">
              VPS hosting built around Docker. Deploy, manage and monitor your
              servers from one clean dashboard.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="ft-title text-sm font-semibold">{col.title}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="ft-link ft-focus text-[15px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ---------- Bottom bar ---------- */}
        <div className="ft-rule flex flex-col gap-3 py-7 text-sm md:flex-row md:items-center md:justify-between">
          <p className="ft-muted-2">© {year} DockForge. All rights reserved.</p>
          <p className="ft-muted-2">Built for developers who ship.</p>
        </div>
      </div>

      {/* ---------- Oversized wordmark ---------- */}
      <div
        className="ft-wordmark pointer-events-none select-none text-center font-semibold leading-[0.8] tracking-[-0.05em]"
        aria-hidden="true"
      >
        DockForge
      </div>

      <style>{`
        .ft-root {
          --ft-black: var(--color-black, #08090B);
          --ft-white: var(--color-white, #F5F3EF);
          --ft-yellow: var(--color-yellow, #FFC900);
          background: var(--ft-black);
          color: var(--ft-white);
        }
        .ft-glow {
          background: radial-gradient(ellipse, color-mix(in srgb, var(--ft-yellow) 14%, transparent) 0%, transparent 70%);
          filter: blur(40px);
        }

        /* Text */
        .ft-title { color: var(--ft-white); }
        .ft-title-dim { color: color-mix(in srgb, var(--ft-white) 48%, transparent); }
        .ft-muted { color: color-mix(in srgb, var(--ft-white) 62%, transparent); }
        .ft-muted-2 { color: color-mix(in srgb, var(--ft-white) 45%, transparent); }

        .ft-rule { border-top: 1px solid color-mix(in srgb, var(--ft-white) 10%, transparent); }

        /* Links */
        .ft-link {
          color: color-mix(in srgb, var(--ft-white) 58%, transparent);
          transition: color .2s ease, padding-left .25s ease;
        }
        .ft-link:hover {
          color: var(--ft-yellow);
          padding-left: 4px;
        }
        .ft-focus:focus-visible {
          outline: 2px solid var(--ft-yellow);
          outline-offset: 4px;
          border-radius: 6px;
        }

        /* Logo */
        .ft-logo {
          color: var(--ft-black);
          background: var(--ft-yellow);
          box-shadow: 0 0 24px -4px color-mix(in srgb, var(--ft-yellow) 65%, transparent);
        }

        /* CTA button (same as Hero) */
        .ft-btn {
          background: var(--ft-yellow);
          color: var(--ft-black);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--ft-yellow) 60%, transparent),
            0 10px 40px -10px color-mix(in srgb, var(--ft-yellow) 70%, transparent);
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .ft-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 0 0 1px var(--ft-yellow),
            0 18px 55px -8px color-mix(in srgb, var(--ft-yellow) 85%, transparent);
        }
        .ft-btn:focus-visible {
          outline: 2px solid var(--ft-white);
          outline-offset: 3px;
        }
        .ft-shine {
          position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.55) 50%, transparent 70%);
          transform: translateX(-120%);
        }
        .ft-btn:hover .ft-shine { transform: translateX(120%); transition: transform .8s ease; }

        /* Giant wordmark, fades out toward the bottom edge */
        .ft-wordmark {
          font-size: clamp(4.5rem, 21vw, 20rem);
          margin-top: 1.5rem;
          margin-bottom: -0.12em;
          background: linear-gradient(180deg,
            color-mix(in srgb, var(--ft-white) 20%, transparent) 0%,
            color-mix(in srgb, var(--ft-yellow) 6%, transparent) 55%,
            transparent 92%);
          -webkit-background-clip: text;
                  background-clip: text;
          color: transparent;
        }

        @media (prefers-reduced-motion: reduce) {
          .ft-btn, .ft-link, .ft-shine { transition: none; }
          .ft-btn:hover { transform: none; }
          .ft-link:hover { padding-left: 0; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
