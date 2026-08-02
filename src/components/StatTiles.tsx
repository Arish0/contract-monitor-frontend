import type { Summary } from "@/lib/types";

function Tile({ label, value, tone }: { label: string; value: string; tone?: "default" | "danger" }) {
  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
      <div className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${tone === "danger" ? "text-red-500" : ""}`}>{value}</div>
    </div>
  );
}

export default function StatTiles({ summary }: { summary: Summary | null }) {
  if (!summary) return null;

  const revertRate = summary.total_events > 0 ? ((summary.total_reverted / summary.total_events) * 100).toFixed(1) : "0.0";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Tile label="Total calls" value={summary.total_events.toLocaleString()} />
      <Tile label="Unique wallets" value={summary.unique_wallets.toLocaleString()} />
      <Tile
        label="On-chain revert rate"
        value={`${revertRate}%`}
        tone={Number(revertRate) > 5 ? "danger" : "default"}
      />
      <Tile label="Avg gas used" value={summary.avg_gas_used ? Math.round(summary.avg_gas_used).toLocaleString() : "—"} />
    </div>
  );
}
