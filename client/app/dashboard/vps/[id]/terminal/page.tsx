import AppTerminal from "@/components/terminal/Terminal";

export default function TerminalPage() {
      return (
            <main className="flex h-[calc(100vh-72px)] flex-col">
                  <div className="border-b border-border px-8 py-4">
                        <h1 className="text-3xl font-semibold text-white">
                              production-api
                        </h1>

                        <p className="mt-1 text-white/60">Browser Terminal</p>
                  </div>

                  <AppTerminal />
            </main>
      );
}
