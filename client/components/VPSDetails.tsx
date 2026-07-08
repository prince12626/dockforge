"use client";

import Button from "@/components/ui/Button";
import { getVpsById } from "@/features/vps/vps.thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RotateCcw, Square, Trash2, ExternalLink } from "lucide-react";
import { useEffect } from "react";

const VPSDetails = ({ id }: { id: string }) => {
      const dispatch = useAppDispatch();

      const { selected } = useAppSelector((state) => state.vps);

      useEffect(() => {
            dispatch(getVpsById(id));
      }, [id, dispatch]);

      if (!selected) {
            return <main className="p-8 text-white">Loading VPS...</main>;
      }

      const memoryGB = (selected.resources.memory / 1024).toFixed(1);

      return (
            <main className="space-y-8 p-8">
                  {/* Header */}

                  <div className="flex items-center justify-between">
                        <div>
                              <h1 className="text-4xl font-semibold text-white">
                                    {selected.name}
                              </h1>

                              <p className="mt-2 text-white/60">
                                    {selected.runtime?.status}
                                    {" • "}
                                    Created{" "}
                                    {new Date(
                                          selected.createdAt,
                                    ).toLocaleDateString()}
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
                        <Card
                              title="Status"
                              value={
                                    selected.runtime.running
                                          ? "🟢 Running"
                                          : "🔴 Stopped"
                              }
                        />

                        <Card
                              title="CPU"
                              value={`${selected.resources.cpu} vCPU`}
                        />

                        <Card title="Memory" value={`${memoryGB} GB`} />

                        <Card
                              title="Storage"
                              value={`${selected.resources.storage} GB`}
                        />
                  </div>

                  {/* Connection */}

                  <section className="border border-border bg-white/2">
                        <div className="border-b border-border p-6">
                              <h2 className="text-xl font-semibold">
                                    Connection
                              </h2>
                        </div>

                        <div className="space-y-4 p-6">
                              <Info
                                    label="Container ID"
                                    value={selected.container.id.slice(0, 18)}
                              />

                              <Info
                                    label="Container Name"
                                    value={selected.container.name}
                              />

                              <Info label="OS" value={selected.os} />

                              <Info label="Status" value={selected.status} />
                        </div>
                  </section>

                  {/* Runtime */}

                  <section className="grid gap-6 lg:grid-cols-2">
                        <div className="border border-border p-6">
                              <p className="text-white/60">Process ID</p>

                              <h3 className="mt-3 text-3xl font-semibold">
                                    {selected.runtime.pid}
                              </h3>
                        </div>

                        <div className="border border-border p-6">
                              <p className="text-white/60">Started At</p>

                              <h3 className="mt-3 text-xl font-semibold">
                                    {new Date(
                                          selected.runtime.startedAt,
                                    ).toLocaleString()}
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
};

export default VPSDetails;

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
