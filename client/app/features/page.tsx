import {
  ShieldCheck,
  Terminal,
  Server,
  Zap,
  Database,
  Activity,
  Cpu,
  Layers3,
} from "lucide-react";

const features = [
  {
    icon: Server,
    title: "Instant VPS Provisioning",
    description:
      "Create isolated VPS instances within seconds using Docker-based virtualization.",
  },
  {
    icon: Terminal,
    title: "Live Terminal",
    description:
      "Access your VPS directly from the browser with a real-time interactive shell.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description:
      "Built with Better Auth, secure sessions and protected infrastructure access.",
  },
  {
    icon: Database,
    title: "Persistent Storage",
    description:
      "Database synchronized VPS lifecycle with reliable state management.",
  },
  {
    icon: Zap,
    title: "Fast Deployment",
    description:
      "Provision new environments without waiting for lengthy setup processes.",
  },
  {
    icon: Activity,
    title: "Live Status",
    description:
      "Monitor running, stopped and provisioning instances in real time.",
  },
  {
    icon: Cpu,
    title: "Resource Isolation",
    description:
      "Each VPS runs independently with dedicated Docker containers.",
  },
  {
    icon: Layers3,
    title: "Scalable Architecture",
    description:
      "Designed for Redis queues, background workers and horizontal scaling.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="border-b border-border">
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
        {/* Hero */}

        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-accent">
            Features
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-6xl">
            Infrastructure built for developers.
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/60">
            DockForge simplifies VPS management with secure authentication,
            instant provisioning, browser terminals and a modern developer
            experience.
          </p>
        </div>

        {/* Grid */}

        <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="border border-border bg-white/2 p-6 transition hover:-translate-y-1 hover:border-accent"
              >
                <div className="mb-6 inline-flex border border-border p-3">
                  <Icon size={22} className="text-accent" />
                </div>

                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-white/60">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Why DockForge */}

        <div className="mt-28 border border-border">
          <div className="grid lg:grid-cols-2">
            <div className="border-b border-border p-8 lg:border-b-0 lg:border-r">
              <h2 className="text-3xl font-semibold text-white">
                Why DockForge?
              </h2>

              <p className="mt-5 leading-8 text-white/60">
                Stop managing infrastructure manually. Provision, access and
                control your VPS instances from a single dashboard without
                unnecessary complexity.
              </p>
            </div>

            <div className="grid grid-cols-2">
              <div className="border-b border-r border-border p-8">
                <h3 className="text-4xl font-semibold text-accent">1 Click</h3>
                <p className="mt-2 text-white/60">VPS Deployment</p>
              </div>

              <div className="border-b border-border p-8">
                <h3 className="text-4xl font-semibold text-accent">24/7</h3>
                <p className="mt-2 text-white/60">Infrastructure Access</p>
              </div>

              <div className="border-r border-border p-8">
                <h3 className="text-4xl font-semibold text-accent">Docker</h3>
                <p className="mt-2 text-white/60">Powered</p>
              </div>

              <div className="p-8">
                <h3 className="text-4xl font-semibold text-accent">
                  Authentication
                </h3>
                <p className="mt-2 text-white/60">
                  Secure session management with modern authentication and
                  account protection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}

        <div className="mt-24 text-center">
          <h2 className="text-4xl font-semibold text-white">
            Ready to manage your infrastructure?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Create your account and start deploying VPS instances with
            DockForge.
          </p>
        </div>
      </section>
    </main>
  );
}
