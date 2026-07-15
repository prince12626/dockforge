"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
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

      return `${memory} GB`;
};

function PlanCard({
      plan,
      onChoose,
}: {
      plan: Plan;
      onChoose: (planId: string) => void;
}) {
      return (
            <div
                  className={`relative border p-8 transition-all ${
                        plan.featured
                              ? "scale-105 border-violet-500 bg-violet-500/5 shadow-2xl shadow-violet-500/20"
                              : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                  }`}
            >
                  {plan.featured && (
                        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                              Most Popular
                        </span>
                  )}

                  <h2 className="text-3xl font-bold">{plan.name}</h2>

                  <p className="mt-2 text-zinc-400">{plan.description}</p>

                  <div className="mt-8 flex items-end gap-2">
                        <span className="text-5xl font-bold">
                              ₹{plan.price}
                        </span>

                        <span className="pb-1 text-zinc-400">
                              {plan.price === 0 ? "" : "/month"}
                        </span>
                  </div>

                  <div className="mt-8 space-y-3 text-sm">
                        <div>🖥️ {plan.cpu} vCPU</div>
                        <div>💾 {formatMemory(plan.memory)} RAM</div>
                        <div>📦 {plan.storage} GB SSD</div>
                        <div>🚀 {plan.maxVps} VPS</div>
                  </div>

                  <ul className="mt-8 space-y-3">
                        {plan.features.map((feature) => (
                              <li key={feature} className="flex gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>{feature}</span>
                              </li>
                        ))}
                  </ul>

                  <Button
                        className="mt-10 w-full"
                        onClick={() => onChoose(plan._id)}
                  >
                        {plan.price === 0 ? "Start Free Trial" : "Choose Plan"}
                  </Button>
            </div>
      );
}

export default function Plans() {
      const [plans, setPlans] = useState<Plan[]>([]);
      const [loading, setLoading] = useState(true);
      const router = useRouter();
      
      const choosePlan = async (planId: string) => {
            try {
                  const { data } = await axiosInstance.post(
                        `plans/${planId}/select`,
                  );
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
                              await axiosInstance.post(
                                    "payments/verify",
                                    response,
                              );

                              router.push("/dashboard");
                        },

                        theme: {
                              color: "#7c3aed",
                        },

                        modal: {
                              ondismiss() {
                                    console.log("Payment cancelled");
                              },
                        },
                  };

                  const razorpay = new window.Razorpay(options);

                  razorpay.open();
            } catch (error) {
                  console.error(error);
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

      if (loading) {
            return (
                  <div className="flex min-h-[60vh] items-center justify-center">
                        Loading...
                  </div>
            );
      }

      const featuredPlan = plans.find((plan) => plan.featured) ?? null;

      const normalPlans = plans.filter((plan) => !plan.featured);

      return (
            <section className="mx-auto max-w-7xl px-6 py-20">
                  <div className="mb-14 text-center">
                        <h1 className="text-5xl font-bold">
                              Choose Your VPS Plan
                        </h1>

                        <p className="mt-4 text-zinc-400">
                              Deploy powerful cloud servers in seconds.
                        </p>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {featuredPlan ? (
                              <>
                                    {normalPlans[0] ? (
                                          <PlanCard
                                                key={normalPlans[0]._id}
                                                plan={normalPlans[0]}
                                                onChoose={choosePlan}
                                          />
                                    ) : (
                                          <div />
                                    )}

                                    <PlanCard
                                          key={featuredPlan._id}
                                          plan={featuredPlan}
                                          onChoose={choosePlan}
                                    />

                                    {normalPlans[1] ? (
                                          <PlanCard
                                                key={normalPlans[1]._id}
                                                plan={normalPlans[1]}
                                                onChoose={choosePlan}
                                          />
                                    ) : (
                                          <div />
                                    )}

                                    {normalPlans.slice(2).map((plan) => (
                                          <PlanCard
                                                key={plan._id}
                                                plan={plan}
                                                onChoose={choosePlan}
                                          />
                                    ))}
                              </>
                        ) : (
                              plans.map((plan) => (
                                    <PlanCard
                                          key={plan._id}
                                          plan={plan}
                                          onChoose={choosePlan}
                                    />
                              ))
                        )}
                  </div>
            </section>
      );
}
