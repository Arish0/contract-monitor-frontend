"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchSummary, fetchTraffic, fetchGas, fetchByFunction, fetchTopWallets, fetchHeatmap, fetchEvents } from "@/lib/api";
import type { Summary, TrafficBucket, GasBucket, FunctionStat, WalletStat, HeatmapCell, EventRow, DateRange } from "@/lib/types";
import StatTiles from "@/components/StatTiles";
import TrafficChart from "@/components/TrafficChart";
import GasChart from "@/components/GasChart";
import FunctionBreakdown from "@/components/FunctionBreakdown";
import TopWallets from "@/components/TopWallets";
import PeakHeatmap from "@/components/PeakHeatmap";
import RangeFilter from "@/components/RangeFilter";
import RecentTransactions from "@/components/RecentTransactions";

const REFRESH_MS = 60_000;

export default function ContractOverview({ title, extra }: { title: string; extra?: React.ReactNode }) {
  const [range, setRange] = useState<DateRange>({ preset: "today" });
  const [summary, setSummary] = useState<Summary | null>(null);
  const [traffic, setTraffic] = useState<TrafficBucket[]>([]);
  const [gas, setGas] = useState<GasBucket[]>([]);
  const [byFunction, setByFunction] = useState<FunctionStat[]>([]);
  const [wallets, setWallets] = useState<WalletStat[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapCell[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [eventsTotal, setEventsTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    if (range.preset === "custom" && (!range.from || !range.to)) return;
    try {
      const [s, t, g, f, w, h, ev] = await Promise.all([
        fetchSummary(range),
        fetchTraffic(range),
        fetchGas(range),
        fetchByFunction(range),
        fetchTopWallets(range, 10),
        fetchHeatmap(range),
        fetchEvents(range, 10, 0),
      ]);
      setSummary(s);
      setTraffic(t);
      setGas(g);
      setByFunction(f);
      setWallets(w);
      setHeatmap(h);
      setEvents(ev.events);
      setEventsTotal(ev.total);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    }
  }, [range]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white">
      <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-xs text-black/50 dark:text-white/50">
              {lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString()}` : "Loading…"}
            </p>
          </div>
          <RangeFilter value={range} onChange={setRange} earliestEventTime={summary?.earliest_event_time ?? null} />
        </div>

        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-500">
            {error} — is the Worker running at {process.env.NEXT_PUBLIC_WORKER_URL ?? "http://localhost:8787"}?
          </div>
        )}

        <StatTiles summary={summary} />

        <RecentTransactions range={range} events={events} total={eventsTotal} />

        {extra}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrafficChart data={traffic} />
          <GasChart data={gas} />
        </div>

        <PeakHeatmap data={heatmap} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FunctionBreakdown data={byFunction} />
          <TopWallets data={wallets} />
        </div>
      </main>
    </div>
  );
}
