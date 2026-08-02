"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchEvents, fetchSummary } from "@/lib/api";
import type { DateRange, EventRow } from "@/lib/types";
import { rangeFromSearchParams } from "@/lib/range";
import RangeFilter from "@/components/RangeFilter";
import TransactionsTable from "@/components/TransactionsTable";

const PAGE_LIMIT = 2000;

function TransactionsContent() {
  const searchParams = useSearchParams();
  const [range, setRange] = useState<DateRange>(() => rangeFromSearchParams(searchParams));
  const [events, setEvents] = useState<EventRow[]>([]);
  const [total, setTotal] = useState(0);
  const [earliestEventTime, setEarliestEventTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (range.preset === "custom" && (!range.from || !range.to)) return;
    try {
      const [ev, s] = await Promise.all([fetchEvents(range, PAGE_LIMIT, 0), fetchSummary(range)]);
      setEvents(ev.events);
      setTotal(ev.total);
      setEarliestEventTime(s.earliest_event_time);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
    }
  }, [range]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white">
      <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <Link href="/" className="text-xs text-blue-500 hover:underline">
              ← Back to dashboard
            </Link>
            <h1 className="text-xl font-semibold mt-1">All Transactions</h1>
            <p className="text-xs text-black/50 dark:text-white/50">{total} total</p>
          </div>
          <RangeFilter value={range} onChange={setRange} earliestEventTime={earliestEventTime} />
        </div>

        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-500">
            {error}
          </div>
        )}

        {total > PAGE_LIMIT && (
          <div className="text-xs text-black/50 dark:text-white/50">
            Showing the most recent {PAGE_LIMIT.toLocaleString()} of {total.toLocaleString()} transactions. Narrow
            the date range to see older ones.
          </div>
        )}

        <div className="rounded-lg border border-black/10 dark:border-white/10 p-4 max-h-[75vh] overflow-y-auto">
          <TransactionsTable events={events} />
        </div>
      </main>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={null}>
      <TransactionsContent />
    </Suspense>
  );
}
