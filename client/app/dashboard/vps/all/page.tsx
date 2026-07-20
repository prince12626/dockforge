import Button from "@/components/ui/Button";
import { CircleOff, Play, Square, Terminal, Trash2 } from "lucide-react";

const vps = [
  {
    id: 1,
    name: "Production API",
    status: "Running",
    cpu: "2 vCPU",
    memory: "4 GB",
    storage: "40 GB",
    created: "2 days ago",
  },
  {
    id: 2,
    name: "Portfolio",
    status: "Stopped",
    cpu: "1 vCPU",
    memory: "2 GB",
    storage: "20 GB",
    created: "5 hours ago",
  },
];

export default function VpsPage() {
  return (
    <main className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-white">VPS</h1>

          <p className="mt-2 text-white/60">
            Manage all your virtual private servers.
          </p>
        </div>

        <Button>Create VPS</Button>
      </div>

      <div className="overflow-hidden border border-border">
        <table className="w-full">
          <thead className="border-b border-border text-left">
            <tr className="text-white/50">
              <th className="p-4">Name</th>
              <th>Status</th>
              <th>CPU</th>
              <th>RAM</th>
              <th>Storage</th>
              <th>Created</th>
              <th className="text-right pr-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {vps.map((server) => (
              <tr
                key={server.id}
                className="border-b border-border hover:bg-white/2"
              >
                <td className="p-4 font-medium">{server.name}</td>

                <td>
                  <span
                    className={`${
                      server.status === "Running"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    ● {server.status}
                  </span>
                </td>

                <td>{server.cpu}</td>

                <td>{server.memory}</td>

                <td>{server.storage}</td>

                <td className="text-white/60">{server.created}</td>

                <td>
                  <div className="flex justify-end gap-2 pr-4">
                    <button className="border border-border p-2 hover:border-accent">
                      <Terminal size={16} />
                    </button>

                    {server.status === "Running" ? (
                      <button className="border border-border p-2 hover:border-red-500">
                        <Square size={16} />
                      </button>
                    ) : (
                      <button className="border border-border p-2 hover:border-green-500">
                        <Play size={16} />
                      </button>
                    )}

                    <button className="border border-border p-2 hover:border-yellow-500">
                      <CircleOff size={16} />
                    </button>

                    <button className="border border-border p-2 hover:border-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
