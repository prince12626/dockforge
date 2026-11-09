"use client";
import { Check, Cpu, HardDrive, MemoryStick, Server } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/api";

interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  cpu: number;
  memory: number;
  storage: number;
  maxVps: number;
  featured: boolean;
  features: string[];
}

const formatMemory = (memory: number) => {
  if (memory < 1) {
    return `${memory * 1024} MB`;
  }

  return `${memory} MB`;
};

function PlanCard({
  plan,
  onChoose,
  busy,
  disabled,
}: {
  plan: Plan;
  onChoose: (planId: string) => void;
  busy: boolean;
  disabled: boolean;
}) {
  const specs = [
    { icon: Cpu, value: `${plan.cpu}`, label: "vCPU" },
    { icon: MemoryStick, value: formatMemory(plan.memory), label: "RAM" },
    { icon: HardDrive, value: `${plan.storage} GB`, label: "SSD" },
    { icon: Server, value: `${plan.maxVps}`, label: "VPS" },
  ];

  return (
    <div
      className={`pl-card relative flex flex-col rounded-2xl p-8 ${
        plan.featured ? "pl-card-featured" : ""
      }`}
    >
      {plan.featured && (
        <span className="pl-badge absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-1 text-xs font-semibold">
          Most popular
        </span>
      )}

      <h2 className="pl-title text-2xl font-semibold tracking-tight">
        {plan.name}
      </h2>
      <p className="pl-muted mt-2 text-[15px] leading-6">{plan.description}</p>

      <div className="mt-8 flex items-baseline gap-2">
        <span className="pl-title text-5xl font-semibold tracking-tight tabular-nums">
          ₹{plan.price}
        </span>
        {plan.price !== 0 && <span className="pl-muted-2">/month</span>}
      </div>

      {/* Specs */}
      <div className="pl-specs mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl">
        {specs.map((spec) => {
          const Icon = spec.icon;
          return (
            <div
              key={spec.label}
              className="pl-spec flex items-center gap-3 px-4 py-3.5"
            >
              <Icon
                size={17}
                className="pl-spec-icon shrink-0"
                aria-hidden="true"
              />
              <div className="leading-tight">
                <div className="pl-title text-sm font-semibold">
                  {spec.value}
                </div>
                <div className="pl-muted-2 text-xs">{spec.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features */}
      <ul className="mt-8 space-y-3.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-[15px]">
            <span className="pl-check mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
              <Check size={12} strokeWidth={3} aria-hidden="true" />
            </span>
            <span className="pl-feature">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onChoose(plan._id)}
        disabled={disabled}
        className={`${
          plan.featured ? "pl-btn-primary" : "pl-btn-ghost"
        } group relative mt-10 inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-xl text-[15px] font-semibold`}
      >
        <span className="relative z-10">
          {busy
            ? "Please wait…"
            : plan.price === 0
              ? "Start Free Trial"
              : "Choose Plan"}
        </span>
        {plan.featured && <span className="pl-shine" aria-hidden="true" />}
      </button>
    </div>
  );
}

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [choosingId, setChoosingId] = useState<string | null>(null);
  const router = useRouter();

  const choosePlan = async (planId: string) => {
    if (choosingId) return;

    try {
      setChoosingId(planId);

      const { data } = await axiosInstance.post(`plans/${planId}/select`);
      console.log(data);
      if (!data.paymentRequired) {
        router.push("/dashboard");
        return;
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,

        name: "DockForge",
        description: "VPS Subscription",

        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          await axiosInstance.post("payments/verify", response);

          router.push("/dashboard");
        },

        theme: {
          color: "#FFC900",
        },

        modal: {
          ondismiss() {
            console.log("Payment cancelled");
            setChoosingId(null);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(error);
    } finally {
      // Free the buttons again once the checkout is open (or the request failed).
      // Razorpay's modal is its own overlay, so the page can't be double-clicked.
      setChoosingId(null);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axiosInstance.get("plans/");
        setPlans(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const featuredPlan = plans.find((plan) => plan.featured) ?? null;
  const normalPlans = plans.filter((plan) => !plan.featured);

  // Featured plan sits in the middle column, same order as before.
  const ordered: Plan[] = featuredPlan
    ? [
        normalPlans[0],
        featuredPlan,
        normalPlans[1],
        ...normalPlans.slice(2),
      ].filter((p): p is Plan => Boolean(p))
    : plans;

  return (
    <section className="pl-root relative isolate min-h-[calc(100vh-72px)] overflow-hidden">
      <div className="pl-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="pl-glow pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full" />

      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="pl-title text-5xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-6xl">
            Choose your VPS plan.
            <span className="pl-title-dim block">Deploy in seconds.</span>
          </h1>
          <p className="pl-muted mx-auto mt-6 max-w-xl text-lg leading-8">
            Deploy powerful cloud servers in seconds.
          </p>
        </div>

        <div className="mt-20 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading &&
            [0, 1, 2].map((i) => (
              <div key={i} className="pl-card rounded-2xl p-8">
                <div className="pl-skel h-7 w-32 rounded" />
                <div className="pl-skel mt-4 h-4 w-48 rounded" />
                <div className="pl-skel mt-10 h-12 w-36 rounded" />
                <div className="pl-skel mt-10 h-28 w-full rounded-xl" />
                <div className="pl-skel mt-8 h-4 w-40 rounded" />
                <div className="pl-skel mt-3 h-4 w-32 rounded" />
                <div className="pl-skel mt-10 h-12 w-full rounded-xl" />
              </div>
            ))}

          {!loading &&
            ordered.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onChoose={choosePlan}
                busy={choosingId === plan._id}
                disabled={choosingId !== null}
              />
            ))}
        </div>

        {!loading && plans.length === 0 && (
          <p className="pl-muted mt-6 text-center">
            No plans available right now. Please try again in a moment.
          </p>
        )}
      </div>

      <style>{`
        .pl-root {
          --pl-black: var(--color-black, #08090B);
          --pl-white: var(--color-white, #F5F3EF);
          --pl-yellow: var(--color-yellow, #FFC900);
          background: var(--pl-black);
          color: var(--pl-white);
        }
        .pl-grid {
          background-image:
            linear-gradient(to right, color-mix(in srgb, var(--pl-white) 6%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb, var(--pl-white) 6%, transparent) 1px, transparent 1px);
          background-size: 64px 64px;
          -webkit-mask-image: radial-gradient(ellipse 75% 60% at 50% 20%, #000 15%, transparent 75%);
                  mask-image: radial-gradient(ellipse 75% 60% at 50% 20%, #000 15%, transparent 75%);
        }
        .pl-glow {
          background: radial-gradient(ellipse, color-mix(in srgb, var(--pl-yellow) 16%, transparent) 0%, transparent 70%);
          filter: blur(40px);
        }

        /* Text */
        .pl-title { color: var(--pl-white); }
        .pl-title-dim { color: color-mix(in srgb, var(--pl-white) 48%, transparent); }
        .pl-muted { color: color-mix(in srgb, var(--pl-white) 60%, transparent); }
        .pl-muted-2 { color: color-mix(in srgb, var(--pl-white) 42%, transparent); }
        .pl-feature { color: color-mix(in srgb, var(--pl-white) 80%, transparent); }

        /* Card */
        .pl-card {
          background: color-mix(in srgb, var(--pl-white) 3%, var(--pl-black));
          border: 1px solid color-mix(in srgb, var(--pl-white) 10%, transparent);
          transition: border-color .3s ease, transform .3s ease;
        }
        .pl-card:hover {
          border-color: color-mix(in srgb, var(--pl-white) 24%, transparent);
          transform: translateY(-3px);
        }
        .pl-card-featured {
          background: linear-gradient(180deg,
            color-mix(in srgb, var(--pl-yellow) 8%, var(--pl-black)) 0%,
            color-mix(in srgb, var(--pl-white) 2%, var(--pl-black)) 60%);
          border-color: color-mix(in srgb, var(--pl-yellow) 55%, transparent);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--pl-yellow) 15%, transparent),
            0 30px 90px -30px color-mix(in srgb, var(--pl-yellow) 40%, transparent);
        }
        .pl-card-featured:hover {
          border-color: var(--pl-yellow);
        }
        @media (min-width: 1280px) {
          .pl-card-featured { margin-top: -12px; margin-bottom: -12px; }
        }
        .pl-badge {
          background: var(--pl-yellow);
          color: var(--pl-black);
          box-shadow: 0 8px 24px -8px color-mix(in srgb, var(--pl-yellow) 70%, transparent);
        }

        /* Specs */
        .pl-specs { background: color-mix(in srgb, var(--pl-white) 9%, transparent); }
        .pl-spec { background: color-mix(in srgb, var(--pl-white) 3%, var(--pl-black)); }
        .pl-card-featured .pl-spec { background: color-mix(in srgb, var(--pl-yellow) 4%, var(--pl-black)); }
        .pl-spec-icon { color: var(--pl-yellow); }

        .pl-check {
          color: var(--pl-black);
          background: var(--pl-yellow);
        }

        /* Buttons */
        .pl-btn-primary {
          background: var(--pl-yellow);
          color: var(--pl-black);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--pl-yellow) 60%, transparent),
            0 10px 40px -10px color-mix(in srgb, var(--pl-yellow) 70%, transparent);
          transition: transform .25s ease, box-shadow .25s ease, opacity .2s ease;
        }
        .pl-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 0 0 1px var(--pl-yellow),
            0 18px 55px -8px color-mix(in srgb, var(--pl-yellow) 85%, transparent);
        }
        .pl-shine {
          position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.55) 50%, transparent 70%);
          transform: translateX(-120%);
        }
        .pl-btn-primary:hover:not(:disabled) .pl-shine { transform: translateX(120%); transition: transform .8s ease; }

        .pl-btn-ghost {
          color: var(--pl-white);
          background: color-mix(in srgb, var(--pl-white) 4%, transparent);
          border: 1px solid color-mix(in srgb, var(--pl-white) 16%, transparent);
          transition: background .25s ease, border-color .25s ease, transform .25s ease, opacity .2s ease;
        }
        .pl-btn-ghost:hover:not(:disabled) {
          background: color-mix(in srgb, var(--pl-white) 9%, transparent);
          border-color: color-mix(in srgb, var(--pl-white) 32%, transparent);
          transform: translateY(-2px);
        }
        .pl-btn-primary:disabled, .pl-btn-ghost:disabled { opacity: .6; cursor: not-allowed; }
        .pl-btn-primary:focus-visible, .pl-btn-ghost:focus-visible {
          outline: 2px solid var(--pl-white);
          outline-offset: 3px;
        }

        /* Skeleton */
        .pl-skel {
          background: color-mix(in srgb, var(--pl-white) 8%, transparent);
          animation: pl-pulse 1.4s ease-in-out infinite;
        }
        @keyframes pl-pulse { 50% { opacity: .45; } }

        @media (prefers-reduced-motion: reduce) {
          .pl-skel { animation: none; }
          .pl-card, .pl-btn-primary, .pl-btn-ghost, .pl-shine { transition: none; }
          .pl-card:hover, .pl-btn-primary:hover:not(:disabled), .pl-btn-ghost:hover:not(:disabled) { transform: none; }
        }
      `}</style>
    </section>
  );
}
