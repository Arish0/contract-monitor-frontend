"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changeCredentials } from "@/lib/api";
import { clearSession } from "@/lib/session";

export default function ChangeCredentialsPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await changeCredentials({ currentPassword, newEmail, newPassword });
      // Credentials changed — force a fresh login with the new email/password.
      clearSession();
      router.replace("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-black/10 dark:border-white/10 p-6 flex flex-col gap-4"
      >
        <div>
          <h1 className="text-lg font-semibold">Change email & password</h1>
          <p className="text-xs text-black/50 dark:text-white/50 mt-1">
            You&apos;ll need to sign in again with the new credentials afterwards.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs text-black/60 dark:text-white/60">Current password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="rounded border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-black/60 dark:text-white/60">New email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="rounded border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-black/60 dark:text-white/60">New password</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="rounded border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-black/60 dark:text-white/60">Confirm new password</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rounded border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black text-white dark:bg-white dark:text-black px-3 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Updating…" : "Update credentials"}
        </button>
      </form>
    </div>
  );
}
