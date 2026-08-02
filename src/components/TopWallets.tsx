import type { WalletStat } from "@/lib/types";

function truncate(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export default function TopWallets({ data }: { data: WalletStat[] }) {
  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
      <h2 className="text-sm font-medium mb-4">Top wallets</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-black/50 dark:text-white/50 text-xs uppercase">
            <th className="pb-2">Wallet</th>
            <th className="pb-2 text-right">Calls</th>
          </tr>
        </thead>
        <tbody>
          {data.map((w) => (
            <tr key={w.from_address} className="border-t border-black/5 dark:border-white/5">
              <td className="py-2 font-mono">{truncate(w.from_address)}</td>
              <td className="py-2 text-right">{w.tx_count.toLocaleString()}</td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={2} className="py-4 text-center text-black/40 dark:text-white/40">
                No data yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
