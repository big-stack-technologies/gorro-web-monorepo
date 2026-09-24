"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { getApiErrorMessage, getApiErrorStatus } from "@gorro/api/api-error"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@gorro/ui/components/ui/chart"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import { formatNgn, formatUtcDate } from "@gorro/ui/utils"

import { TRENDS_METRICS } from "@/features/analytics/constants"
import type {
  MarketingTrendsFilters,
  MarketingTrendsResponse,
} from "@/features/analytics/types"
import { useMarketingTrends } from "@/features/analytics/usecases"
import { formatPeriodRange } from "@/features/overview/format"
import { SectionError } from "@/features/overview/ui/section"

function metricLabel(metric: MarketingTrendsFilters["metric"]) {
  return TRENDS_METRICS.find((item) => item.value === metric)?.label ?? metric
}

function formatTrendValue(metric: MarketingTrendsFilters["metric"], value: number) {
  if (metric === "gtv") return formatNgn(value)
  return value.toLocaleString()
}

function isDailyRangeError(error: unknown) {
  if (getApiErrorStatus(error) !== 400) return false
  const message = getApiErrorMessage(error).toLowerCase()
  return message.includes("daily") || message.includes("92") || message.includes("week")
}

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function TrendsPanel({ filters }: { filters: MarketingTrendsFilters }) {
  const { data, isLoading, isError, error, refetch } =
    useMarketingTrends(filters)

  const chartData = React.useMemo(() => {
    return [...(data?.points ?? [])].sort(
      (a, b) => new Date(a.bucket).getTime() - new Date(b.bucket).getTime()
    )
  }, [data?.points])

  if (isLoading && !data) {
    return <Skeleton className="h-80 w-full rounded-xl" />
  }

  if (isError) {
    if (isDailyRangeError(error)) {
      return (
        <Card className="ring-1 ring-amber-500/30">
          <CardHeader>
            <CardTitle className="text-base">Daily range too long</CardTitle>
            <CardDescription>
              Daily trends are limited to 92 days. Switch granularity to weekly
              or monthly, or shorten the date range.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {getApiErrorMessage(error)}
            </p>
          </CardContent>
        </Card>
      )
    }

    return (
      <SectionError
        error={error}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (!data) return null

  return (
    <TrendsChart data={data} chartData={chartData} onRetry={() => refetch()} />
  )
}

function TrendsChart({
  data,
  chartData,
  onRetry,
}: {
  data: MarketingTrendsResponse
  chartData: MarketingTrendsResponse["points"]
  onRetry: () => void
}) {
  const range = formatPeriodRange(data.period)
  const label = metricLabel(data.metric)

  return (
    <Card className="ring-1 ring-foreground/10">
      <CardHeader>
        <CardTitle className="font-heading text-base">{label} over time</CardTitle>
        <CardDescription>
          {range ? `${range}. ` : ""}
          Granularity: {data.granularity}. Empty buckets are shown as zero.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-4 sm:px-6">
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center gap-3">
            <p className="flex h-[280px] w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              No trend data for this range.
            </p>
            <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
              Refresh
            </Button>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
            <AreaChart data={chartData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="bucket"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatUtcDate(String(value))}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={(value) =>
                  data.metric === "gtv"
                    ? formatNgn(Number(value))
                    : Number(value).toLocaleString()
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => formatUtcDate(String(value))}
                    formatter={(value) =>
                      formatTrendValue(data.metric, Number(value))
                    }
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                fill="var(--color-value)"
                fillOpacity={0.2}
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
