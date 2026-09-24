import { METRIC_LABELS } from "@/features/overview/constants"

/** Metrics available for org-level monthly targets (same set as CGA targets). */
export const MARKETING_TARGET_METRICS = Object.entries(METRIC_LABELS).map(
  ([value, label]) => ({ value, label })
)

export function alertRuleSeverityLabel(severity: string) {
  if (severity === "HIGH") return "High"
  if (severity === "LOW") return "Low"
  return "Medium"
}

export function formatAlertRuleThreshold(unit: string, threshold: number) {
  const normalized = unit.toLowerCase()
  if (
    normalized === "percent" ||
    normalized === "percentage" ||
    normalized === "pct" ||
    normalized === "rate"
  ) {
    return `${threshold.toLocaleString()}%`
  }
  return threshold.toLocaleString()
}
