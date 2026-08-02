import type { TrafficBucket, GasBucket, FunctionStat, WalletStat, HeatmapCell, Summary, NotificationSettings, DateRange, EventsPage } from "./types";
import { getSession, clearSession, type Session } from "./session";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL ?? "http://localhost:8787";

function authHeaders(): Record<string, string> {
  const session = getSession();
  return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
}

function handleUnauthorized(): never {
  clearSession();
  if (typeof window !== "undefined") window.location.href = "/login";
  throw new Error("Session expired");
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${WORKER_URL}${path}`, { cache: "no-store", headers: authHeaders() });
  if (res.status === 401) return handleUnauthorized();
  if (!res.ok) throw new Error(`${path} failed: ${res.status}`);
  return res.json();
}

function rangeQuery(range: DateRange): string {
  if (range.preset === "custom") {
    const params = new URLSearchParams({ range: "custom" });
    if (range.from) params.set("from", String(Math.floor(new Date(`${range.from}T00:00:00Z`).getTime() / 1000)));
    if (range.to) params.set("to", String(Math.floor(new Date(`${range.to}T23:59:59Z`).getTime() / 1000)));
    return params.toString();
  }
  return `range=${range.preset}`;
}

export const fetchSummary = (range: DateRange) => getJson<Summary>(`/analytics/summary?${rangeQuery(range)}`);
export const fetchTraffic = (range: DateRange) => getJson<TrafficBucket[]>(`/analytics/traffic?${rangeQuery(range)}`);
export const fetchGas = (range: DateRange) => getJson<GasBucket[]>(`/analytics/gas?${rangeQuery(range)}`);
export const fetchByFunction = (range: DateRange) => getJson<FunctionStat[]>(`/analytics/by-function?${rangeQuery(range)}`);
export const fetchTopWallets = (range: DateRange, limit = 10) =>
  getJson<WalletStat[]>(`/analytics/top-wallets?${rangeQuery(range)}&limit=${limit}`);
export const fetchHeatmap = (range: DateRange) => getJson<HeatmapCell[]>(`/analytics/heatmap?${rangeQuery(range)}`);
export const fetchEvents = (range: DateRange, limit = 10, offset = 0) =>
  getJson<EventsPage>(`/analytics/events?${rangeQuery(range)}&limit=${limit}&offset=${offset}`);

export const fetchSettings = () => getJson<NotificationSettings>("/settings");

export async function updateSettings(patch: Partial<NotificationSettings>): Promise<NotificationSettings> {
  const res = await fetch(`${WORKER_URL}/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(patch),
  });
  if (res.status === 401) return handleUnauthorized();
  if (!res.ok) throw new Error(`settings update failed: ${res.status}`);
  return res.json();
}

export async function login(email: string, password: string): Promise<Session> {
  const res = await fetch(`${WORKER_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid email or password");
  return res.json();
}

export async function changeCredentials(input: {
  currentPassword: string;
  newEmail: string;
  newPassword: string;
}): Promise<void> {
  const res = await fetch(`${WORKER_URL}/auth/change-credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
  if (res.ok) return;

  const body = (await res.json().catch(() => ({}))) as { error?: string };
  if (res.status === 401 && body.error === "unauthorized") {
    return handleUnauthorized();
  }
  throw new Error(body.error ?? `change-credentials failed: ${res.status}`);
}

export async function reportFailure(report: {
  fn: string;
  user: string;
  reason: string;
  stage: "rejected-by-node" | "preflight-simulation";
}): Promise<void> {
  await fetch(`${WORKER_URL}/report-failure`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  });
}
