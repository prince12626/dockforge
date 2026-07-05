import Button from "@/components/ui/Button";
import {
      Terminal,
      RotateCcw,
      Square,
      Trash2,
      ExternalLink,
} from "lucide-react";

export default function VpsDetailsPage() {
      return (
            <main className="space-y-8 p-8">
                  {/* Header */}

                  <div className="flex items-center justify-between">
                        <div>
                              <h1 className="text-4xl font-semibold text-white">
                                    production-api
                              </h1>

                              <p className="mt-2 text-white/60">
                                    Running • Created 2 days ago
                              </p>
                        </div>

                        <div className="flex gap-3">
                              <Button>Open Terminal</Button>

                              <button className="border border-border px-4 py-2 hover:border-accent">
                                    <RotateCcw size={18} />
                              </button>

                              <button className="border border-border px-4 py-2 hover:border-red-500">
                                    <Square size={18} />
                              </button>
                        </div>
                  </div>

                  {/* Overview */}

                  <div className="grid gap-6 lg:grid-cols-4">
                        <Card title="Status" value="🟢 Running" />
                        <Card title="CPU" value="2 vCPU" />
                        <Card title="Memory" value="4 GB" />
                        <Card title="Storage" value="40 GB" />
                  </div>

                  {/* Connection */}

                  <section className="border border-border bg-white/2">
                        <div className="border-b border-border p-6">
                              <h2 className="text-xl font-semibold">
                                    Connection
                              </h2>
                        </div>

                        <div className="space-y-4 p-6">
                              <Info label="IPv4" value="192.168.1.25" />
                              <Info label="SSH Port" value="22" />
                              <Info label="Username" value="root" />
                        </div>
                  </section>

                  {/* Resources */}

                  <section className="grid gap-6 lg:grid-cols-2">
                        <div className="border border-border p-6">
                              <p className="text-white/60">CPU Usage</p>

                              <h3 className="mt-3 text-3xl font-semibold">
                                    18%
                              </h3>
                        </div>

                        <div className="border border-border p-6">
                              <p className="text-white/60">Memory Usage</p>

                              <h3 className="mt-3 text-3xl font-semibold">
                                    1.8 / 4 GB
                              </h3>
                        </div>
                  </section>

                  {/* Quick Actions */}

                  <section className="border border-border bg-white/2">
                        <div className="border-b border-border p-6">
                              <h2 className="text-xl font-semibold">
                                    Quick Actions
                              </h2>
                        </div>

                        <div className="flex flex-wrap gap-4 p-6">
                              <Button>Open Terminal</Button>

                              <button className="border border-border px-5 py-2.5 hover:border-accent flex items-center gap-2">
                                    <ExternalLink size={16} />
                                    Open in Browser
                              </button>

                              <button className="border border-border px-5 py-2.5 hover:border-red-500 flex items-center gap-2">
                                    <Trash2 size={16} />
                                    Delete VPS
                              </button>
                        </div>
                  </section>
            </main>
      );
}

function Card({ title, value }: { title: string; value: string }) {
      return (
            <div className="border border-border bg-white/2 p-6">
                  <p className="text-white/60">{title}</p>

                  <h3 className="mt-2 text-2xl font-semibold">{value}</h3>
            </div>
      );
}

function Info({ label, value }: { label: string; value: string }) {
      return (
            <div className="flex justify-between border-b border-border pb-4 last:border-none">
                  <span className="text-white/60">{label}</span>

                  <span>{value}</span>
            </div>
      );
}
