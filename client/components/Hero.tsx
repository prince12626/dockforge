"use client";

import Link from "next/link";
import Button from "./ui/Button";
import { authClient } from "@/lib/auth-client";

const Hero = () => {
  const { data: session, isPending } = authClient.useSession();
  console.log(session);
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center lg:px-12">
        <div className="mb-8 border border-border bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
          ⚡ Launch VPS instances in under 60 seconds
        </div>

        <h1 className="max-w-5xl text-5xl font-semibold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
          Powerful VPS hosting.
          <br />
          <span className="text-accent">Built for developers.</span>
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-white/60 md:text-xl">
          Deploy, manage and monitor high-performance virtual servers from one
          clean dashboard. Configure networking, storage, firewalls and Docker
          with a few clicks.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          {!isPending && (
            <Link href={session ? "/dashboard" : "/register"}>
              <Button size="lg">
                {session ? "Go to Dashboard" : "Create Account"}
              </Button>
            </Link>
          )}

          <Link href="/demo">
            <Button variant="secondary" size="lg">
              Live Demo
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-10 text-center md:grid-cols-4">
          <div>
            <h3 className="text-3xl font-semibold text-white">60s</h3>
            <p className="mt-2 text-white/60">Deployment</p>
          </div>

          <div>
            <h3 className="text-3xl font-semibold text-white">99.9%</h3>
            <p className="mt-2 text-white/60">Uptime</p>
          </div>

          <div>
            <h3 className="text-3xl font-semibold text-white">24/7</h3>
            <p className="mt-2 text-white/60">Monitoring</p>
          </div>

          <div>
            <h3 className="text-3xl font-semibold text-white">SSH</h3>
            <p className="mt-2 text-white/60">Instant Access</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
