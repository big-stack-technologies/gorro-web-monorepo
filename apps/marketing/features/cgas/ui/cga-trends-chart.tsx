"use client"

import * as React from "react"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts"

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
import { formatUtcDate } from "@gorro/ui/utils"

import { useCgaMetricsTrends } from "@/features/cgas/usecases"
import type { CgaTrendsFilters } from "@/features/cgas/types"

const chartConfig = {
  newReferrals: {
    label: "New referrals",
    color: "var(--chart-1)",
  },
  bonusPaid: {
    label: "Bonus paid",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function CgaTrendsChart({
  filters,
  embedded = false,
}: {
  filters: CgaTrendsFilters
  embedded?: boolean
}) {
  const { data, isLoading, isError, error, refetch } =
    useCgaMetricsTrends(filters)

  const chartData = React.useMemo(() => {
    return [...(data?.series ?? [])].sort(
      (a, b) => new Date(a.period).getTime() - new Date(b.period).getTime()
    )
  }, [data?.series])

  if (isLoading && !data) {
    return <Skeleton className="h-70 w-full rounded-xl" />
  }

  const chartDescription = (
    <>
      {filters.email || filters.phone
        ? "Filtered to one CGA."
        : "All CGAs in the selected range."}{" "}
      Interval: {data?.interval ?? filters.interval ?? "month"}.
    </>
  )

  const chartBody = (
    <>
        {chartData.length === 0 ? (
          <p className="flex h-[250px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            No trend data for this range.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <ComposedChart data={chartData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatUtcDate(String(value))}
              />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} width={40} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                width={48}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => formatUtcDate(String(value))}
                  />
                }
              />
              <Bar
                yAxisId="left"
                dataKey="newReferrals"
                fill="var(--color-newReferrals)"
                radius={4}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bonusPaid"
                stroke="var(--color-bonusPaid)"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        )}
    </>
  )

  if (isError) {
    const errorBlock = (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Could not load chart."}
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => refetch()}
        >
          Try again
        </Button>
      </div>
    )
    if (embedded) return errorBlock
    return (
      <Card className="ring-1 ring-foreground/10">
        <CardHeader>
          <CardTitle className="text-base">Referrals & bonus trends</CardTitle>
        </CardHeader>
        <CardContent>{errorBlock}</CardContent>
      </Card>
    )
  }

  if (embedded) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{chartDescription}</p>
        {chartBody}
      </div>
    )
  }

  return (
    <Card className="ring-1 ring-foreground/10">
      <CardHeader>
        <CardTitle className="font-heading text-base">
          Referrals & bonus trends
        </CardTitle>
        <CardDescription>{chartDescription}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-4 sm:px-6">{chartBody}</CardContent>
    </Card>
  )
}
