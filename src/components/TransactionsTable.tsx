import type { EventRow } from "@/lib/types";

const STATUS_STYLES: Record<EventRow["status"], string> = {
  success: "text-green-500",
  reverted: "text-red-500",
  failed_premine: "text-orange-500",
};

const STATUS_LABELS: Record<EventRow["status"], string> = {
  success: "Success",
  reverted: "Reverted",
  failed_premine: "Failed (pre-mine)",
};

function truncate(value: string, head = 8, tail = 6): string {
  if (value.length <= head + tail + 3) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

function formatTime(blockTime: number | null): string {
  if (blockTime == null) return "—";
  return new Date(blockTime * 1000).toLocaleString();
}

export default function TransactionsTable({ events }: { events: EventRow[] }) {
  if (events.length === 0) {
    return <div className="text-sm text-black/40 dark:text-white/40 py-6 text-center">No transactions yet</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-zinc-50 dark:bg-black">
          <tr className="text-left text-xs text-black/50 dark:text-white/50 border-b border-black/10 dark:border-white/10">
            <th className="py-2 pr-4 font-medium">Tx Hash</th>
            <th className="py-2 pr-4 font-medium">Function</th>
            <th className="py-2 pr-4 font-medium">Wallet</th>
            <th className="py-2 pr-4 font-medium">Status</th>
            <th className="py-2 pr-4 font-medium">Gas Used</th>
            <th className="py-2 pr-4 font-medium">Time</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id} className="border-b border-black/5 dark:border-white/5">
              <td className="py-2 pr-4 font-mono">
                {e.explorer_url ? (
                  <a
                    href={e.explorer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {truncate(e.tx_hash!)}
                  </a>
                ) : (
                  <span className="text-black/40 dark:text-white/40">not mined</span>
                )}
              </td>
              <td className="py-2 pr-4">{e.function_name}</td>
              <td className="py-2 pr-4 font-mono">{truncate(e.from_address)}</td>
              <td className={`py-2 pr-4 font-medium ${STATUS_STYLES[e.status]}`}>{STATUS_LABELS[e.status]}</td>
              <td className="py-2 pr-4">{e.gas_used ?? "—"}</td>
              <td className="py-2 pr-4 text-black/60 dark:text-white/60">{formatTime(e.block_time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
