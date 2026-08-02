"use client";

import { useState } from "react";
import type { DateRange, RangePreset } from "@/lib/types";

const PRESET_LABELS: Record<Exclude<RangePreset, "custom">, string> = {
  today: "Today",
  week: "Weekly",
  month: "Monthly",
  year: "Yearly",
};

export default function RangeFilter({
  value,
  onChange,
  earliestEventTime,
}: {
  value: DateRange;
  onChange: (range: DateRange) => void;
  earliestEventTime: number | null;
}) {
  const [customFrom, setCustomFrom] = useState(value.from ?? "");
  const [customTo, setCustomTo] = useState(value.to ?? "");

  const now = Math.floor(Date.now() / 1000);
  const ageSeconds = earliestEventTime != null ? now - earliestEventTime : 0;
  const hasData = earliestEventTime != null;

  const presets: Exclude<RangePreset, "custom">[] = ["today"];
  if (ageSeconds > 86400) presets.push("week");
  if (ageSeconds > 7 * 86400) presets.push("month");
  if (ageSeconds > 30 * 86400) presets.push("year");

  return (
    <div className="flex flex-col gap-2 items-end">
      <div className="flex gap-1 rounded-md border border-black/10 dark:border-white/10 p-1 w-fit">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => onChange({ preset: p })}
            className={`rounded px-3 py-1 text-xs font-medium ${
              value.preset === p
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-black/60 dark:text-white/60"
            }`}
          >
            {PRESET_LABELS[p]}
          </button>
        ))}
        {hasData && (
          <button
            onClick={() => onChange({ preset: "custom", from: customFrom, to: customTo })}
            className={`rounded px-3 py-1 text-xs font-medium ${
              value.preset === "custom"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-black/60 dark:text-white/60"
            }`}
          >
            Custom
          </button>
        )}
      </div>
      {value.preset === "custom" && (
        <div className="flex gap-2 items-center text-xs">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="rounded border border-black/10 dark:border-white/10 bg-transparent px-2 py-1"
          />
          <span className="text-black/40 dark:text-white/40">to</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="rounded border border-black/10 dark:border-white/10 bg-transparent px-2 py-1"
          />
          <button
            onClick={() => onChange({ preset: "custom", from: customFrom, to: customTo })}
            disabled={!customFrom || !customTo}
            className="rounded bg-black text-white dark:bg-white dark:text-black px-3 py-1 disabled:opacity-40"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
