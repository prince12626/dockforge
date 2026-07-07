"use client";
import Button from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
      const logout = async () => {
            await authClient.signOut();
            window.location.href = "/login";
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
                                    <div className="h-10 w-10 rounded-none border border-border bg-white/5">
                                          <img
                                                src="https://i.pinimg.com/originals/28/df/22/28df2223147fd6962b2e15b0cd21dbd9.png"
                                                alt="Profile Picture"
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
                                          3
                                    </h3>
                              </div>

                              <div className="border border-border p-6 bg-white/5">
                                    <p className="text-white/60">Running</p>
                                    <h3 className="text-3xl font-semibold mt-2 text-green-400">
                                          2
                                    </h3>
                              </div>

                              <div className="border border-border p-6 bg-white/5">
                                    <p className="text-white/60">Stopped</p>
                                    <h3 className="text-3xl font-semibold mt-2 text-red-400">
                                          1
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

                                    <div className="grid grid-cols-4 p-4 border-b border-border">
                                          <span>ubuntu-server</span>
                                          <span className="text-green-400">
                                                Running
                                          </span>
                                          <span className="text-white/60">
                                                2 min ago
                                          </span>
                                          <div className="flex gap-2">
                                                <button className="px-2 py-1 border border-border text-xs hover:bg-white/5">
                                                      Open
                                                </button>
                                                <button className="px-2 py-1 border border-border text-xs hover:bg-white/5">
                                                      Stop
                                                </button>
                                          </div>
                                    </div>

                                    <div className="grid grid-cols-4 p-4">
                                          <span>node-app</span>
                                          <span className="text-red-400">
                                                Stopped
                                          </span>
                                          <span className="text-white/60">
                                                1 hour ago
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
                              </div>
                        </div>
                  </section>
            </main>
      );
}
