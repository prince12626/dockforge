import type { ReactNode } from "react";
import { BookOpen, Bug, LifeBuoy, Mail, MessageCircle } from "lucide-react";
import { Bricolage_Grotesque, Manrope } from "next/font/google";

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

/*
  Fill these in. Anything left as "" is shown as a disabled item
  instead of a broken link.
*/
const LINKS = {
  docs: "",
  community: "",
  bugs: "",
  email: "",
  github: "",
  website: "https://princechaurasiya.in",
  dockerHub: "https://hub.docker.com/r/devprincechaurasiya/dockforge-server",
};

const stack = [
  "Next.js",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "Docker",
  "Dockerode",
  "Socket.io",
  "xterm.js",
  "Better Auth",
];

const faqs = [
  {
    q: "How do I create a VPS?",
    a: "Navigate to Create VPS and complete the configuration form.",
  },
  {
    q: "Can I upgrade later?",
    a: "Yes. Plans can be upgraded anytime after billing becomes available.",
  },
  {
    q: "Where can I access the terminal?",
    a: "Open a VPS from the dashboard and launch the integrated browser terminal.",
  },
];

function GithubGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 015.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function isExternal(href: string) {
  return href.startsWith("http");
}

function LinkButton({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  const cls = `${primary ? "db-btn-primary" : "db-btn-ghost"} inline-flex h-11 items-center justify-center gap-2.5 rounded-xl px-6 text-sm font-semibold`;

  if (!href) {
    return (
      <button type="button" disabled className={cls}>
        {children}
      </button>
    );
  }

  return (
    <a
      href={href}
      className={cls}
      {...(isExternal(href) ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export default function SupportPage() {
  return (
    <main
      className={`${display.variable} ${body.variable} db-root relative isolate min-h-screen overflow-hidden`}
    >
      <div className="db-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="db-glow pointer-events-none absolute -right-40 -top-48 -z-10 h-[560px] w-[560px] rounded-full" />
      <div className="db-grain pointer-events-none fixed inset-0 z-50" />

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        {/* ---------- Header ---------- */}
        <header className="flex items-center gap-4">
          <div className="db-mark flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
            <LifeBuoy size={24} />
          </div>
          <div>
            <h1 className="db-display db-title text-3xl font-semibold md:text-4xl">
              Support
            </h1>
            <p className="db-muted mt-1 text-sm md:text-base">
              Need help? Find documentation, report bugs or contact us.
            </p>
          </div>
        </header>

        {/* ---------- Quick links ---------- */}
        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-5 xl:grid-cols-4">
          <Card
            icon={<BookOpen size={22} />}
            title="Documentation"
            desc="Learn how DockForge works."
            href={LINKS.docs}
          />

          <Card
            icon={<MessageCircle size={22} />}
            title="Community"
            desc="Join discussions with other users."
            href={LINKS.community}
          />

          <Card
            icon={<Bug size={22} />}
            title="Report Bug"
            desc="Found an issue? Let us know."
            href={LINKS.bugs}
          />

          <Card
            icon={<Mail size={22} />}
            title="Contact"
            desc="Reach out for assistance."
            href={LINKS.email ? `mailto:${LINKS.email}` : ""}
          />
        </div>

        {/* ---------- FAQ ---------- */}
        <div className="mt-14">
          <h2 className="db-display db-title text-xl font-semibold md:text-2xl">
            Frequently Asked Questions
          </h2>

          <div className="db-table mt-5 overflow-hidden rounded-2xl">
            {faqs.map((item, i) => (
              <details
                key={item.q}
                className="db-faq db-row group"
                open={i === 0}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-6 px-5 py-5 md:px-7">
                  <span className="db-display db-title text-lg font-semibold">
                    {item.q}
                  </span>
                  <span
                    className="db-plus relative h-8 w-8 shrink-0 rounded-full"
                    aria-hidden="true"
                  >
                    <span className="db-plus-h" />
                    <span className="db-plus-v" />
                  </span>
                </summary>

                <p className="db-muted max-w-2xl px-5 pb-6 text-sm leading-6 md:px-7 md:text-base">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* ---------- Built by ---------- */}
        <div className="db-fleet mt-14 rounded-3xl p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-10">
            <div
              className="db-mark db-display flex h-[72px] w-[72px] items-center justify-center rounded-full text-2xl font-semibold"
              aria-hidden="true"
            >
              PC
            </div>

            <div className="min-w-0">
              <p className="db-muted text-sm">Built by</p>
              <h2 className="db-display db-title mt-1 text-3xl font-semibold md:text-4xl">
                Prince Chaurasiya
              </h2>
              <p className="db-muted-2 mt-1 text-sm">
                Solo developer and student
              </p>

              <p className="db-muted mt-5 max-w-2xl text-sm leading-6 md:text-base md:leading-7">
                DockForge is built and maintained by one person. I build
                production-grade full-stack and infrastructure projects, and I
                run DockForge on my own self-hosted homelab, so when you write
                to support you are talking to the person who wrote the code.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {stack.map((item) => (
                  <span
                    key={item}
                    className="db-chip rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href={LINKS.website} primary>
                  princechaurasiya.in
                </LinkButton>
                <LinkButton href={LINKS.dockerHub}>Docker Hub</LinkButton>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Open source ---------- */}
        <div className="db-card mt-6 flex flex-col gap-6 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <div>
            <h2 className="db-display db-title text-xl font-semibold md:text-2xl">
              Open Source
            </h2>

            <p className="db-muted mt-2 text-sm md:text-base">
              Follow development and report issues on GitHub.
            </p>
          </div>

          <LinkButton href={LINKS.github}>
            <GithubGlyph />
            GitHub
          </LinkButton>
        </div>
      </section>

      <style>{`
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

        /* Quick link cards */
        .db-link-card {
          display: block;
          transition: border-color .25s ease, background .25s ease, box-shadow .25s ease;
        }
        a.db-link-card:hover {
          border-color: color-mix(in srgb, var(--db-yellow) 45%, transparent);
          background: color-mix(in srgb, var(--db-yellow) 4%, color-mix(in srgb, var(--db-white) 3%, var(--db-black)));
          box-shadow: 0 30px 60px -40px color-mix(in srgb, var(--db-yellow) 45%, transparent);
        }
        a.db-link-card:focus-visible {
          outline: 2px solid var(--db-yellow);
          outline-offset: 2px;
        }
        .db-node {
          color: var(--db-yellow);
          background: color-mix(in srgb, var(--db-yellow) 9%, transparent);
          border: 1px solid color-mix(in srgb, var(--db-yellow) 30%, transparent);
        }

        /* FAQ */
        .db-faq summary { list-style: none; }
        .db-faq summary::-webkit-details-marker { display: none; }
        .db-faq summary:focus-visible {
          outline: 2px solid var(--db-yellow);
          outline-offset: -2px;
        }
        .db-faq[open] { background: color-mix(in srgb, var(--db-yellow) 3%, transparent); }
        .db-plus {
          border: 1px solid color-mix(in srgb, var(--db-white) 16%, transparent);
          background: color-mix(in srgb, var(--db-white) 4%, transparent);
          transition: border-color .2s ease, background .2s ease;
        }
        .db-plus-h, .db-plus-v {
          position: absolute;
          left: 50%;
          top: 50%;
          background: var(--db-white);
          border-radius: 2px;
          transition: transform .25s ease, background .2s ease, opacity .2s ease;
        }
        .db-plus-h { width: 12px; height: 2px; transform: translate(-50%, -50%); }
        .db-plus-v { width: 2px; height: 12px; transform: translate(-50%, -50%); }
        .db-faq:hover .db-plus { border-color: color-mix(in srgb, var(--db-yellow) 45%, transparent); }
        .db-faq[open] .db-plus {
          background: var(--db-yellow);
          border-color: var(--db-yellow);
        }
        .db-faq[open] .db-plus-h { background: var(--db-black); }
        .db-faq[open] .db-plus-v { background: var(--db-black); transform: translate(-50%, -50%) rotate(90deg); }

        /* Chips */
        .db-chip {
          color: color-mix(in srgb, var(--db-white) 75%, transparent);
          background: color-mix(in srgb, var(--db-white) 5%, transparent);
          border: 1px solid color-mix(in srgb, var(--db-white) 12%, transparent);
        }

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

        @media (prefers-reduced-motion: reduce) {
          .db-btn-primary, .db-btn-ghost, .db-link-card, .db-plus, .db-plus-h, .db-plus-v { transition: none; }
          .db-btn-primary:hover:not(:disabled) { transform: none; }
        }
      `}</style>
    </main>
  );
}

function Card({
  icon,
  title,
  desc,
  href,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="db-node mb-6 inline-flex rounded-xl p-3">{icon}</div>

      <h3 className="db-display db-title text-xl font-semibold">{title}</h3>

      <p className="db-muted mt-2 text-sm leading-6">{desc}</p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="db-card db-link-card rounded-2xl p-6"
        {...(isExternal(href) ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return <div className="db-card db-link-card rounded-2xl p-6">{content}</div>;
}
