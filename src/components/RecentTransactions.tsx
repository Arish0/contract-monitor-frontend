import Link from "next/link";
import type { DateRange, EventRow } from "@/lib/types";
import { rangeToQueryString } from "@/lib/range";
import TransactionsTable from "@/components/TransactionsTable";

export default function RecentTransactions({
  range,
  events,
  total,
}: {
  range: DateRange;
  events: EventRow[];
  total: number;
}) {
  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Recent Transactions</h2>
        {total > 10 && (
          <Link href={`/transactions?${rangeToQueryString(range)}`} className="text-xs text-blue-500 hover:underline">
            View more ({total})
          </Link>
        )}
      </div>
      <TransactionsTable events={events} />
    </div>
  );
}
