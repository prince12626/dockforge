"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import Image from "next/image";
import { Bricolage_Grotesque, Manrope } from "next/font/google";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createVps } from "@/features/vps/vps.thunk";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

const osOptions = [
  {
    id: "ubuntu-24",
    name: "Ubuntu 24.04",
    logo: "https://brandslogos.com/wp-content/uploads/images/large/ubuntu-logo.png",
  },
  {
    id: "ubuntu-22",
    name: "Ubuntu 22.04",
    logo: "https://brandslogos.com/wp-content/uploads/images/large/ubuntu-logo.png",
  },
  {
    id: "ubuntu-20",
    name: "Ubuntu 20.04",
    logo: "https://brandslogos.com/wp-content/uploads/images/large/ubuntu-logo.png",
  },
  {
    id: "debian-12",
    name: "Debian 12",
    logo: "https://logodix.com/logo/1171807.png",
  },
  {
    id: "debian-11",
    name: "Debian 11",
    logo: "https://logodix.com/logo/1171807.png",
  },
  {
    id: "alpine-3.21",
    name: "Alpine 3.21",
    logo: "https://i.ibb.co/rRhpX9Xn/285a4588-4e0b-40dd-be11-d68ea5e1eb24.png",
  },
  {
    id: "alpine-3.19",
    name: "Alpine 3.19",
    logo: "https://i.ibb.co/rRhpX9Xn/285a4588-4e0b-40dd-be11-d68ea5e1eb24.png",
  },
];

type ResourceKey = "cpu" | "memory" | "storage";

const resourceFields: {
  key: ResourceKey;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}[] = [
  { key: "cpu", label: "CPU Cores", unit: "Cores", min: 1, max: 4, step: 1 },
  {
    key: "memory",
    label: "Memory",
    unit: "MB",
    min: 128,
    max: 4096,
    step: 128,
  },
  { key: "storage", label: "Storage", unit: "GB", min: 2, max: 10, step: 1 },
];

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

const CreateVPSPage = () => {
  const dispatch = useAppDispatch();

  const { isCreating, error } = useAppSelector((state) => state.vps);

  const [formData, setFormData] = useState({
    name: "",
    os: "ubuntu-24",
    resources: {
      cpu: 1,
      memory: 128,
      storage: 2,
    },
  });
  const router = useRouter();

  const updateResource = (key: ResourceKey, value: number) =>
    setFormData((prev) => ({
      ...prev,
      resources: { ...prev.resources, [key]: value },
    }));

  const selectedOs = osOptions.find((os) => os.id === formData.os);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading("Deploying your VPS...");

    try {
      const response = await dispatch(createVps(formData)).unwrap();
      console.log(response);
      toast.success("VPS deployed successfully 🎉", {
        id: loadingToast,
      });

      router.push(`/dashboard/vps/${response.data._id}`);
    } catch (err) {
      console.log("UNWRAP:", err, typeof err);
      toast.error(String(err), {
        id: loadingToast,
      });
    }
  };

  return (
    <main
      className={`${display.variable} ${body.variable} db-root relative isolate min-h-screen overflow-hidden`}
    >
      <div className="db-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="db-glow pointer-events-none absolute -right-40 -top-48 -z-10 h-[560px] w-[560px] rounded-full" />
      <div className="db-grain pointer-events-none fixed inset-0 z-50" />

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
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

        <header className="mt-6 flex items-center gap-4">
          <div className="db-mark flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
            <ServerGlyph className="h-6 w-6" />
          </div>
          <div>
            <h1 className="db-display db-title text-3xl font-semibold md:text-4xl">
              Deploy New VPS
            </h1>
            <p className="db-muted mt-1 text-sm md:text-base">
              Configure your resources and select your preferred OS image.
            </p>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid grid-cols-1 gap-6 md:mt-12 lg:grid-cols-3 lg:gap-8"
        >
          {/* ---------- Left column ---------- */}
          <div className="space-y-6 lg:col-span-2">
            {/* Instance name */}
            <div className="db-card rounded-2xl p-6 md:p-7">
              <label
                htmlFor="instance-name"
                className="db-display db-title block text-lg font-semibold"
              >
                Instance Name
              </label>

              <input
                id="instance-name"
                type="text"
                required
                value={formData.name}
                className="db-input mt-4 w-full rounded-xl px-4 py-3.5 text-base outline-none"
                placeholder="e.g., production-server-01"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </div>

            {/* OS */}
            <div className="db-card rounded-2xl p-6 md:p-7">
              <div className="flex items-center justify-between gap-4">
                <h2 className="db-display db-title text-lg font-semibold">
                  Select Operating System
                </h2>
                <span className="db-muted-2 text-sm">
                  {osOptions.length} images
                </span>
              </div>

              <div
                role="radiogroup"
                aria-label="Operating system"
                className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
              >
                {osOptions.map((os) => {
                  const selected = formData.os === os.id;

                  return (
                    <button
                      key={os.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          os: os.id,
                        })
                      }
                      className={`db-os ${selected ? "db-os-on" : ""} relative flex flex-col items-center gap-4 rounded-xl p-5 md:p-6`}
                    >
                      {selected && (
                        <span className="db-check absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full">
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
                      )}

                      <span className="db-os-logo flex h-14 w-14 items-center justify-center rounded-xl">
                        <Image
                          src={os.logo}
                          alt={os.name}
                          width={50}
                          height={50}
                          className="h-9 w-9 object-contain"
                        />
                      </span>

                      <span className="db-title text-sm font-medium">
                        {os.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ---------- Resources panel ---------- */}
          <div className="lg:col-span-1">
            <div className="db-fleet sticky top-8 space-y-7 rounded-3xl p-6 md:p-8">
              <h3 className="db-display db-title border-b border-white/10 pb-4 text-xl font-semibold">
                Resources
              </h3>

              <div className="space-y-6">
                {resourceFields.map((item) => {
                  const value = formData.resources[item.key];
                  const fill =
                    ((value - item.min) / (item.max - item.min)) * 100;

                  return (
                    <div key={item.key}>
                      <div className="mb-3 flex items-baseline justify-between gap-3">
                        <label
                          htmlFor={`res-${item.key}`}
                          className="db-muted text-sm"
                        >
                          {item.label}
                        </label>

                        <span className="db-display db-title text-2xl font-semibold tabular-nums">
                          {value}
                          <span className="db-muted-2 ml-1.5 text-sm font-medium">
                            {item.unit}
                          </span>
                        </span>
                      </div>

                      <input
                        id={`res-${item.key}`}
                        type="range"
                        min={item.min}
                        max={item.max}
                        step={item.step}
                        className="db-range"
                        style={{ "--fill": `${fill}%` } as CSSProperties}
                        value={value}
                        onChange={(e) =>
                          updateResource(item.key, Number(e.target.value))
                        }
                      />

                      <div className="db-muted-2 mt-1.5 flex justify-between text-xs tabular-nums">
                        <span>{item.min}</span>
                        <span>{item.max}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="db-summary space-y-3 rounded-xl p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="db-muted">Name</span>
                  <span className="db-title truncate font-medium">
                    {formData.name.trim() || "Not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="db-muted">Image</span>
                  <span className="db-title font-medium">
                    {selectedOs?.name}
                  </span>
                </div>
              </div>

              {error && (
                <p
                  className="db-error rounded-lg px-4 py-3 text-sm"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isCreating}
                className="db-btn-primary inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl text-base font-semibold"
              >
                {isCreating && (
                  <svg
                    viewBox="0 0 24 24"
                    className="db-spin h-4 w-4"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                      opacity=".25"
                    />
                    <path
                      d="M21 12a9 9 0 00-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                {isCreating ? "Deploying..." : "Deploy Instance"}
              </button>
            </div>
          </div>
        </form>
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
        .db-summary {
          background: color-mix(in srgb, var(--db-white) 4%, transparent);
          border: 1px solid color-mix(in srgb, var(--db-white) 9%, transparent);
        }

        /* Input */
        .db-input {
          color: var(--db-white);
          background: color-mix(in srgb, var(--db-black) 70%, transparent);
          border: 1px solid color-mix(in srgb, var(--db-white) 14%, transparent);
          transition: border-color .2s ease, box-shadow .2s ease;
        }
        .db-input::placeholder { color: color-mix(in srgb, var(--db-white) 35%, transparent); }
        .db-input:hover { border-color: color-mix(in srgb, var(--db-white) 28%, transparent); }
        .db-input:focus {
          border-color: var(--db-yellow);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--db-yellow) 16%, transparent);
        }

        /* OS tiles */
        .db-os {
          background: color-mix(in srgb, var(--db-black) 70%, transparent);
          border: 1px solid color-mix(in srgb, var(--db-white) 10%, transparent);
          transition: border-color .25s ease, background .25s ease, box-shadow .25s ease;
        }
        .db-os:hover { border-color: color-mix(in srgb, var(--db-white) 30%, transparent); }
        .db-os:focus-visible {
          outline: 2px solid var(--db-yellow);
          outline-offset: 2px;
        }
        .db-os-on,
        .db-os-on:hover {
          border-color: var(--db-yellow);
          background: color-mix(in srgb, var(--db-yellow) 7%, var(--db-black));
          box-shadow: 0 0 40px -14px color-mix(in srgb, var(--db-yellow) 60%, transparent);
        }
        .db-os-logo {
          background: color-mix(in srgb, var(--db-white) 92%, transparent);
        }
        .db-check {
          color: var(--db-black);
          background: var(--db-yellow);
          box-shadow: 0 0 12px color-mix(in srgb, var(--db-yellow) 60%, transparent);
        }

        /* Range sliders */
        .db-range {
          -webkit-appearance: none;
                  appearance: none;
          width: 100%;
          height: 22px;
          background: transparent;
          cursor: pointer;
        }
        .db-range::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            var(--db-yellow) var(--fill),
            color-mix(in srgb, var(--db-white) 13%, transparent) var(--fill)
          );
        }
        .db-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          margin-top: -7px;
          border-radius: 50%;
          background: var(--db-yellow);
          border: 4px solid var(--db-black);
          box-shadow:
            0 0 0 1px var(--db-yellow),
            0 0 16px color-mix(in srgb, var(--db-yellow) 55%, transparent);
          transition: transform .15s ease;
        }
        .db-range:active::-webkit-slider-thumb { transform: scale(1.15); }
        .db-range::-moz-range-track {
          height: 6px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--db-white) 13%, transparent);
        }
        .db-range::-moz-range-progress {
          height: 6px;
          border-radius: 999px;
          background: var(--db-yellow);
        }
        .db-range::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: var(--db-yellow);
          border: 4px solid var(--db-black);
          box-shadow:
            0 0 0 1px var(--db-yellow),
            0 0 16px color-mix(in srgb, var(--db-yellow) 55%, transparent);
        }
        .db-range:focus-visible { outline: none; }
        .db-range:focus-visible::-webkit-slider-thumb {
          box-shadow:
            0 0 0 1px var(--db-yellow),
            0 0 0 4px color-mix(in srgb, var(--db-white) 70%, transparent);
        }
        .db-range:focus-visible::-moz-range-thumb {
          box-shadow:
            0 0 0 1px var(--db-yellow),
            0 0 0 4px color-mix(in srgb, var(--db-white) 70%, transparent);
        }

        /* Error */
        .db-error {
          color: #ff7a7a;
          background: color-mix(in srgb, #ff7a7a 8%, transparent);
          border: 1px solid color-mix(in srgb, #ff7a7a 35%, transparent);
        }

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
        .db-btn-primary:disabled {
          opacity: .6;
          cursor: not-allowed;
        }
        .db-btn-primary:focus-visible {
          outline: 2px solid var(--db-white);
          outline-offset: 2px;
        }
        .db-spin { animation: db-rotate .8s linear infinite; }
        @keyframes db-rotate { to { transform: rotate(360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .db-spin { animation: none; }
          .db-btn-primary, .db-os, .db-input, .db-back, .db-range::-webkit-slider-thumb { transition: none; }
          .db-btn-primary:hover:not(:disabled) { transform: none; }
          .db-range:active::-webkit-slider-thumb { transform: none; }
        }
      `}</style>
    </main>
  );
};

export default CreateVPSPage;
