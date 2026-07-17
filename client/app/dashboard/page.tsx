"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { getAllVps, startVps, stopVps } from "@/features/vps/vps.thunk";
import { authClient } from "@/lib/auth-client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
      const dispatch = useAppDispatch();

      const { list, isLoading } = useAppSelector((state) => state.vps);

      const router = useRouter();

      const [actionLoading, setActionLoading] = useState<string | null>(null);

      useEffect(() => {
            dispatch(getAllVps());
      }, [dispatch]);

      const logout = async () => {
            await authClient.signOut();
            window.location.href = "/login";
      };

      const formatRelativeDate = (dateString?: string) => {
            if (!dateString) return "Unknown";

            try {
                  return formatDistanceToNow(parseISO(dateString), {
                        addSuffix: true,
                  });
            } catch {
                  return "Invalid date";
            }
      };

      const handleStop = async (id: string) => {
            try {
                  setActionLoading(id);

                  await dispatch(stopVps(id));
            } finally {
                  setActionLoading(null);
            }
      };

      const handleStart = async (id: string) => {
            try {
                  setActionLoading(id);

                  await dispatch(startVps(id));
            } finally {
                  setActionLoading(null);
            }
      };

      return (
            <main className="min-h-screen bg-background text-white">
                  <section className="flex-1 p-8">
                        <div className="flex items-center justify-between">
                              <div>
                                    <h2 className="text-3xl font-semibold">
                                          Dashboard
                                    </h2>

                                    <p className="text-white/60 mt-1">
                                          Manage your VPS infrastructure
                                    </p>
                              </div>

                              <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 border border-border bg-white/5 overflow-hidden">
                                          <img
                                                src="https://i.pinimg.com/originals/28/df/22/28df2223147fd6962b2e15b0cd21dbd9.png"
                                                alt="Profile"
                                          />
                                    </div>

                                    <Button variant="danger" onClick={logout}>
                                          Logout
                                    </Button>
                              </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mt-10">
                              <div className="border border-border p-6 bg-white/5">
                                    <p className="text-white/60">Total VPS</p>

                                    <h3 className="text-3xl font-semibold mt-2">
                                          {list.length}
                                    </h3>
                              </div>

                              <div className="border border-border p-6 bg-white/5">
                                    <p className="text-white/60">Running</p>

                                    <h3 className="text-3xl font-semibold mt-2 text-green-400">
                                          {
                                                list.filter(
                                                      (vps) =>
                                                            vps.status ===
                                                            "running",
                                                ).length
                                          }
                                    </h3>
                              </div>

                              <div className="border border-border p-6 bg-white/5">
                                    <p className="text-white/60">Stopped</p>

                                    <h3 className="text-3xl font-semibold mt-2 text-red-400">
                                          {
                                                list.filter(
                                                      (vps) =>
                                                            vps.status ===
                                                            "stopped",
                                                ).length
                                          }
                                    </h3>
                              </div>
                        </div>

                        <div className="mt-12">
                              <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold">
                                          Your VPS
                                    </h3>

                                    <Button variant="secondary">
                                          + Create VPS
                                    </Button>
                              </div>

                              <div className="mt-6 border border-border">
                                    <div className="grid grid-cols-4 text-sm text-white/60 border-b border-border p-4">
                                          <span>Name</span>
                                          <span>Status</span>
                                          <span>Created</span>
                                          <span>Actions</span>
                                    </div>
                                    {list.length === 0 && (
                                          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 p-10 text-center">
                                                <h2 className="text-xl font-semibold text-white">
                                                      No VPS found
                                                </h2>

                                                <p className="mt-2 max-w-sm text-sm text-zinc-400">
                                                      You don't have any VPS
                                                      yet. Create your first VPS
                                                      and start deploying your
                                                      applications instantly.
                                                </p>

                                                <Button
                                                      onClick={() =>
                                                            router.push(
                                                                  "/dashboard/vps/create",
                                                            )
                                                      }
                                                      className="mt-5"
                                                >
                                                      Create VPS
                                                </Button>
                                          </div>
                                    )}{" "}
                                    {isLoading ? (
                                          <div className="p-4 text-center">
                                                Loading your infrastructure...
                                          </div>
                                    ) : (
                                          list.map((vps) => (
                                                <div
                                                      key={vps._id}
                                                      onClick={() =>
                                                            router.push(
                                                                  `/dashboard/vps/${vps._id}`,
                                                            )
                                                      }
                                                      className="grid grid-cols-4 items-center p-4 border-b border-border hover:bg-white/5 transition-colors"
                                                >
                                                      <span className="text-xl font-semibold">
                                                            {vps.name}
                                                      </span>

                                                      <span
                                                            className={
                                                                  vps.status ===
                                                                  "running"
                                                                        ? "text-green-400 capitalize"
                                                                        : "text-red-400 capitalize"
                                                            }
                                                      >
                                                            {vps.status}
                                                      </span>

                                                      <span className="text-white/60">
                                                            {formatRelativeDate(
                                                                  vps.createdAt,
                                                            )}
                                                      </span>

                                                      <div className="flex gap-2">
                                                            <button
                                                                  onClick={(
                                                                        e,
                                                                  ) =>
                                                                        e.stopPropagation()
                                                                  }
                                                                  className="px-3 py-1.5 border border-border text-sm hover:bg-white/5"
                                                            >
                                                                  Open
                                                            </button>

                                                            {vps.status ===
                                                            "running" ? (
                                                                  <button
                                                                        onClick={(
                                                                              e,
                                                                        ) => {
                                                                              e.stopPropagation();
                                                                              handleStop(
                                                                                    vps._id,
                                                                              );
                                                                        }}
                                                                        disabled={
                                                                              actionLoading ===
                                                                              vps._id
                                                                        }
                                                                        className="px-3 py-1.5 border border-border text-sm hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                  >
                                                                        {actionLoading ===
                                                                        vps._id
                                                                              ? "Stopping..."
                                                                              : "Stop"}
                                                                  </button>
                                                            ) : (
                                                                  <button
                                                                        onClick={(
                                                                              e,
                                                                        ) => {
                                                                              e.stopPropagation();
                                                                              handleStart(
                                                                                    vps._id,
                                                                              );
                                                                        }}
                                                                        disabled={
                                                                              actionLoading ===
                                                                              vps._id
                                                                        }
                                                                        className="px-3 py-1.5 border border-border text-sm hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                  >
                                                                        {actionLoading ===
                                                                        vps._id
                                                                              ? "Starting..."
                                                                              : "Start"}
                                                                  </button>
                                                            )}
                                                      </div>
                                                </div>
                                          ))
                                    )}
                              </div>
                        </div>
                  </section>
            </main>
      );
}
