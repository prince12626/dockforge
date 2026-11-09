"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import {
  getAllVps,
  startVps,
  stopVps,
  deleteVps,
} from "@/features/vps/vps.thunk";
import { authClient } from "@/lib/auth-client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/Dialog";
import { Server, Trash2 } from "lucide-react";
import { toast } from "sonner";
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

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      await dispatch(deleteVps(deleteTarget.id)).unwrap();

      toast.success(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(String(err));
    } finally {
      setDeleting(false);
    }
  };

  const openVps = (id: string) => router.push(`/dashboard/vps/${id}`);
  const createVps = () => router.push("/dashboard/vps/create");

  const runningCount = list.filter((vps) => vps.status === "running").length;
  const stoppedCount = list.filter((vps) => vps.status === "stopped").length;

  const stats = [
    { label: "Total VPS", value: list.length, tone: "db-tone-white" },
    { label: "Running", value: runningCount, tone: "db-tone-yellow" },
    { label: "Stopped", value: stoppedCount, tone: "db-tone-dim" },
  ];

  return (
    <main className="db-root relative isolate min-h-screen overflow-hidden">
      <div className="db-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="db-glow pointer-events-none absolute -right-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full" />

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        {/* ---------- Header ---------- */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="db-title text-3xl font-semibold tracking-tight md:text-4xl">
              Dashboard
            </h1>
            <p className="db-muted mt-1.5">Manage your VPS infrastructure</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="db-avatar h-10 w-10 overflow-hidden rounded-full">
              <img
                src="https://i.pinimg.com/originals/28/df/22/28df2223147fd6962b2e15b0cd21dbd9.png"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>

            <button
              onClick={logout}
              className="db-btn-ghost db-btn-danger h-10 rounded-lg px-4 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        {/* ---------- Stats ---------- */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="db-stat rounded-2xl p-6">
              <p className="db-muted text-sm">{stat.label}</p>
              <p
                className={`mt-3 text-4xl font-semibold tracking-tight tabular-nums ${stat.tone}`}
              >
                {isLoading ? "–" : stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* ---------- VPS table ---------- */}
        <div className="mt-14">
          <div className="flex items-center justify-between gap-4">
            <h2 className="db-title text-xl font-semibold tracking-tight">
              Your VPS
            </h2>

            <button
              onClick={createVps}
              className="db-btn-primary h-10 rounded-lg px-5 text-sm font-semibold"
            >
              + Create VPS
            </button>
          </div>

          <div className="db-table mt-5 overflow-hidden rounded-2xl">
            {/* Table head */}
            <div className="db-head db-cols db-muted-2 px-5 py-3.5 text-sm">
              <span>Name</span>
              <span>Status</span>
              <span className="hidden md:block">Created</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Loading */}
            {isLoading &&
              [0, 1, 2].map((i) => (
                <div key={i} className="db-row db-cols items-center px-5 py-5">
                  <span className="db-skel h-5 w-32 rounded" />
                  <span className="db-skel h-5 w-20 rounded-full" />
                  <span className="db-skel hidden h-4 w-24 rounded md:block" />
                  <span className="db-skel ml-auto h-8 w-24 rounded-lg" />
                </div>
              ))}

            {/* Empty */}
            {!isLoading && list.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="db-empty-icon flex h-14 w-14 items-center justify-center rounded-2xl">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="6.5"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <rect
                      x="3"
                      y="13.5"
                      width="18"
                      height="6.5"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="M7 7.25h.01M7 16.75h.01"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h3 className="db-title mt-6 text-xl font-semibold">
                  No VPS found
                </h3>
                <p className="db-muted mt-2 max-w-sm text-sm leading-6">
                  You don&apos;t have any VPS yet. Create your first VPS and
                  start deploying your applications instantly.
                </p>

                <button
                  onClick={createVps}
                  className="db-btn-primary mt-7 h-11 rounded-lg px-6 text-sm font-semibold"
                >
                  Create VPS
                </button>
              </div>
            )}

            {/* Rows */}
            {/* Rows */}
            {!isLoading &&
              list.map((vps) => {
                const running = vps.status === "running";
                const busy = actionLoading === vps._id;

                return (
                  <div
                    key={vps._id}
                    role="link"
                    tabIndex={0}
                    onClick={() => openVps(vps._id)}
                    onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                      if (e.target === e.currentTarget && e.key === "Enter") {
                        openVps(vps._id);
                      }
                    }}
                    className="db-row db-cols group relative cursor-pointer items-center px-5 py-5"
                  >
                    <span className="flex min-w-0 items-center gap-3.5">
                      <span
                        className={`db-node ${running ? "db-node-on" : ""} flex h-10 w-10 shrink-0 items-center justify-center rounded-xl`}
                      >
                        <Server className="h-4.5 w-4.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="db-display db-title block truncate text-lg font-semibold">
                          {vps.name}
                        </span>
                        <span className="db-muted-2 mt-0.5 block text-xs md:hidden">
                          {formatRelativeDate(vps.createdAt)}
                        </span>
                      </span>
                    </span>

                    <span>
                      <span
                        className={`db-badge ${
                          running ? "db-badge-on" : "db-badge-off"
                        } inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium capitalize`}
                      >
                        <span className="db-badge-dot h-1.5 w-1.5 rounded-full" />
                        {vps.status}
                      </span>
                    </span>

                    <span className="db-muted hidden text-sm md:block">
                      {formatRelativeDate(vps.createdAt)}
                    </span>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openVps(vps._id);
                        }}
                        className="db-btn-ghost hidden h-9 rounded-lg px-4 text-sm sm:inline-flex sm:items-center"
                      >
                        Open
                      </button>

                      {running ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStop(vps._id);
                          }}
                          disabled={busy}
                          className="db-btn-ghost db-btn-danger h-9 rounded-lg px-4 text-sm"
                        >
                          {busy ? "Stopping..." : "Stop"}
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStart(vps._id);
                          }}
                          disabled={busy}
                          className="db-btn-primary h-9 rounded-lg px-4 text-sm font-semibold"
                        >
                          {busy ? "Starting..." : "Start"}
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget({ id: vps._id, name: vps.name });
                        }}
                        disabled={busy}
                        aria-label={`Delete ${vps.name}`}
                        title="Delete"
                        className="db-btn-ghost db-btn-danger flex h-9 w-9 items-center justify-center rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      <style>{`
        .db-root {
          --db-black: var(--color-black, #08090B);
          --db-white: var(--color-white, #F5F3EF);
          --db-yellow: var(--color-yellow, #FFC900);
          background: var(--db-black);
          color: var(--db-white);
        }
        .db-grid {
          background-image:
            linear-gradient(to right, color-mix(in srgb, var(--db-white) 5%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb, var(--db-white) 5%, transparent) 1px, transparent 1px);
          background-size: 64px 64px;
          -webkit-mask-image: radial-gradient(ellipse 70% 50% at 80% 0%, #000 10%, transparent 75%);
                  mask-image: radial-gradient(ellipse 70% 50% at 80% 0%, #000 10%, transparent 75%);
        }
        .db-glow {
          background: radial-gradient(circle, color-mix(in srgb, var(--db-yellow) 14%, transparent) 0%, transparent 65%);
          filter: blur(40px);
        }

        /* Text */
        .db-title { color: var(--db-white); }
        .db-muted { color: color-mix(in srgb, var(--db-white) 60%, transparent); }
        .db-muted-2 { color: color-mix(in srgb, var(--db-white) 42%, transparent); }
        .db-tone-white { color: var(--db-white); }
        .db-tone-yellow { color: var(--db-yellow); }
        .db-tone-dim { color: color-mix(in srgb, var(--db-white) 45%, transparent); }

        .db-avatar {
          border: 1px solid color-mix(in srgb, var(--db-white) 18%, transparent);
          background: color-mix(in srgb, var(--db-white) 6%, transparent);
        }

        /* Stats + table surfaces */
        .db-stat, .db-table {
          background: color-mix(in srgb, var(--db-white) 3%, var(--db-black));
          border: 1px solid color-mix(in srgb, var(--db-white) 10%, transparent);
        }
        .db-stat { transition: border-color .3s ease; }
        .db-stat:hover { border-color: color-mix(in srgb, var(--db-yellow) 35%, transparent); }

        .db-cols {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) auto;
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .db-cols { grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.2fr); }
        }
        .db-head { border-bottom: 1px solid color-mix(in srgb, var(--db-white) 9%, transparent); }
        .db-row {
          border-bottom: 1px solid color-mix(in srgb, var(--db-white) 7%, transparent);
          transition: background .2s ease;
        }
        .db-row:last-child { border-bottom: 0; }
        .db-row:hover { background: color-mix(in srgb, var(--db-yellow) 4%, transparent); }
        .db-row:focus-visible {
          outline: 2px solid var(--db-yellow);
          outline-offset: -2px;
        }

        /* Status badge */
        .db-badge {
          border: 1px solid color-mix(in srgb, var(--db-white) 12%, transparent);
        }
        .db-badge-on {
          color: var(--db-yellow);
          background: color-mix(in srgb, var(--db-yellow) 10%, transparent);
          border-color: color-mix(in srgb, var(--db-yellow) 35%, transparent);
        }
        .db-badge-on .db-badge-dot {
          background: var(--db-yellow);
          box-shadow: 0 0 10px var(--db-yellow);
        }
        .db-badge-off {
          color: color-mix(in srgb, var(--db-white) 55%, transparent);
          background: color-mix(in srgb, var(--db-white) 4%, transparent);
        }
        .db-badge-off .db-badge-dot { background: color-mix(in srgb, var(--db-white) 40%, transparent); }

        /* Buttons */
        .db-btn-primary {
          background: var(--db-yellow);
          color: var(--db-black);
          box-shadow: 0 8px 28px -10px color-mix(in srgb, var(--db-yellow) 70%, transparent);
          transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
        }
        .db-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 36px -8px color-mix(in srgb, var(--db-yellow) 85%, transparent);
        }
        .db-btn-ghost {
          color: color-mix(in srgb, var(--db-white) 85%, transparent);
          background: color-mix(in srgb, var(--db-white) 4%, transparent);
          border: 1px solid color-mix(in srgb, var(--db-white) 14%, transparent);
          transition: background .2s ease, border-color .2s ease, color .2s ease;
        }
        .db-btn-ghost:hover:not(:disabled) {
          background: color-mix(in srgb, var(--db-white) 9%, transparent);
          border-color: color-mix(in srgb, var(--db-white) 30%, transparent);
        }
        .db-btn-danger:hover:not(:disabled) {
          color: #ff7a7a;
          border-color: color-mix(in srgb, #ff7a7a 45%, transparent);
          background: color-mix(in srgb, #ff7a7a 8%, transparent);
        }
        .db-btn-primary:disabled, .db-btn-ghost:disabled {
          opacity: .5;
          cursor: not-allowed;
        }
        .db-btn-primary:focus-visible, .db-btn-ghost:focus-visible {
          outline: 2px solid var(--db-white);
          outline-offset: 2px;
        }

        /* Empty + skeleton */
        .db-empty-icon {
          color: var(--db-yellow);
          background: color-mix(in srgb, var(--db-yellow) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--db-yellow) 30%, transparent);
        }
        .db-skel {
          background: color-mix(in srgb, var(--db-white) 8%, transparent);
          animation: db-pulse 1.4s ease-in-out infinite;
        }
        @keyframes db-pulse { 50% { opacity: .45; } }

        @media (prefers-reduced-motion: reduce) {
          .db-skel { animation: none; }
          .db-btn-primary, .db-btn-ghost, .db-row, .db-stat { transition: none; }
          .db-btn-primary:hover:not(:disabled) { transform: none; }
        }
      `}</style>
      <ConfirmDialog
        open={deleteTarget !== null}
        type="error"
        icon={<Trash2 size={22} />}
        title="Delete this VPS?"
        description={
          <>
            <strong>{deleteTarget?.name}</strong> will be permanently deleted.
            This action cannot be undone.
          </>
        }
        confirmText="Delete VPS"
        loadingText="Deleting..."
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </main>
  );
}
