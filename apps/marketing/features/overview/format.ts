import { formatNgn, formatSnakeCaseWords, formatUtcDate } from "@gorro/ui/utils"

import {
  CURRENCY_METRIC_KEYS,
  METRIC_LABELS,
  RATE_METRIC_KEYS,
} from "@/features/overview/constants"
import type {
  MarketingMetric,
  MarketingPeriod,
  MarketingTrend,
} from "@/features/overview/types"

export function metricLabel(key: string) {
  return METRIC_LABELS[key] ?? formatSnakeCaseWords(key)
}

export function formatMetricValue(key: string, value: number) {
  if (CURRENCY_METRIC_KEYS.has(key)) return formatNgn(value)
  if (RATE_METRIC_KEYS.has(key)) return `${value.toLocaleString()}%`
  return value.toLocaleString()
}

export function formatPeriodRange(period: MarketingPeriod | null) {
  if (!period) return null
  return `${formatUtcDate(period.from)} – ${formatUtcDate(period.to)}`
}

export function formatComparedWith(period: MarketingPeriod | null) {
  if (!period?.comparedWith) return null
  return `${formatUtcDate(period.comparedWith.from)} – ${formatUtcDate(period.comparedWith.to)}`
}

export function trendLabel(trend: MarketingTrend) {
  if (trend === "up") return "Up"
  if (trend === "down") return "Down"
  return "Flat"
}

export function metricHint(metric: MarketingMetric) {
  const previous = formatMetricValue(metric.key, metric.previous)
  const movement = `${trendLabel(metric.trend)} from ${previous}`
  if (metric.target == null || metric.achievementPct == null) {
    return `${movement}. No target.`
  }
  const target = formatMetricValue(metric.key, metric.target)
  return `${movement}. ${metric.achievementPct}% of ${target} target.`
}
