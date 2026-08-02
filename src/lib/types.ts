export interface TrafficBucket {
  bucket: string;
  tx_count: number;
}

export interface GasBucket {
  bucket: string;
  avg_gas_used: number | null;
  total_gas_used: number | null;
}

export interface FunctionStat {
  function_name: string;
  total_calls: number;
  reverts: number;
  premine_failures: number;
  avg_gas_used: number | null;
}

export interface WalletStat {
  from_address: string;
  tx_count: number;
}

export interface HeatmapCell {
  day_of_week: string; // "0" (Sun) .. "6" (Sat)
  hour_of_day: string; // "00" .. "23"
  tx_count: number;
}

export interface Summary {
  total_events: number;
  total_success: number;
  total_reverted: number;
  total_failed_premine: number;
  unique_wallets: number;
  avg_gas_used: number | null;
  earliest_event_time: number | null;
}

export type RangePreset = "today" | "week" | "month" | "year" | "custom";

export interface DateRange {
  preset: RangePreset;
  from?: string; // yyyy-mm-dd, custom only
  to?: string; // yyyy-mm-dd, custom only
}

export interface EventRow {
  id: number;
  tx_hash: string | null;
  function_name: string;
  from_address: string;
  status: "success" | "reverted" | "failed_premine";
  gas_used: number | null;
  block_time: number | null;
  revert_reason: string | null;
  explorer_url: string | null;
}

export interface EventsPage {
  events: EventRow[];
  total: number;
}

export interface NotificationSettings {
  notify_success: boolean;
  notify_revert: boolean;
  notify_failure: boolean;
}
