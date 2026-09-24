import type { DashboardPeriod } from "./types"

export const DASHBOARD_PERIODS: readonly {
  value: DashboardPeriod
  label: string
}[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
] as const

export const DEFAULT_DASHBOARD_PERIOD: DashboardPeriod = "today"
