import { Fragment } from "react";
import type { HeatmapCell } from "@/lib/types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PeakHeatmap({ data }: { data: HeatmapCell[] }) {
  const grid = new Map<string, number>();
  let max = 0;
  for (const cell of data) {
    const key = `${cell.day_of_week}-${cell.hour_of_day}`;
    grid.set(key, cell.tx_count);
    if (cell.tx_count > max) max = cell.tx_count;
  }

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 p-4 overflow-x-auto">
      <h2 className="text-sm font-medium mb-4">Peak hours (day of week × hour of day)</h2>
      <div className="min-w-[720px]">
        <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-[2px] text-[10px]">
          <div />
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="text-center text-black/40 dark:text-white/40">
              {h}
            </div>
          ))}
          {DAY_LABELS.map((label, day) => (
            <Fragment key={day}>
              <div className="flex items-center text-black/50 dark:text-white/50">{label}</div>
              {Array.from({ length: 24 }, (_, hour) => {
                const count = grid.get(`${day}-${String(hour).padStart(2, "0")}`) ?? 0;
                const intensity = max > 0 ? count / max : 0;
                return (
                  <div
                    key={`${day}-${hour}`}
                    title={`${label} ${hour}:00 — ${count} calls`}
                    className="aspect-square rounded-sm"
                    style={{
                      backgroundColor: intensity > 0 ? `rgba(99, 102, 241, ${0.15 + intensity * 0.85})` : "rgba(128,128,128,0.08)",
                    }}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
