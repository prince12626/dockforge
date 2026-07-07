"use client";

import React, { useEffect } from "react";
import Button from "@/components/ui/Button";
import { getAllVps } from "@/features/vps/vps.thunk";
import { authClient } from "@/lib/auth-client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatDistanceToNow, parseISO } from "date-fns";

export default function DashboardPage() {
      const dispatch = useAppDispatch();
      const { list, isLoading } = useAppSelector((state) => state.vps);

      useEffect(() => {
            dispatch(getAllVps());
      }, [dispatch]);

      const logout = async () => {
            await authClient.signOut();
            window.location.href = "/login";
      };

      // Safe function to format date
      const formatRelativeDate = (dateString?: string) => {
            if (!dateString) return "Unknown";
            try {
                  return formatDistanceToNow(parseISO(dateString), {
                        addSuffix: true,
                  });
            } catch (e) {
                  return "Invalid date";
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
                                          {list?.length || 0}
                                    </h3>
                              </div>

                              <div className="border border-border p-6 bg-white/5">
                                    <p className="text-white/60">Running</p>
                                    <h3 className="text-3xl font-semibold mt-2 text-green-400">
                                          {list?.filter(
                                                (vps) =>
                                                      vps.status === "running",
                                          ).length || 0}
                                    </h3>
                              </div>

                              <div className="border border-border p-6 bg-white/5">
                                    <p className="text-white/60">Stopped</p>
                                    <h3 className="text-3xl font-semibold mt-2 text-red-400">
                                          {list?.filter(
                                                (vps) =>
                                                      vps.status === "stopped",
                                          ).length || 0}
                                    </h3>
                              </div>
                        </div>

                        <div className="mt-12">
                              <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold">
                                          Your VPS
                                    </h3>
                                    <button className="px-4 py-2 border border-border hover:bg-white/5">
                                          + Create VPS
                                    </button>
                              </div>

                              <div className="mt-6 border border-border">
                                    <div className="grid grid-cols-4 text-sm text-white/60 border-b border-border p-4">
                                          <span>Name</span>
                                          <span>Status</span>
                                          <span>Created</span>
                                          <span>Actions</span>
                                    </div>

                                    {isLoading ? (
                                          <div className="p-4 text-center">
                                                Loading your infrastructure...
                                          </div>
                                    ) : (
                                          list?.map((vps, index) => (
                                                <div
                                                      key={index}
                                                      className="grid grid-cols-4 p-4 border-b border-border hover:bg-white/5 transition-colors"
                                                >
                                                      <span>{vps.name}</span>
                                                      <span
                                                            className={
                                                                  vps.status ===
                                                                  "running"
                                                                        ? "text-green-400"
                                                                        : "text-red-400"
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
                                                            <button className="px-2 py-1 border border-border text-xs hover:bg-white/5">
                                                                  Open
                                                            </button>
                                                            <button className="px-2 py-1 border border-border text-xs hover:bg-white/5">
                                                                  Start
                                                            </button>
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
      