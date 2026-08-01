"use client";

import Link from "next/link";
import Button from "./ui/Button";
import { authClient } from "@/lib/auth-client";

const Hero = () => {
      const { data: session, isPending } = authClient.useSession();

      return (
            <section className="relative overflow-hidden border-b border-border">
                  {/* Background grid + glow */}
                  <div
                        className="pointer-events-none absolute inset-0 opacity-[0.15]"
                        style={{
                              backgroundImage:
                                    "linear-gradient(to right, #ffffff20 1px, transparent 1px), linear-gradient(to bottom, #ffffff20 1px, transparent 1px)",
                              backgroundSize: "56px 56px",
                        }}
                  />
                  <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/20 blur-[140px]" />

                  <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center lg:px-12">
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
                              <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                              </span>
                              Launch VPS instances in under 60 seconds
                        </div>

                        <h1 className="max-w-5xl text-5xl font-semibold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
                              Powerful VPS hosting.
                              <br />
                              <span className="bg-gradient-to-r from-accent via-accent to-white/70 bg-clip-text text-transparent">
                                    Built for developers.
                              </span>
                        </h1>

                        <p className="mt-8 max-w-3xl text-lg leading-8 text-white/60 md:text-xl">
                              Deploy, manage and monitor high-performance
                              virtual servers from one clean dashboard.
                              Configure networking, storage, firewalls and
                              Docker with a few clicks.
                        </p>

                        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                              {!isPending && (
                                    <Link
                                          href={
                                                session
                                                      ? "/dashboard"
                                                      : "/register"
                                          }
                                    >
                                          <Button
                                                size="lg"
                                                className="shadow-[0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-300 hover:shadow-[0_0_30px_-5px_var(--tw-shadow-color)] hover:shadow-accent/50"
                                          >
                                                {session
                                                      ? "Go to Dashboard"
                                                      : "Create Account"}
                                          </Button>
                                    </Link>
                              )}

                              <Link href="/demo">
                                    <Button
                                          variant="secondary"
                                          size="lg"
                                          className="transition-all duration-300 hover:border-white/30 hover:bg-white/10"
                                    >
                                          Live Demo
                                    </Button>
                              </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-20 grid w-full max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
                              {[
                                    { value: "60s", label: "Deployment" },
                                    { value: "99.9%", label: "Uptime" },
                                    { value: "24/7", label: "Monitoring" },
                                    { value: "SSH", label: "Instant Access" },
                              ].map((stat) => (
                                    <div
                                          key={stat.label}
                                          className="group rounded-xl border border-border bg-white/[0.02] px-4 py-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.05]"
                                    >
                                          <h3 className="text-2xl font-semibold text-white transition-colors duration-300 group-hover:text-accent md:text-3xl">
                                                {stat.value}
                                          </h3>
                                          <p className="mt-2 text-sm text-white/50 md:text-base">
                                                {stat.label}
                                          </p>
                                    </div>
                              ))}
                        </div>
                  </div>
            </section>
      );
};

export default Hero;
