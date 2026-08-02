"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { FunctionStat } from "@/lib/types";

export default function FunctionBreakdown({ data }: { data: FunctionStat[] }) {
  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
      <h2 className="text-sm font-medium mb-4">Calls by function</h2>
      <ResponsiveContainer width="100%" height={Math.max(260, data.length * 32)}>
        <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
          <YAxis type="category" dataKey="function_name" tick={{ fontSize: 11 }} width={160} />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_calls" fill="#6366f1" name="Total calls" />
          <Bar dataKey="reverts" fill="#ef4444" name="Reverts" />
          <Bar dataKey="premine_failures" fill="#f59e0b" name="Pre-mine failures" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
