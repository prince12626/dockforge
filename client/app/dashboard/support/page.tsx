import { BookOpen, Bug, Mail, MessageCircle } from "lucide-react";

export default function SupportPage() {
      return (
            <main className="space-y-8 p-8">
                  <div>
                        <h1 className="text-4xl font-semibold text-white">
                              Support
                        </h1>

                        <p className="mt-2 text-white/60">
                              Need help? Find documentation, report bugs or
                              contact us.
                        </p>
                  </div>

                  <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        <Card
                              icon={<BookOpen size={22} />}
                              title="Documentation"
                              desc="Learn how DockForge works."
                        />

                        <Card
                              icon={<MessageCircle size={22} />}
                              title="Community"
                              desc="Join discussions with other users."
                        />

                        <Card
                              icon={<Bug size={22} />}
                              title="Report Bug"
                              desc="Found an issue? Let us know."
                        />

                        <Card
                              icon={<Mail size={22} />}
                              title="Contact"
                              desc="Reach out for assistance."
                        />
                  </section>

                  <section className="border border-border bg-white/2">
                        <div className="border-b border-border p-6">
                              <h2 className="text-xl font-semibold">
                                    Frequently Asked Questions
                              </h2>
                        </div>

                        <div className="space-y-6 p-6">
                              <div>
                                    <h3 className="font-medium">
                                          How do I create a VPS?
                                    </h3>

                                    <p className="mt-2 text-white/60">
                                          Navigate to Create VPS and complete
                                          the configuration form.
                                    </p>
                              </div>

                              <div>
                                    <h3 className="font-medium">
                                          Can I upgrade later?
                                    </h3>

                                    <p className="mt-2 text-white/60">
                                          Yes. Plans can be upgraded anytime
                                          after billing becomes available.
                                    </p>
                              </div>

                              <div>
                                    <h3 className="font-medium">
                                          Where can I access the terminal?
                                    </h3>

                                    <p className="mt-2 text-white/60">
                                          Open a VPS from the dashboard and
                                          launch the integrated browser
                                          terminal.
                                    </p>
                              </div>
                        </div>
                  </section>

                  <section className="border border-border bg-white/2 p-6">
                        <div className="flex items-center justify-between">
                              <div>
                                    <h2 className="text-xl font-semibold">
                                          Open Source
                                    </h2>

                                    <p className="mt-2 text-white/60">
                                          Follow development and report issues
                                          on GitHub.
                                    </p>
                              </div>

                              <button className="flex items-center gap-2 border border-border px-5 py-2.5 transition hover:border-accent">
                                    GitHub
                              </button>
                        </div>
                  </section>
            </main>
      );
}

function Card({
      icon,
      title,
      desc,
}: {
      icon: React.ReactNode;
      title: string;
      desc: string;
}) {
      return (
            <div className="border border-border bg-white/2 p-6 transition hover:border-accent">
                  <div className="mb-6 inline-flex border border-border p-3 text-accent">
                        {icon}
                  </div>

                  <h3 className="text-xl font-semibold">{title}</h3>

                  <p className="mt-3 text-white/60">{desc}</p>
            </div>
      );
}
