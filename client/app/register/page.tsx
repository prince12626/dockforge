"use client";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const STEPS = [
  { n: "01", title: "Create your account", text: "Takes less than a minute." },
  {
    n: "02",
    title: "Pick a plan",
    text: "Start free, upgrade when you need to.",
  },
  {
    n: "03",
    title: "Deploy your first VPS",
    text: "Live in under 60 seconds.",
  },
];

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await authClient.signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      if (error) {
        toast.error(
          error.message || "Unable to create account. Please try again.",
        );
        return;
      }

      toast.success("Account created successfully!");

      router.push("/plans");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const showMatchHint = confirmPassword.length > 0;
  const passwordsMatch = password === confirmPassword;

  return (
    <main className="rg-root relative isolate min-h-[calc(100vh-72px)] overflow-hidden">
      <div className="rg-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="rg-glow pointer-events-none absolute -left-40 top-1/4 -z-10 h-[560px] w-[560px] rounded-full" />

      <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl lg:grid-cols-2">
        {/* ---------- Left: brand panel (desktop only) ---------- */}
        <aside className="hidden flex-col justify-between px-12 py-16 lg:flex">
          <Link href="/" className="rg-focus inline-flex items-center gap-3">
            <span className="rg-logo flex h-10 w-10 items-center justify-center rounded-xl">
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
            <span className="rg-title text-xl font-semibold tracking-tight">
              DockForge
            </span>
          </Link>

          <div>
            <h2 className="rg-title max-w-md text-5xl font-semibold leading-[1.04] tracking-[-0.03em]">
              Start shipping
              <span className="rg-title-dim block">in minutes.</span>
            </h2>

            <ol className="mt-12 max-w-md">
              {STEPS.map((step) => (
                <li key={step.n} className="rg-step flex gap-5 py-5">
                  <span className="rg-step-n font-mono text-sm">{step.n}</span>
                  <div>
                    <p className="rg-title font-medium">{step.title}</p>
                    <p className="rg-muted-2 mt-1 text-sm">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <p className="rg-muted-2 text-sm">Built for developers who ship.</p>
        </aside>

        {/* ---------- Right: form ---------- */}
        <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">
            <div className="rg-card-halo relative rounded-[22px] p-px">
              <div className="rg-card rounded-[21px] p-7 sm:p-9">
                {/* Mobile logo */}
                <Link
                  href="/"
                  className="rg-focus mb-8 inline-flex items-center gap-3 lg:hidden"
                >
                  <span className="rg-logo flex h-9 w-9 items-center justify-center rounded-lg">
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
                  <span className="rg-title text-lg font-semibold tracking-tight">
                    DockForge
                  </span>
                </Link>

                <h1 className="rg-title text-3xl font-semibold tracking-tight">
                  Create your account
                </h1>
                <p className="rg-muted mt-2 text-[15px]">
                  Start managing your VPS infrastructure in minutes.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                  noValidate
                >
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="rg-label mb-2 block text-sm font-medium"
                    >
                      Full name
                    </label>
                    <div className="rg-field relative">
                      <User
                        size={17}
                        className="rg-field-icon pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        className="rg-input h-12 w-full rounded-xl pl-11 pr-4 text-[15px]"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="rg-label mb-2 block text-sm font-medium"
                    >
                      Email
                    </label>
                    <div className="rg-field relative">
                      <Mail
                        size={17}
                        className="rg-field-icon pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
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
                        className="rg-input h-12 w-full rounded-xl pl-11 pr-4 text-[15px]"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="rg-label mb-2 block text-sm font-medium"
                    >
                      Password
                    </label>
                    <div className="rg-field relative">
                      <Lock
                        size={17}
                        className="rg-field-icon pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="rg-input h-12 w-full rounded-xl pl-11 pr-12 text-[15px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={isLoading}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                        className="rg-eye rg-focus absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg"
                      >
                        {showPassword ? (
                          <EyeOff size={18} aria-hidden="true" />
                        ) : (
                          <Eye size={18} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    <p className="rg-muted-2 mt-2 text-xs">
                      Use at least 8 characters.
                    </p>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="rg-label mb-2 block text-sm font-medium"
                    >
                      Confirm password
                    </label>
                    <div className="rg-field relative">
                      <Lock
                        size={17}
                        className="rg-field-icon pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        aria-invalid={showMatchHint && !passwordsMatch}
                        className={`rg-input h-12 w-full rounded-xl pl-11 pr-12 text-[15px] ${
                          showMatchHint && !passwordsMatch ? "rg-input-bad" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        disabled={isLoading}
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        aria-pressed={showConfirmPassword}
                        className="rg-eye rg-focus absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} aria-hidden="true" />
                        ) : (
                          <Eye size={18} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    {showMatchHint && (
                      <p
                        className={`mt-2 text-xs ${
                          passwordsMatch ? "rg-yellow" : "rg-bad"
                        }`}
                        aria-live="polite"
                      >
                        {passwordsMatch
                          ? "Passwords match."
                          : "Passwords do not match."}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rg-btn group relative mt-2 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl text-[15px] font-semibold"
                  >
                    {isLoading && (
                      <Loader2
                        className="relative z-10 size-4 animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">
                      {isLoading ? "Creating account…" : "Create Account"}
                    </span>
                    <span className="rg-shine" aria-hidden="true" />
                  </button>
                </form>

                <div className="rg-divider mt-8 pt-6 text-center">
                  <p className="rg-muted text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="rg-link rg-focus font-semibold"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .rg-root {
          --rg-black: var(--color-black, #08090B);
          --rg-white: var(--color-white, #F5F3EF);
          --rg-yellow: var(--color-yellow, #FFC900);
          --rg-bad: #ff7a7a;
          background: var(--rg-black);
          color: var(--rg-white);
        }
        .rg-grid {
          background-image:
            linear-gradient(to right, color-mix(in srgb, var(--rg-white) 6%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb, var(--rg-white) 6%, transparent) 1px, transparent 1px);
          background-size: 64px 64px;
          -webkit-mask-image: radial-gradient(ellipse 80% 70% at 30% 40%, #000 10%, transparent 75%);
                  mask-image: radial-gradient(ellipse 80% 70% at 30% 40%, #000 10%, transparent 75%);
        }
        .rg-glow {
          background: radial-gradient(circle, color-mix(in srgb, var(--rg-yellow) 16%, transparent) 0%, transparent 65%);
          filter: blur(40px);
        }

        /* Text */
        .rg-title { color: var(--rg-white); }
        .rg-title-dim { color: color-mix(in srgb, var(--rg-white) 48%, transparent); }
        .rg-muted { color: color-mix(in srgb, var(--rg-white) 60%, transparent); }
        .rg-muted-2 { color: color-mix(in srgb, var(--rg-white) 42%, transparent); }
        .rg-label { color: color-mix(in srgb, var(--rg-white) 82%, transparent); }
        .rg-yellow { color: var(--rg-yellow); }
        .rg-bad { color: var(--rg-bad); }

        .rg-focus:focus-visible {
          outline: 2px solid var(--rg-yellow);
          outline-offset: 3px;
          border-radius: 8px;
        }

        .rg-logo {
          color: var(--rg-black);
          background: var(--rg-yellow);
          box-shadow: 0 0 28px -4px color-mix(in srgb, var(--rg-yellow) 60%, transparent);
        }

        /* Steps (left panel) */
        .rg-step { border-top: 1px solid color-mix(in srgb, var(--rg-white) 10%, transparent); }
        .rg-step:last-child { border-bottom: 1px solid color-mix(in srgb, var(--rg-white) 10%, transparent); }
        .rg-step-n { color: var(--rg-yellow); padding-top: 2px; }

        /* Card */
        .rg-card-halo {
          background: linear-gradient(145deg,
            color-mix(in srgb, var(--rg-yellow) 45%, transparent),
            color-mix(in srgb, var(--rg-white) 10%, transparent) 30%,
            color-mix(in srgb, var(--rg-white) 6%, transparent) 70%,
            color-mix(in srgb, var(--rg-yellow) 22%, transparent));
          box-shadow: 0 40px 100px -30px rgba(0,0,0,.9);
        }
        .rg-card {
          background: linear-gradient(180deg,
            color-mix(in srgb, var(--rg-white) 5%, var(--rg-black)) 0%,
            color-mix(in srgb, var(--rg-white) 2%, var(--rg-black)) 100%);
        }

        /* Inputs */
        .rg-field-icon {
          color: color-mix(in srgb, var(--rg-white) 38%, transparent);
          transition: color .2s ease;
        }
        .rg-field:focus-within .rg-field-icon { color: var(--rg-yellow); }
        .rg-input {
          color: var(--rg-white);
          background: color-mix(in srgb, var(--rg-black) 75%, transparent);
          border: 1px solid color-mix(in srgb, var(--rg-white) 12%, transparent);
          outline: none;
          transition: border-color .2s ease, box-shadow .2s ease;
        }
        .rg-input::placeholder { color: color-mix(in srgb, var(--rg-white) 30%, transparent); }
        .rg-input:hover:not(:disabled) { border-color: color-mix(in srgb, var(--rg-white) 24%, transparent); }
        .rg-input:focus {
          border-color: var(--rg-yellow);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--rg-yellow) 16%, transparent);
        }
        .rg-input-bad,
        .rg-input-bad:hover:not(:disabled),
        .rg-input-bad:focus {
          border-color: var(--rg-bad);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--rg-bad) 14%, transparent);
        }
        .rg-input:disabled { opacity: .6; cursor: not-allowed; }
        .rg-input:-webkit-autofill {
          -webkit-text-fill-color: var(--rg-white);
          -webkit-box-shadow: 0 0 0 1000px var(--rg-black) inset;
          caret-color: var(--rg-white);
        }

        .rg-eye {
          color: color-mix(in srgb, var(--rg-white) 45%, transparent);
          transition: color .2s ease, background .2s ease;
        }
        .rg-eye:hover:not(:disabled) {
          color: var(--rg-white);
          background: color-mix(in srgb, var(--rg-white) 8%, transparent);
        }
        .rg-eye:disabled { cursor: not-allowed; }

        /* Submit */
        .rg-btn {
          background: var(--rg-yellow);
          color: var(--rg-black);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--rg-yellow) 60%, transparent),
            0 10px 40px -10px color-mix(in srgb, var(--rg-yellow) 70%, transparent);
          transition: transform .25s ease, box-shadow .25s ease, opacity .2s ease;
        }
        .rg-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 0 0 1px var(--rg-yellow),
            0 18px 55px -8px color-mix(in srgb, var(--rg-yellow) 85%, transparent);
        }
        .rg-btn:disabled { opacity: .7; cursor: not-allowed; }
        .rg-btn:focus-visible { outline: 2px solid var(--rg-white); outline-offset: 3px; }
        .rg-shine {
          position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.55) 50%, transparent 70%);
          transform: translateX(-120%);
        }
        .rg-btn:hover:not(:disabled) .rg-shine { transform: translateX(120%); transition: transform .8s ease; }

        .rg-divider { border-top: 1px solid color-mix(in srgb, var(--rg-white) 9%, transparent); }
        .rg-link { color: var(--rg-yellow); }
        .rg-link:hover { text-decoration: underline; text-underline-offset: 4px; }

        @media (prefers-reduced-motion: reduce) {
          .rg-btn, .rg-input, .rg-eye, .rg-field-icon, .rg-shine { transition: none; }
          .rg-btn:hover:not(:disabled) { transform: none; }
          .animate-spin { animation-duration: 1.5s; }
        }
      `}</style>
    </main>
  );
}
