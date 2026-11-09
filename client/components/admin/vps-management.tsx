"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Server,
  Search,
  RefreshCw,
  Play,
  Square,
  RotateCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Cpu,
  MemoryStick,
  HardDrive,
  Clock3,
  AlertCircle,
  Loader2,
  Activity,
  Eye,
} from "lucide-react";

import api from "@/lib/api";

type VpsStatus =
  | "creating"
  | "running"
  | "stopped"
  | "restarting"
  | "error"
  | "deleted";

interface Vps {
  _id: string;
  userId: string;
  name: string;
  status: VpsStatus;
  os: string;
  container?: {
    id?: string;
    name?: string;
    image?: string;
    port?: number;
    internalIp?: string;
  };
  resources?: {
    cpu: number;
    memory: number;
    storage: number;
  };
  createdAt: string;
  lastStartedAt?: string;
  expiresAt?: string;
  runtime?: {
    running: boolean;
    status: string;
    pid?: number;
    startedAt?: string;
    oomKilled?: boolean;
  };
}

interface Stats {
  total: number;
  running: number;
  stopped: number;
  creating: number;
  restarting: number;
  error: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const initialStats: Stats = {
  total: 0,
  running: 0,
  stopped: 0,
  creating: 0,
  restarting: 0,
  error: 0,
};

const statusStyles: Record<VpsStatus, string> = {
  running: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  stopped: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
  creating: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  restarting: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  error: "border-red-500/20 bg-red-500/10 text-red-400",
  deleted: "border-zinc-500/20 bg-zinc-500/10 text-zinc-500",
};

function formatDate(value?: string) {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMemory(value?: number) {
  if (value === undefined) return "—";
  return value >= 1024 ? `${(value / 1024).toFixed(1)} GB` : `${value} MB`;
}

function getErrorMessage(error: unknown) {
  const err = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  return (
    err.response?.data?.message ||
    err.message ||
    "Something went wrong. Please try again."
  );
}

export function VpsManagement() {
  const [vpsList, setVpsList] = useState<Vps[]>([]);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedVps, setSelectedVps] = useState<Vps | null>(null);

  const fetchStats = useCallback(async () => {
    const response = await api.get("admin/vps/stats");
    setStats(response.data.data);
  }, []);

  const fetchVps = useCallback(
    async (showLoader = true) => {
      if (showLoader) setLoading(true);

      setError("");

      try {
        const params: Record<string, string | number> = {
          page,
          limit: 10,
        };

        if (search.trim()) params.search = search.trim();
        if (status !== "all") params.status = status;

        const [vpsResponse] = await Promise.all([
          api.get("admin/vps", { params }),
          fetchStats(),
        ]);

        setVpsList(vpsResponse.data.data ?? []);
        setPagination(vpsResponse.data.pagination ?? null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, search, status, fetchStats],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchVps();
    }, 300);

    return () => clearTimeout(timeout);
  }, [fetchVps]);

  const refresh = async () => {
    setRefreshing(true);
    await fetchVps(false);
  };

  const performAction = async (
    vps: Vps,
    action: "start" | "stop" | "restart" | "delete",
  ) => {
    const messages = {
      start: `Start VPS "${vps.name}"?`,
      stop: `Stop VPS "${vps.name}"?`,
      restart: `Restart VPS "${vps.name}"?`,
      delete: `Permanently remove the Docker container for "${vps.name}"?`,
    };

    if (!window.confirm(messages[action])) return;

    setActionId(vps._id);
    setError("");

    try {
      if (action === "delete") {
        await api.delete(`admin/vps/${vps._id}`);
      } else {
        await api.post(`admin/vps/${vps._id}/${action}`);
      }

      if (selectedVps?._id === vps._id) {
        setSelectedVps(null);
      }

      await fetchVps(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const statCards = [
    {
      label: "Total Instances",
      value: stats.total,
      icon: Server,
      detail: "Across all users",
    },
    {
      label: "Running",
      value: stats.running,
      icon: Activity,
      detail: "Active instances",
    },
    {
      label: "Stopped",
      value: stats.stopped,
      icon: Square,
      detail: "Currently inactive",
    },
    {
      label: "Needs Attention",
      value: stats.error + stats.creating + stats.restarting,
      icon: AlertCircle,
      detail: `${stats.error} errors · ${stats.creating + stats.restarting} in progress`,
    },
  ];

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-[#7D8B5E]">
            <Server size={14} />
            <span className="uppercase tracking-[0.18em]">Infrastructure</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white">
            VPS Instances
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Monitor and manage all platform instances.
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={refreshing || loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.08] disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-white/[0.07] bg-[#0c0c0e] p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">{item.label}</span>
                <Icon size={17} className="text-[#7D8B5E]" />
              </div>

              <div className="mt-4 text-3xl font-semibold tracking-tight text-white">
                {loading ? "—" : item.value}
              </div>

              <p className="mt-1 text-xs text-zinc-600">{item.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-400">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-400/70 hover:text-red-300"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#0c0c0e] p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
          />

          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search VPS name or ID..."
            className="h-10 w-full rounded-lg border border-white/[0.08] bg-[#080809] pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#7D8B5E]/60"
          />
        </div>

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="h-10 rounded-lg border border-white/[0.08] bg-[#080809] px-3 text-sm text-zinc-300 outline-none focus:border-[#7D8B5E]/60"
        >
          <option value="all">All statuses</option>
          <option value="running">Running</option>
          <option value="stopped">Stopped</option>
          <option value="creating">Creating</option>
          <option value="restarting">Restarting</option>
          <option value="error">Error</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#0c0c0e]">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <div>
            <h2 className="text-sm font-medium text-white">All Instances</h2>
            <p className="mt-1 text-xs text-zinc-600">
              {pagination?.total ?? 0} registered instances
            </p>
          </div>

          <span className="rounded-md border border-white/[0.07] px-2.5 py-1 text-xs text-zinc-500">
            Page {page}
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-zinc-500">
            <Loader2 size={17} className="animate-spin" />
            Loading instances...
          </div>
        ) : vpsList.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <div className="mb-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
              <Server size={22} className="text-zinc-500" />
            </div>
            <p className="text-sm font-medium text-zinc-300">
              No VPS instances found
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-zinc-600">
                    <th className="px-5 py-3 font-medium">Instance</th>
                    <th className="px-5 py-3 font-medium">Owner ID</th>
                    <th className="px-5 py-3 font-medium">Resources</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Created</th>
                    <th className="px-5 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.05]">
                  {vpsList.map((vps) => (
                    <tr
                      key={vps._id}
                      className="transition hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#7D8B5E]/20 bg-[#7D8B5E]/10">
                            <Server size={16} className="text-[#9BAA77]" />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-48 truncate text-sm font-medium text-zinc-200">
                              {vps.name}
                            </p>
                            <p className="mt-1 max-w-48 truncate font-mono text-[10px] text-zinc-600">
                              {vps._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-zinc-500">
                          {vps.userId}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1.5 text-xs text-zinc-400">
                          <div className="flex items-center gap-2">
                            <Cpu size={12} className="text-zinc-600" />
                            {vps.resources?.cpu ?? "—"} CPU
                          </div>
                          <div className="flex items-center gap-2">
                            <MemoryStick size={12} className="text-zinc-600" />
                            {formatMemory(vps.resources?.memory)}
                          </div>
                          <div className="flex items-center gap-2">
                            <HardDrive size={12} className="text-zinc-600" />
                            {vps.resources?.storage ?? "—"} GB
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] capitalize ${statusStyles[vps.status] ?? statusStyles.error}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {vps.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs text-zinc-500">
                        {formatDate(vps.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="View details"
                            onClick={() => setSelectedVps(vps)}
                            className="rounded-md p-2 text-zinc-500 transition hover:bg-white/[0.07] hover:text-white"
                          >
                            <Eye size={15} />
                          </button>

                          {vps.status === "running" ? (
                            <>
                              <ActionButton
                                title="Restart"
                                icon={<RotateCw size={15} />}
                                disabled={actionId === vps._id}
                                onClick={() => performAction(vps, "restart")}
                              />
                              <ActionButton
                                title="Stop"
                                icon={<Square size={15} />}
                                disabled={actionId === vps._id}
                                onClick={() => performAction(vps, "stop")}
                              />
                            </>
                          ) : (
                            <ActionButton
                              title="Start"
                              icon={<Play size={15} />}
                              disabled={
                                actionId === vps._id ||
                                vps.status === "creating" ||
                                vps.status === "restarting"
                              }
                              onClick={() => performAction(vps, "start")}
                            />
                          )}

                          <ActionButton
                            title="Delete"
                            danger
                            icon={<Trash2 size={15} />}
                            disabled={actionId === vps._id}
                            onClick={() => performAction(vps, "delete")}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-zinc-600">
                Showing {Math.min((page - 1) * 10 + 1, pagination?.total ?? 0)}
                {" – "}
                {Math.min(page * 10, pagination?.total ?? 0)} of{" "}
                {pagination?.total ?? 0}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={!pagination?.hasPreviousPage}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-zinc-400 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>

                <button
                  disabled={!pagination?.hasNextPage}
                  onClick={() => setPage((value) => value + 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-zinc-400 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* VPS Details */}
      {selectedVps && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedVps(null);
            }
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#101012] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <div>
                <h3 className="font-medium text-white">Instance Details</h3>
                <p className="mt-1 text-xs text-zinc-500">{selectedVps.name}</p>
              </div>

              <button
                onClick={() => setSelectedVps(null)}
                className="rounded-lg p-2 text-zinc-500 hover:bg-white/[0.06] hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <DetailItem label="VPS ID" value={selectedVps._id} mono />
              <DetailItem label="Owner ID" value={selectedVps.userId} mono />
              <DetailItem label="Operating System" value={selectedVps.os} />
              <DetailItem
                label="Status"
                value={selectedVps.status}
                capitalize
              />
              <DetailItem
                label="Container ID"
                value={selectedVps.container?.id}
                mono
              />
              <DetailItem
                label="Container Name"
                value={selectedVps.container?.name}
              />
              <DetailItem
                label="Container IP"
                value={selectedVps.container?.internalIp}
              />
              <DetailItem
                label="Container Port"
                value={selectedVps.container?.port?.toString()}
              />
              <DetailItem
                label="CPU"
                value={`${selectedVps.resources?.cpu ?? "—"} cores`}
              />
              <DetailItem
                label="Memory"
                value={formatMemory(selectedVps.resources?.memory)}
              />
              <DetailItem
                label="Storage"
                value={`${selectedVps.resources?.storage ?? "—"} GB`}
              />
              <DetailItem
                label="Created At"
                value={formatDate(selectedVps.createdAt)}
              />
              <DetailItem
                label="Last Started"
                value={formatDate(selectedVps.lastStartedAt)}
              />
              <DetailItem
                label="Runtime Status"
                value={selectedVps.runtime?.status ?? "Not inspected"}
                capitalize
              />
            </div>

            <div className="flex justify-end border-t border-white/[0.07] px-5 py-4">
              <button
                onClick={() => setSelectedVps(null)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/[0.05]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  title,
  icon,
  danger = false,
  disabled = false,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md p-2 transition disabled:cursor-not-allowed disabled:opacity-30 ${
        danger
          ? "text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
          : "text-zinc-500 hover:bg-[#7D8B5E]/10 hover:text-[#A8B887]"
      }`}
    >
      {icon}
    </button>
  );
}

function DetailItem({
  label,
  value,
  mono = false,
  capitalize = false,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-[11px] uppercase tracking-wider text-zinc-600">
        {label}
      </p>
      <p
        className={`break-all text-sm text-zinc-300 ${
          mono ? "font-mono text-xs" : ""
        } ${capitalize ? "capitalize" : ""}`}
      >
        {value || "—"}
      </p>
    </div>
  );
}
