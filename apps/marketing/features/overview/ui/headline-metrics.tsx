"use client"

import {
  BarChart3Icon,
  MinusIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react"

import { AnalyticsStatCard } from "@gorro/ui/components/analytics-stat-card"

import { METRIC_ICONS } from "@/features/overview/constants"
import { formatMetricValue, metricHint, metricLabel } from "@/features/overview/format"
import type { MarketingMetric } from "@/features/overview/types"
import {
  CardGridSkeleton,
  SectionError,
  SectionHeading,
} from "@/features/overview/ui/section"

function TrendIcon({ trend }: { trend: MarketingMetric["trend"] }) {
  if (trend === "up") return <TrendingUpIcon className="size-3.5" aria-hidden />
  if (trend === "down") return <TrendingDownIcon className="size-3.5" aria-hidden />
  return <MinusIcon className="size-3.5" aria-hidden />
}

export function HeadlineMetrics({
  metrics,
  isLoading,
  error,
  onRetry,
}: {
  metrics: MarketingMetric[] | null
  isLoading: boolean
  error: unknown
  onRetry: () => void
}) {
  return (
    <section className="space-y-3" aria-label="Headline figures">
      <SectionHeading
        title="Headline figures"
        description="Target, actual, and the previous window of the same length. A missing target is shown as no target."
      />
      {isLoading ? <CardGridSkeleton count={4} /> : null}
      {!isLoading && error ? (
        <SectionError error={error} onRetry={onRetry} />
      ) : null}
      {!isLoading && !error && metrics ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = METRIC_ICONS[metric.key] ?? BarChart3Icon
            return (
              <AnalyticsStatCard
                key={metric.key}
                icon={Icon}
                label={metricLabel(metric.key)}
                value={
                  <span className="inline-flex items-center gap-2">
                    {formatMetricValue(metric.key, metric.actual)}
                    <TrendIcon trend={metric.trend} />
                  </span>
                }
                hint={metricHint(metric)}
              />
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
