"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import axiosInstance from "@/lib/api";

interface BillingData {
  subscription: any;
  plans: any[];
  payments: any[];
  usage: {
    usedVps: number;
    maxVps: number | any;
  };
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
      <main className="p-8">
        <p className="text-white/60">Loading...</p>
      </main>
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

  return (
    <main className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-semibold">Billing</h1>

        <p className="mt-2 text-white/60">
          Manage your subscription and payments.
        </p>
      </div>

      {/* Current Plan */}
      <section className="border border-border bg-white/2">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-semibold">Current Plan</h2>
        </div>

        <div className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-2xl font-semibold">{currentPlan?.name}</h3>

            <p className="mt-2 text-white/60">₹{currentPlan?.price}/month</p>

            <p className="mt-2 text-white/50">
              Expires {new Date(subscription.expiresAt).toLocaleDateString()}
            </p>

            <ul className="mt-6 space-y-2 text-white/70">
              {currentPlan?.features?.map((feature: string) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>

          <Button variant="secondary">Upgrade Plan</Button>
        </div>
      </section>

      {/* Usage */}
      <section className="border border-border bg-white/2 p-6">
        <p className="text-white/60">VPS Usage</p>

        <h3 className="mt-3 text-3xl font-semibold">
          {usage.usedVps} / {maxVps}
        </h3>

        <div className="mt-5 h-2 bg-white/10">
          <div
            className="h-full bg-accent"
            style={{
              width: `${(usage.usedVps / maxVps) * 100}%`,
            }}
          />
        </div>
      </section>

      {/* Plans */}
      <section className="border border-border bg-white/2">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-semibold">Available Plans</h2>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`border p-6 ${
                currentPlan?._id === plan._id
                  ? "border-accent"
                  : "border-border"
              }`}
            >
              <h3 className="text-2xl font-semibold">{plan.name}</h3>

              <p className="mt-2 text-white/60">₹{plan.price}/month</p>

              <ul className="mt-6 space-y-2 text-white/70">
                {plan.features.map((feature: string) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>

              {currentPlan?._id === plan._id ? (
                <Button
                  variant="secondary"
                  className="mt-8 w-full justify-center"
                  disabled
                >
                  Current Plan
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="mt-8 w-full justify-center"
                >
                  Upgrade
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Payment History */}
      <section className="border border-border bg-white/2">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-semibold">Payment History</h2>
        </div>

        <div className="divide-y divide-border">
          {payments.length === 0 ? (
            <p className="p-6 text-white/60">No payments found.</p>
          ) : (
            payments.map((payment: any) => (
              <div
                key={payment._id}
                className="flex items-center justify-between p-6"
              >
                <div>
                  <p className="font-medium">₹{payment.amount}</p>

                  <p className="text-sm text-white/50">
                    {new Date(payment.createdAt).toLocaleString()}
                  </p>
                </div>

                <span className="rounded bg-green-500/10 px-3 py-1 text-sm text-green-400">
                  {payment.status}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
