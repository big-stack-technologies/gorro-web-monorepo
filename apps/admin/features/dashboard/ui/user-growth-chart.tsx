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
  ChartTooltipContent,
  type ChartConfig,
} from "@gorro/ui/components/ui/chart"
import { Button } from "@gorro/ui/components/ui/button"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import { useUsersGrowth } from "@/features/dashboard/usecases"
import { cn } from "@gorro/ui/utils"

const chartConfig = {
  cumulativeUsers: {
    label: "Total users",
    color: "var(--chart-1)",
  },
  newUsers: {
    label: "New users",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function UserGrowthChart() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useUsersGrowth()

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
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64 max-w-full" />
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
          <CardTitle className="font-heading text-base">User growth</CardTitle>
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
        <CardTitle className="font-heading text-base">User growth</CardTitle>
        <CardDescription>
          Daily new signups and cumulative total users over the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {empty ? (
          <p className="flex h-[250px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-sm text-muted-foreground">
            No growth data for the last 30 days.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <ComposedChart data={chartData} margin={{ left: 0, right: 0 }}>
              <defs>
                <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-cumulativeUsers)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-cumulativeUsers)"
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
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value as string).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="cumulativeUsers"
                name="cumulativeUsers"
                fill="url(#fillCumulative)"
                stroke="var(--color-cumulativeUsers)"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="newUsers"
                name="newUsers"
                stroke="var(--color-newUsers)"
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
