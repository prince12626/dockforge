export default function SettingsPage() {
  return (
    <main className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-semibold text-white">Settings</h1>
        <p className="mt-2 text-white/60">
          Manage your account, security and preferences.
        </p>
      </div>

      {/* Profile */}
      <section className="border border-border bg-white/2">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-semibold text-white">Profile</h2>
          <p className="mt-1 text-white/50">
            Update your personal information.
          </p>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <label className="mb-2 block text-sm text-white/60">
              Full Name
            </label>

            <input
              defaultValue="John Doe"
              className="w-full border border-border bg-background px-4 py-3 outline-none transition focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">Email</label>

            <input
              defaultValue="john@example.com"
              className="w-full border border-border bg-background px-4 py-3 outline-none transition focus:border-accent"
            />
          </div>

          <button className="border border-border px-5 py-2.5 transition hover:border-accent">
            Save Changes
          </button>
        </div>
      </section>

      {/* Security */}

      <section className="border border-border bg-white/2">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-semibold">Security</h2>

          <p className="mt-1 text-white/50">Change your account password.</p>
        </div>

        <div className="space-y-6 p-6">
          <input
            placeholder="Current Password"
            type="password"
            className="w-full border border-border bg-background px-4 py-3 outline-none focus:border-accent"
          />

          <input
            placeholder="New Password"
            type="password"
            className="w-full border border-border bg-background px-4 py-3 outline-none focus:border-accent"
          />

          <input
            placeholder="Confirm Password"
            type="password"
            className="w-full border border-border bg-background px-4 py-3 outline-none focus:border-accent"
          />

          <button className="border border-border px-5 py-2.5 transition hover:border-accent">
            Update Password
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="border border-red-500/40 bg-red-500/5">
        <div className="border-b border-red-500/30 p-6">
          <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>

          <p className="mt-1 text-red-300/70">
            Permanently remove your account.
          </p>
        </div>

        <div className="flex items-center justify-between p-6">
          <div>
            <h3 className="font-medium text-white">Delete Account</h3>

            <p className="mt-1 text-sm text-white/50">
              This action cannot be undone.
            </p>
          </div>

          <button className="border border-red-500 px-5 py-2.5 text-red-400 transition hover:bg-red-500/10">
            Delete Account
          </button>
        </div>
      </section>
    </main>
  );
}
