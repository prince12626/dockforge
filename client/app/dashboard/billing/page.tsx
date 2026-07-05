import Button from "@/components/ui/Button";

export default function BillingPage() {
      return (
            <main className="space-y-8 p-8">
                  <div>
                        <h1 className="text-4xl font-semibold text-white">
                              Billing
                        </h1>

                        <p className="mt-2 text-white/60">
                              Manage your subscription, usage and future
                              invoices.
                        </p>
                  </div>

                  {/* Current Plan */}

                  <section className="border border-border bg-white/2">
                        <div className="border-b border-border p-6">
                              <h2 className="text-xl font-semibold">
                                    Current Plan
                              </h2>
                        </div>

                        <div className="flex items-center justify-between p-6">
                              <div>
                                    <h3 className="text-2xl font-semibold">
                                          Free
                                    </h3>

                                    <p className="mt-2 text-white/60">
                                          Perfect for testing DockForge.
                                    </p>

                                    <ul className="mt-6 space-y-2 text-white/70">
                                          <li>• 2 VPS</li>
                                          <li>• 5 GB Storage</li>
                                          <li>• Community Support</li>
                                    </ul>
                              </div>

                              <Button variant="secondary">Upgrade Plan</Button>
                        </div>
                  </section>

                  {/* Usage */}

                  <section className="grid gap-6 lg:grid-cols-2">
                        <div className="border border-border bg-white/2 p-6">
                              <p className="text-white/60">VPS Usage</p>

                              <h3 className="mt-3 text-3xl font-semibold">
                                    1 / 2
                              </h3>

                              <div className="mt-5 h-2 bg-white/10">
                                    <div className="h-full w-1/2 bg-accent" />
                              </div>
                        </div>

                        <div className="border border-border bg-white/2 p-6">
                              <p className="text-white/60">Storage</p>

                              <h3 className="mt-3 text-3xl font-semibold">
                                    1.2 GB
                              </h3>

                              <p className="mt-2 text-white/50">of 5 GB used</p>
                        </div>
                  </section>

                  {/* Plans */}

                  <section className="border border-border bg-white/2">
                        <div className="border-b border-border p-6">
                              <h2 className="text-xl font-semibold">
                                    Available Plans
                              </h2>
                        </div>

                        <div className="grid gap-6 p-6 lg:grid-cols-3">
                              <div className="border border-border p-6">
                                    <h3 className="text-2xl font-semibold">
                                          Free
                                    </h3>

                                    <p className="mt-2 text-white/60">
                                          ₹0 / month
                                    </p>

                                    <ul className="mt-6 space-y-2 text-white/70">
                                          <li>2 VPS</li>
                                          <li>5 GB Storage</li>
                                          <li>Community Support</li>
                                    </ul>
                              </div>

                              <div className="border border-accent p-6">
                                    <h3 className="text-2xl font-semibold">
                                          Pro
                                    </h3>

                                    <p className="mt-2 text-white/60">
                                          ₹299 / month
                                    </p>

                                    <ul className="mt-6 space-y-2 text-white/70">
                                          <li>20 VPS</li>
                                          <li>100 GB Storage</li>
                                          <li>Priority Support</li>
                                          <li>Automatic Backups</li>
                                    </ul>

                                    <Button
                                          variant="primary"
                                          className="mt-8 w-full justify-center"
                                    >
                                          Coming Soon
                                    </Button>
                              </div>

                              <div className="border border-border p-6">
                                    <h3 className="text-2xl font-semibold">
                                          Business
                                    </h3>

                                    <p className="mt-2 text-white/60">
                                          Contact Us
                                    </p>

                                    <ul className="mt-6 space-y-2 text-white/70">
                                          <li>Unlimited VPS</li>
                                          <li>Unlimited Storage</li>
                                          <li>Priority Queue</li>
                                          <li>Dedicated Support</li>
                                    </ul>
                              </div>
                        </div>
                  </section>

                  {/* Invoices */}

                  <section className="border border-border bg-white/2 p-6">
                        <h2 className="text-xl font-semibold">
                              Billing History
                        </h2>

                        <p className="mt-3 text-white/60">
                              No invoices available.
                        </p>
                  </section>
            </main>
      );
}
