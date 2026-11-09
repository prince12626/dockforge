"use client";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const PERKS = [
  { value: "60s", label: "Deployment" },
  { value: "Root", label: "Instant access" },
  { value: "24/7", label: "Monitoring" },
];

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await authClient.signIn.email({
        email: trimmedEmail,
        password,
      });

      if (error) {
        toast.error(error.message || "Unable to sign in. Please try again.");
        return;
      }

      toast.success("Logged in successfully!");

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="lg-root relative isolate min-h-[calc(100vh-72px)] overflow-hidden">
      <div className="lg-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="lg-glow pointer-events-none absolute -left-40 top-1/4 -z-10 h-[560px] w-[560px] rounded-full" />

      <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl lg:grid-cols-2">
        {/* ---------- Left: brand panel (desktop only) ---------- */}
        <aside className="hidden flex-col justify-between px-12 py-16 lg:flex">
          <Link href="/" className="lg-focus inline-flex items-center gap-3">
            <span className="lg-logo flex h-10 w-10 items-center justify-center rounded-xl">
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
            <span className="lg-title text-xl font-semibold tracking-tight">
              DockForge
            </span>
          </Link>

          <div>
            <h2 className="lg-title max-w-md text-5xl font-semibold leading-[1.04] tracking-[-0.03em]">
              Your servers
              <span className="lg-title-dim block">are waiting.</span>
            </h2>
            <p className="lg-muted mt-6 max-w-sm text-lg leading-8">
              Sign in to deploy, manage and monitor your VPS from one clean
              dashboard.
            </p>
          </div>

          <div className="lg-perks grid max-w-md grid-cols-3">
            {PERKS.map((perk) => (
              <div key={perk.label} className="lg-perk py-5">
                <div className="lg-title text-2xl font-semibold tracking-tight">
                  {perk.value}
                </div>
                <div className="lg-muted-2 mt-1 text-sm">{perk.label}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* ---------- Right: form ---------- */}
        <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">
            <div className="lg-card-halo relative rounded-[22px] p-px">
              <div className="lg-card rounded-[21px] p-7 sm:p-9">
                {/* Mobile logo */}
                <Link
                  href="/"
                  className="lg-focus mb-8 inline-flex items-center gap-3 lg:hidden"
                >
                  <span className="lg-logo flex h-9 w-9 items-center justify-center rounded-lg">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[18px] w-[18px]"
                      fill="none"
                    >
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
                  <span className="lg-title text-lg font-semibold tracking-tight">
                    DockForge
                  </span>
                </Link>

                <h1 className="lg-title text-3xl font-semibold tracking-tight">
                  Welcome back
                </h1>
                <p className="lg-muted mt-2 text-[15px]">
                  Sign in to continue managing your VPS.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                  noValidate
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="lg-label mb-2 block text-sm font-medium"
                    >
                      Email
                    </label>
                    <div className="lg-field relative">
                      <Mail
                        size={17}
                        className="lg-field-icon pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="lg-input h-12 w-full rounded-xl pl-11 pr-4 text-[15px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="lg-label mb-2 block text-sm font-medium"
                    >
                      Password
                    </label>
                    <div className="lg-field relative">
                      <Lock
                        size={17}
                        className="lg-field-icon pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="lg-input h-12 w-full rounded-xl pl-11 pr-12 text-[15px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={isLoading}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                        className="lg-eye lg-focus absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg"
                      >
                        {showPassword ? (
                          <EyeOff size={18} aria-hidden="true" />
                        ) : (
                          <Eye size={18} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="lg-btn group relative mt-2 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl text-[15px] font-semibold"
                  >
                    {isLoading && (
                      <Loader2
                        className="relative z-10 size-4 animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">
                      {isLoading ? "Signing in…" : "Sign in"}
                    </span>
                    <span className="lg-shine" aria-hidden="true" />
                  </button>
                </form>

                <div className="lg-divider mt-8 pt-6 text-center">
                  <p className="lg-muted text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="lg-link lg-focus font-semibold"
                    >
                      Create account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .lg-root {
          --lg-black: var(--color-black, #08090B);
          --lg-white: var(--color-white, #F5F3EF);
          --lg-yellow: var(--color-yellow, #FFC900);
          background: var(--lg-black);
          color: var(--lg-white);
        }
        .lg-grid {
          background-image:
            linear-gradient(to right, color-mix(in srgb, var(--lg-white) 6%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb, var(--lg-white) 6%, transparent) 1px, transparent 1px);
          background-size: 64px 64px;
          -webkit-mask-image: radial-gradient(ellipse 80% 70% at 30% 40%, #000 10%, transparent 75%);
                  mask-image: radial-gradient(ellipse 80% 70% at 30% 40%, #000 10%, transparent 75%);
        }
        .lg-glow {
          background: radial-gradient(circle, color-mix(in srgb, var(--lg-yellow) 16%, transparent) 0%, transparent 65%);
          filter: blur(40px);
        }

        /* Text */
        .lg-title { color: var(--lg-white); }
        .lg-title-dim { color: color-mix(in srgb, var(--lg-white) 48%, transparent); }
        .lg-muted { color: color-mix(in srgb, var(--lg-white) 60%, transparent); }
        .lg-muted-2 { color: color-mix(in srgb, var(--lg-white) 42%, transparent); }
        .lg-label { color: color-mix(in srgb, var(--lg-white) 82%, transparent); }

        .lg-focus:focus-visible {
          outline: 2px solid var(--lg-yellow);
          outline-offset: 3px;
          border-radius: 8px;
        }

        .lg-logo {
          color: var(--lg-black);
          background: var(--lg-yellow);
          box-shadow: 0 0 28px -4px color-mix(in srgb, var(--lg-yellow) 60%, transparent);
        }

        /* Perks strip */
        .lg-perks { border-top: 1px solid color-mix(in srgb, var(--lg-white) 10%, transparent); }
        .lg-perk { border-left: 1px solid color-mix(in srgb, var(--lg-white) 10%, transparent); padding-left: 1.25rem; }
        .lg-perk:first-child { border-left: 0; padding-left: 0; }

        /* Card */
        .lg-card-halo {
          background: linear-gradient(145deg,
            color-mix(in srgb, var(--lg-yellow) 45%, transparent),
            color-mix(in srgb, var(--lg-white) 10%, transparent) 30%,
            color-mix(in srgb, var(--lg-white) 6%, transparent) 70%,
            color-mix(in srgb, var(--lg-yellow) 22%, transparent));
          box-shadow: 0 40px 100px -30px rgba(0,0,0,.9);
        }
        .lg-card {
          background: linear-gradient(180deg,
            color-mix(in srgb, var(--lg-white) 5%, var(--lg-black)) 0%,
            color-mix(in srgb, var(--lg-white) 2%, var(--lg-black)) 100%);
        }

        /* Inputs */
        .lg-field-icon {
          color: color-mix(in srgb, var(--lg-white) 38%, transparent);
          transition: color .2s ease;
        }
        .lg-field:focus-within .lg-field-icon { color: var(--lg-yellow); }
        .lg-input {
          color: var(--lg-white);
          background: color-mix(in srgb, var(--lg-black) 75%, transparent);
          border: 1px solid color-mix(in srgb, var(--lg-white) 12%, transparent);
          outline: none;
          transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
        }
        .lg-input::placeholder { color: color-mix(in srgb, var(--lg-white) 30%, transparent); }
        .lg-input:hover:not(:disabled) { border-color: color-mix(in srgb, var(--lg-white) 24%, transparent); }
        .lg-input:focus {
          border-color: var(--lg-yellow);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--lg-yellow) 16%, transparent);
        }
        .lg-input:disabled { opacity: .6; cursor: not-allowed; }
        .lg-input:-webkit-autofill {
          -webkit-text-fill-color: var(--lg-white);
          -webkit-box-shadow: 0 0 0 1000px var(--lg-black) inset;
          caret-color: var(--lg-white);
        }

        .lg-eye {
          color: color-mix(in srgb, var(--lg-white) 45%, transparent);
          transition: color .2s ease, background .2s ease;
        }
        .lg-eye:hover:not(:disabled) {
          color: var(--lg-white);
          background: color-mix(in srgb, var(--lg-white) 8%, transparent);
        }
        .lg-eye:disabled { cursor: not-allowed; }

        /* Submit */
        .lg-btn {
          background: var(--lg-yellow);
          color: var(--lg-black);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--lg-yellow) 60%, transparent),
            0 10px 40px -10px color-mix(in srgb, var(--lg-yellow) 70%, transparent);
          transition: transform .25s ease, box-shadow .25s ease, opacity .2s ease;
        }
        .lg-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 0 0 1px var(--lg-yellow),
            0 18px 55px -8px color-mix(in srgb, var(--lg-yellow) 85%, transparent);
        }
        .lg-btn:disabled { opacity: .7; cursor: not-allowed; }
        .lg-btn:focus-visible { outline: 2px solid var(--lg-white); outline-offset: 3px; }
        .lg-shine {
          position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.55) 50%, transparent 70%);
          transform: translateX(-120%);
        }
        .lg-btn:hover:not(:disabled) .lg-shine { transform: translateX(120%); transition: transform .8s ease; }

        .lg-divider { border-top: 1px solid color-mix(in srgb, var(--lg-white) 9%, transparent); }
        .lg-link { color: var(--lg-yellow); transition: opacity .2s ease; }
        .lg-link:hover { text-decoration: underline; text-underline-offset: 4px; }

        @media (prefers-reduced-motion: reduce) {
          .lg-btn, .lg-input, .lg-eye, .lg-field-icon, .lg-shine { transition: none; }
          .lg-btn:hover:not(:disabled) { transform: none; }
          .animate-spin { animation-duration: 1.5s; }
        }
      `}</style>
    </main>
  );
}
