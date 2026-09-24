"use client"

import * as React from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts"

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
  type ChartConfig,
} from "@gorro/ui/components/ui/chart"
import { Button } from "@gorro/ui/components/ui/button"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import { useTransactionsVolume } from "@/features/dashboard/usecases"
import type { TransactionVolumePoint } from "@/features/dashboard/types"
import { cn, formatCurrencyAmount } from "@gorro/ui/utils"

const chartConfig = {
  successCount: {
    label: "Posted",
    color: "var(--chart-1)",
  },
  failureCount: {
    label: "Failed",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function TooltipSeriesRow({
  colorVar,
  label,
  children,
}: {
  colorVar: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full items-center gap-2">
      <div
        className="h-2.5 w-2.5 shrink-0 rounded-[2px] border"
        style={
          {
            backgroundColor: colorVar,
            borderColor: colorVar,
          } as React.CSSProperties
        }
        aria-hidden
      />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
        {children}
      </span>
    </div>
  )
}

function TooltipMetricRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium tabular-nums text-foreground">
        {children}
      </span>
    </div>
  )
}

function OutcomeTooltipBody({
  row,
  currency,
}: {
  row: TransactionVolumePoint
  currency: string
}) {
  return (
    <div className="grid min-w-44 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <p className="font-medium">
        {new Date(row.date).toLocaleDateString(undefined, {
          dateStyle: "medium",
        })}
      </p>
      <div className="grid gap-1.5">
        <TooltipSeriesRow colorVar="var(--chart-1)" label="Posted">
          {row.successCount.toLocaleString()}
        </TooltipSeriesRow>
        <TooltipSeriesRow colorVar="var(--chart-2)" label="Failed">
          {row.failureCount.toLocaleString()}
        </TooltipSeriesRow>
      </div>
      <div className="grid gap-1.5 border-t border-border/50 pt-1.5">
        <TooltipMetricRow label="Volume">
          {formatCurrencyAmount(row.value, currency)}
        </TooltipMetricRow>
        <TooltipMetricRow label="Transactions">
          {row.count.toLocaleString()}
        </TooltipMetricRow>
      </div>
    </div>
  )
}

type TransactionVolumeChartProps = {
  currency: string
}

export function TransactionVolumeChart({ currency }: TransactionVolumeChartProps) {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useTransactionsVolume()

  const chartData = React.useMemo(() => {
    const rows = data ?? []
    return [...rows].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }, [data])

  if (isLoading && !data) {
    return (
      <Card className="@container/card border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </CardHeader>
        <CardContent className="px-2 pt-2 sm:px-6">
          <Skeleton className="aspect-auto h-[250px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader>
          <CardTitle className="font-heading text-base">
            Transaction outcomes
          </CardTitle>
          <CardDescription className="text-destructive">
            {error instanceof Error ? error.message : "Could not load chart."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="secondary" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const empty = !chartData.length

  return (
    <Card
      className={cn(
        "@container/card border-border/80 shadow-sm ring-1 ring-border/40",
        isFetching && "opacity-90"
      )}
    >
      <CardHeader>
        <CardTitle className="font-heading text-base">
          Transaction outcomes
        </CardTitle>
        <CardDescription>
          Posted vs failed transaction counts per day over the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {empty ? (
          <p className="flex h-[250px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-sm text-muted-foreground">
            No transaction data for the last 30 days.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <ComposedChart data={chartData} margin={{ left: 0, right: 0 }}>
              <defs>
                <linearGradient id="fillTxSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-successCount)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-successCount)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={28}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis yAxisId="left" hide />
              <YAxis yAxisId="right" orientation="right" hide />
              <ChartTooltip
                cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                content={({ active, payload }) => {
                  const row = payload?.[0]?.payload as
                    | TransactionVolumePoint
                    | undefined
                  if (!active || !row) return null
                  return (
                    <OutcomeTooltipBody row={row} currency={currency} />
                  )
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="successCount"
                name="successCount"
                fill="url(#fillTxSuccess)"
                stroke="var(--color-successCount)"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="failureCount"
                name="failureCount"
                stroke="var(--color-failureCount)"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
