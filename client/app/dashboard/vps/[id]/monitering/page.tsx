export default function MonitoringPage() {
      return (
            <main className="space-y-8 p-8">
                  <div>
                        <h1 className="text-4xl font-semibold">Monitoring</h1>

                        <p className="mt-2 text-white/60">
                              Real-time VPS resource usage.
                        </p>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-4">
                        <Card title="CPU" value="21%" />

                        <Card title="Memory" value="1.8 / 4 GB" />

                        <Card title="Disk" value="8 / 40 GB" />

                        <Card title="Network" value="32 KB/s" />
                  </div>

                  <section className="border border-border p-6">
                        <h2 className="text-xl font-semibold">CPU Usage</h2>

                        <div className="mt-6 flex h-72 items-center justify-center border border-dashed border-border text-white/40">
                              CPU Chart
                        </div>
                  </section>

                  <section className="grid gap-6 lg:grid-cols-2">
                        <div className="border border-border p-6">
                              <h2 className="text-lg font-semibold">
                                    Top Processes
                              </h2>

                              <div className="mt-6 space-y-4 text-sm">
                                    <Row name="node" value="28%" />

                                    <Row name="postgres" value="12%" />

                                    <Row name="docker" value="6%" />
                              </div>
                        </div>

                        <div className="border border-border p-6">
                              <h2 className="text-lg font-semibold">Network</h2>

                              <div className="mt-6 space-y-4 text-sm">
                                    <Row name="Incoming" value="340 KB/s" />

                                    <Row name="Outgoing" value="91 KB/s" />
                              </div>
                        </div>
                  </section>
            </main>
      );
}

function Card({ title, value }: { title: string; value: string }) {
      return (
            <div className="border border-border p-6">
                  <p className="text-white/60">{title}</p>

                  <h3 className="mt-3 text-3xl font-semibold">{value}</h3>
            </div>
      );
}

function Row({ name, value }: { name: string; value: string }) {
      return (
            <div className="flex justify-between border-b border-border pb-3">
                  <span>{name}</span>

                  <span className="text-white/60">{value}</span>
            </div>
      );
}
