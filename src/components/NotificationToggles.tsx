"use client";

import { useEffect, useState } from "react";
import { fetchSettings, updateSettings } from "@/lib/api";
import type { NotificationSettings } from "@/lib/types";

const ROWS: { key: keyof NotificationSettings; label: string; hint: string }[] = [
  { key: "notify_success", label: "Success messages", hint: "✅ posted to the activity feed on every successful call" },
  { key: "notify_revert", label: "Revert alerts", hint: "🚨 posted to the admin group when a mined call reverts" },
  { key: "notify_failure", label: "Pre-mine failure alerts", hint: "🚨 posted when a call fails before ever reaching the chain" },
];

function Switch({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-40 ${
        checked ? "bg-indigo-600" : "bg-black/20 dark:bg-white/20"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

export default function NotificationToggles() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [pending, setPending] = useState<keyof NotificationSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load settings"));
  }, []);

  async function toggle(key: keyof NotificationSettings) {
    if (!settings) return;
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next); // optimistic
    setPending(key);
    try {
      const saved = await updateSettings({ [key]: next[key] });
      setSettings(saved);
      setError(null);
    } catch (err) {
      setSettings(settings); // revert on failure
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
      <h2 className="text-sm font-medium mb-1">Telegram notifications</h2>
      <p className="text-xs text-black/50 dark:text-white/50 mb-4">
        Each toggle controls only whether a Telegram message is sent — activity is always logged for the dashboard
        regardless of these settings.
      </p>
      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
      <div className="flex flex-col gap-4">
        {ROWS.map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm">{row.label}</div>
              <div className="text-xs text-black/40 dark:text-white/40">{row.hint}</div>
            </div>
            <Switch
              checked={settings?.[row.key] ?? false}
              disabled={!settings || pending === row.key}
              onChange={() => toggle(row.key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
