"use client";

import { clearSession } from "@/lib/session";

function handleLogout() {
  clearSession();
  window.location.href = "/login";
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-52 shrink-0 border-r border-black/10 dark:border-white/10 min-h-screen px-4 py-6 flex flex-col">
      <div className="flex items-start justify-between mb-1">
        <div className="text-sm font-semibold px-2">Contract Monitor</div>
        <button
          onClick={handleLogout}
          title="Log out"
          aria-label="Log out"
          className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white p-1"
        >
          <LogoutIcon />
        </button>
      </div>
      <div className="text-xs text-black/50 dark:text-white/50 px-2 mb-4">Production</div>
      <div className="rounded-md bg-black text-white dark:bg-white dark:text-black px-2 py-1.5 text-sm">
        BorrowLend (Mainnet)
      </div>
    </aside>
  );
}
