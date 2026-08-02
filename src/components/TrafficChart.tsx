"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { TrafficBucket } from "@/lib/types";

export default function TrafficChart({ data }: { data: TrafficBucket[] }) {
  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
      <h2 className="text-sm font-medium mb-4">Traffic over time (calls / hour)</h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="bucket" tick={{ fontSize: 10 }} minTickGap={40} />
          <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="tx_count" stroke="#6366f1" strokeWidth={2} dot={false} name="Calls" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
