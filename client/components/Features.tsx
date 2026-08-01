"use client";

import {
      Terminal,
      Boxes,
      ShieldCheck,
      Gauge,
      Network,
      Rocket,
      type LucideIcon,
} from "lucide-react";

type Feature = {
      icon: LucideIcon;
      title: string;
      description: string;
};

const features: Feature[] = [
      {
            icon: Rocket,
            title: "60-second deployment",
            description:
                  "Spin up a fresh VPS instance with your stack pre-configured. No manual setup, no waiting around.",
      },
      {
            icon: Terminal,
            title: "Full web terminal",
            description:
                  "Real SSH-grade shell access straight from the browser, powered by a native exec bridge, no plugins needed.",
      },
      {
            icon: Boxes,
            title: "Docker-native",
            description:
                  "Every instance runs on Docker under the hood. Pull images, manage containers, and ship without leaving the dashboard.",
      },
      {
            icon: Gauge,
            title: "Real-time monitoring",
            description:
                  "Live CPU, memory, and network graphs so you know exactly how your server is performing, at every moment.",
      },
      {
            icon: Network,
            title: "Instant networking",
            description:
                  "Firewalls, custom domains, and reverse proxy routing configured with a few clicks, no YAML required.",
      },
      {
            icon: ShieldCheck,
            title: "Isolated & secure",
            description:
                  "Every container runs sandboxed with resource limits, keeping your workloads isolated from everyone else's.",
      },
];

const Features = () => {
      return (
            <section className="relative border-b border-border py-24">
                  <div className="mx-auto max-w-7xl px-6 lg:px-12">
                        <div className="mx-auto max-w-2xl text-center">
                              <span className="text-sm font-medium uppercase tracking-widest text-accent">
                                    Why DockForge
                              </span>
                              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                                    Everything you need to ship, nothing you
                                    don&apos;t.
                              </h2>
                              <p className="mt-4 text-lg text-white/60">
                                    A hosting platform built around Docker, made
                                    for developers who just want their
                                    containers running fast.
                              </p>
                        </div>

                        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
                              {features.map((feature) => {
                                    const Icon = feature.icon;
                                    return (
                                          <div
                                                key={feature.title}
                                                className="group relative bg-background px-8 py-10 transition-colors duration-300 hover:bg-white/[0.03]"
                                          >
                                                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-white/5 transition-colors duration-300 group-hover:border-accent/40 group-hover:bg-accent/10">
                                                      <Icon className="h-5 w-5 text-white/70 transition-colors duration-300 group-hover:text-accent" />
                                                </div>

                                                <h3 className="mt-6 text-lg font-semibold text-white">
                                                      {feature.title}
                                                </h3>
                                                <p className="mt-2 text-sm leading-6 text-white/60">
                                                      {feature.description}
                                                </p>
                                          </div>
                                    );
                              })}
                        </div>
                  </div>
            </section>
      );
};

export default Features;
