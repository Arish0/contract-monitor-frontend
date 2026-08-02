"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { GasBucket } from "@/lib/types";

export default function GasChart({ data }: { data: GasBucket[] }) {
  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
      <h2 className="text-sm font-medium mb-4">Gas consumption over time</h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="bucket" tick={{ fontSize: 10 }} minTickGap={40} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="avg_gas_used" stroke="#f59e0b" strokeWidth={2} dot={false} name="Avg gas / call" />
          <Line type="monotone" dataKey="total_gas_used" stroke="#ef4444" strokeWidth={2} dot={false} name="Total gas" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
