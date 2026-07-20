import Button from "@/components/ui/Button";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    description: "Explore DockForge before deploying.",
    features: [
      "Dashboard Preview",
      "Read-only Demo",
      "Demo Terminal",
      "View All Features",
      "Community Support",
    ],
    button: "Try Demo",
    variant: "secondary" as const,
    popular: false,
  },
  {
    name: "Starter",
    price: "₹299",
    period: "/month",
    description: "Perfect for personal projects and developers.",
    features: [
      "2 VPS Instances",
      "2 vCPU • 4 GB RAM",
      "50 GB SSD Storage",
      "SSH Access",
      "Docker Support",
      "Firewall",
      "Automatic Backups",
      "Monitoring",
    ],
    button: "Get Started",
    variant: "primary" as const,
    popular: true,
  },
  {
    name: "Pro",
    price: "₹799",
    period: "/month",
    description: "Scale your applications without limits.",
    features: [
      "10 VPS Instances",
      "8 vCPU • 16 GB RAM",
      "250 GB SSD Storage",
      "Unlimited Docker",
      "API Access",
      "Team Members",
      "Priority Support",
      "Scheduled Backups",
    ],
    button: "Start Pro",
    variant: "secondary" as const,
    popular: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For businesses requiring dedicated infrastructure.",
    features: [
      "Unlimited VPS",
      "Dedicated Resources",
      "Private Networking",
      "Single Sign-On",
      "Role Based Access",
      "Audit Logs",
      "24×7 Priority Support",
      "Custom SLA",
    ],
    button: "Contact Sales",
    variant: "secondary" as const,
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="border-b border-border py-28">
      <div className="mx-auto max-w-8xl px-6 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-accent font-medium">Pricing</span>

          <h2 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            Simple pricing for every stage.
          </h2>

          <p className="mt-6 text-lg text-white/60">
            Start with a free preview or launch production workloads with paid
            plans.
          </p>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col border border-border bg-background p-8 ${
                plan.popular ? "shadow-[10px_10px_0px_var(--color-accent)]" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-8 border border-border bg-accent px-3 py-1 text-base font-medium text-white">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>

              <div className="mt-5 flex items-end gap-1">
                <span className="text-5xl font-bold text-white">
                  {plan.price}
                </span>

                <span className="pb-1 text-white/60">{plan.period}</span>
              </div>

              <p className="mt-4 text-white/60">{plan.description}</p>

              <ul className="mt-8 flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-white/80"
                  >
                    <span className="text-accent">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Button
                  variant={plan.variant}
                  className="w-full justify-center"
                >
                  {plan.button}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
