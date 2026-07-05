import Button from "@/components/ui/Button";

export default function VpsSettingsPage() {
      return (
            <main className="max-w-4xl space-y-8 p-8">
                  <div>
                        <h1 className="text-4xl font-semibold">VPS Settings</h1>

                        <p className="mt-2 text-white/60">
                              Configure this VPS instance.
                        </p>
                  </div>

                  {/* General */}

                  <section className="border border-border">
                        <div className="border-b border-border p-6">
                              <h2 className="text-xl font-semibold">General</h2>
                        </div>

                        <div className="space-y-6 p-6">
                              <div>
                                    <label className="mb-2 block text-white/60">
                                          VPS Name
                                    </label>

                                    <input
                                          defaultValue="production-api"
                                          className="w-full border border-border bg-background px-4 py-3 outline-none focus:border-accent"
                                    />
                              </div>

                              <Button>Save Changes</Button>
                        </div>
                  </section>

                  {/* Power */}

                  <section className="border border-border">
                        <div className="border-b border-border p-6">
                              <h2 className="text-xl font-semibold">Power</h2>
                        </div>

                        <div className="flex gap-4 p-6">
                              <button className="border border-border px-5 py-2.5 hover:border-accent">
                                    Restart
                              </button>

                              <button className="border border-border px-5 py-2.5 hover:border-yellow-500">
                                    Stop
                              </button>

                              <button className="border border-border px-5 py-2.5 hover:border-green-500">
                                    Start
                              </button>
                        </div>
                  </section>

                  {/* Danger */}

                  <section className="border border-red-500/40 bg-red-500/5">
                        <div className="border-b border-red-500/30 p-6">
                              <h2 className="text-xl font-semibold text-red-400">
                                    Danger Zone
                              </h2>
                        </div>

                        <div className="flex items-center justify-between p-6">
                              <div>
                                    <h3 className="font-medium">Delete VPS</h3>

                                    <p className="mt-2 text-white/60">
                                          This action cannot be undone.
                                    </p>
                              </div>

                              <button className="border border-red-500 px-5 py-2.5 text-red-400 hover:bg-red-500/10">
                                    Delete VPS
                              </button>
                        </div>
                  </section>
            </main>
      );
}
