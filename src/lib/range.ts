import type { DateRange, RangePreset } from "./types";

export function rangeToQueryString(range: DateRange): string {
  const params = new URLSearchParams({ preset: range.preset });
  if (range.preset === "custom") {
    if (range.from) params.set("from", range.from);
    if (range.to) params.set("to", range.to);
  }
  return params.toString();
}

export function rangeFromSearchParams(sp: URLSearchParams): DateRange {
  const preset = (sp.get("preset") as RangePreset) ?? "week";
  if (preset === "custom") {
    return { preset, from: sp.get("from") ?? undefined, to: sp.get("to") ?? undefined };
  }
  return { preset };
}
