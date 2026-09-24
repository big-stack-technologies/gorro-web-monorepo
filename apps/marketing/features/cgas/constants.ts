import { METRIC_LABELS } from "@/features/overview/constants"

export const DEFAULT_TREND_INTERVAL = "month" as const

export const CGA_TREND_INTERVALS = [
  { value: "day", label: "Daily" },
  { value: "week", label: "Weekly" },
  { value: DEFAULT_TREND_INTERVAL, label: "Monthly" },
] as const

export const CGA_PRODUCTS = [
  { value: "ajo", label: "Ajo" },
  { value: "cluster", label: "Cluster" },
  { value: "circle", label: "Circle" },
  { value: "savings", label: "Savings" },
] as const

export const CGA_TARGET_METRICS = Object.entries(METRIC_LABELS).map(
  ([value, label]) => ({ value, label })
)

export const CGA_STATUS_LABELS: Record<string, string> = {
  ON_TRACK: "On track",
  AT_RISK: "At risk",
  NO_TARGET: "No target",
}
