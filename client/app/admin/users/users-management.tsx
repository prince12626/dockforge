"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  MoreHorizontal,
  ShieldCheck,
  ShieldBan,
  Trash2,
  UserCog,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  banned?: boolean;
  banReason?: string | null;
  banExpires?: string | Date | null;
  emailVerified?: boolean;
  image?: string | null;
  createdAt: string | Date;
}

const PAGE_SIZE = 10;

export default function UsersManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await authClient.admin.listUsers({
        query: {
          limit: PAGE_SIZE,
          offset,
          ...(search.trim()
            ? {
                searchValue: search.trim(),
                searchField: "email",
                searchOperator: "contains",
              }
            : {}),
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      setUsers((result.data?.users ?? []) as AdminUser[]);
      setTotal(result.data?.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }, [offset, search]);

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeout);
  }, [fetchUsers]);

  const performAction = async (
    userId: string,
    action: string,
    callback: () => Promise<unknown>,
  ) => {
    if (actionLoading) return;

    setActionLoading(userId);

    try {
      await callback();
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : `${action} failed.`);
    } finally {
      setActionLoading(null);
    }
  };

  const banUser = (user: AdminUser) => {
    const reason = window.prompt("Enter ban reason:");

    if (reason === null || !reason.trim()) return;

    void performAction(user.id, "Ban user", () =>
      authClient.admin.banUser({
        userId: user.id,
        banReason: reason.trim(),
      }),
    );
  };

  const unbanUser = (user: AdminUser) => {
    if (!window.confirm(`Unban ${user.email}?`)) return;

    void performAction(user.id, "Unban user", () =>
      authClient.admin.unbanUser({ userId: user.id }),
    );
  };

  const deleteUser = (user: AdminUser) => {
    if (
      !window.confirm(
        `Permanently delete ${user.email}? This action cannot be undone.`,
      )
    )
      return;

    void performAction(user.id, "Delete user", () =>
      authClient.admin.removeUser({ userId: user.id }),
    );
  };

  const changeRole = (user: AdminUser) => {
    const role = window.prompt("Enter role (admin/user):", user.role ?? "user");

    if (role !== "admin" && role !== "user") return;

    void performAction(user.id, "Change role", () =>
      authClient.admin.setRole({
        userId: user.id,
        role,
      }),
    );
  };

  const revokeSessions = (user: AdminUser) => {
    if (!window.confirm(`Revoke all sessions for ${user.email}?`)) return;

    void performAction(user.id, "Revoke sessions", () =>
      authClient.admin.revokeUserSessions({
        userId: user.id,
      }),
    );
  };

  const impersonateUser = (user: AdminUser) => {
    if (!window.confirm(`Impersonate ${user.email}?`)) return;

    void performAction(user.id, "Impersonate user", () =>
      authClient.admin.impersonateUser({
        userId: user.id,
      }),
    );
  };

  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#7D8B5E]">
            <Users size={15} />
            Administration
          </div>

          <h1 className="mt-2 text-2xl font-semibold text-white">Users</h1>

          <p className="mt-1 text-sm text-zinc-500">
            Manage accounts, permissions and access across Dockforge.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5 disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Users"
          value={total}
          icon={<Users size={18} />}
        />

        <StatCard
          label="Loaded Users"
          value={users.length}
          icon={<UserCog size={18} />}
        />

        <StatCard
          label="Banned Users"
          value={users.filter((user) => user.banned).length}
          icon={<ShieldBan size={18} />}
        />
      </div>

      {/* User Table */}
      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0A0A0B]">
        <div className="flex flex-col justify-between gap-3 border-b border-white/[0.08] p-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-medium text-white">All Users</h2>
            <p className="mt-1 text-xs text-zinc-500">
              {total} registered accounts
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOffset(0);
              }}
              placeholder="Search by email..."
              className="w-full rounded-lg border border-white/10 bg-[#111113] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#7D8B5E]/60"
            />
          </div>
        </div>

        {error && (
          <div className="m-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs text-zinc-500">
                <th className="px-5 py-4 font-medium">USER</th>
                <th className="px-5 py-4 font-medium">ROLE</th>
                <th className="px-5 py-4 font-medium">STATUS</th>
                <th className="px-5 py-4 font-medium">JOINED</th>
                <th className="px-5 py-4 text-right font-medium">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.05]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <Loader2 className="mx-auto animate-spin text-[#7D8B5E]" />
                    <p className="mt-3 text-xs text-zinc-500">
                      Loading users...
                    </p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-zinc-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7D8B5E]/15 font-semibold text-[#A4B58A]">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-medium text-zinc-200">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-zinc-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-md px-2 py-1 text-xs ${
                          user.role === "admin"
                            ? "bg-[#7D8B5E]/15 text-[#A4B58A]"
                            : "bg-white/5 text-zinc-400"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`flex w-fit items-center gap-1.5 text-xs ${
                          user.banned ? "text-red-400" : "text-emerald-400"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {user.banned ? "Banned" : "Active"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-xs text-zinc-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setSelectedUser(
                              selectedUser === user.id ? null : user.id,
                            )
                          }
                          className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {selectedUser === user.id && (
                          <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-white/10 bg-[#151517] p-1.5 text-left shadow-2xl">
                            <ActionButton
                              icon={<UserCog size={15} />}
                              label="Change role"
                              onClick={() => changeRole(user)}
                            />

                            <ActionButton
                              icon={<ShieldCheck size={15} />}
                              label="Impersonate"
                              onClick={() => impersonateUser(user)}
                            />

                            <ActionButton
                              icon={<RefreshCw size={15} />}
                              label="Revoke all sessions"
                              onClick={() => revokeSessions(user)}
                            />

                            {user.banned ? (
                              <ActionButton
                                icon={<ShieldCheck size={15} />}
                                label="Unban user"
                                onClick={() => unbanUser(user)}
                              />
                            ) : (
                              <ActionButton
                                icon={<ShieldBan size={15} />}
                                label="Ban user"
                                onClick={() => banUser(user)}
                              />
                            )}

                            <div className="my-1 border-t border-white/10" />

                            <ActionButton
                              icon={<Trash2 size={15} />}
                              label="Delete permanently"
                              danger
                              onClick={() => deleteUser(user)}
                            />
                          </div>
                        )}
                      </div>

                      {actionLoading === user.id && (
                        <Loader2
                          size={14}
                          className="ml-2 inline animate-spin text-[#7D8B5E]"
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-white/[0.08] px-5 py-4">
          <p className="text-xs text-zinc-500">
            Page {totalPages ? currentPage : 0} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={offset === 0 || loading}
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:bg-white/5 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              disabled={offset + PAGE_SIZE >= total || loading}
              onClick={() => setOffset(offset + PAGE_SIZE)}
              className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:bg-white/5 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-600">
        User management powered by Better Auth Admin Plugin.
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0A0A0B] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{label}</p>
        <span className="text-[#7D8B5E]">{icon}</span>
      </div>

      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs transition ${
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-zinc-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
