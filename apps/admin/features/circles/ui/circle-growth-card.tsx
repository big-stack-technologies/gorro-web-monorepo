"use client"

import { useMemo, useState } from "react"
import { parseISO } from "date-fns"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { DatePicker } from "@gorro/ui/components/date-picker"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@gorro/ui/components/ui/chart"
import { Field, FieldGroup, FieldLabel } from "@gorro/ui/components/ui/field"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@gorro/ui/components/ui/toggle-group"
import { fillGrowthSeries } from "@/features/circles/growth"
import type { CircleGrowthGroup } from "@/features/circles/types"
import { CircleAnalyticsError } from "@/features/circles/ui/circle-analytics-error"
import { useCircleGrowth } from "@/features/circles/usecases"

const chartConfig = {
  circlesCreated: {
    label: "Circles created",
    color: "var(--chart-1)",
  },
  joins: {
    label: "Joins",
    color: "var(--chart-2)",
  },
  firstContributions: {
    label: "First contributions",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function CircleGrowthCard() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [groupBy, setGroupBy] = useState<CircleGrowthGroup>("month")

  const growth = useCircleGrowth({
    from: from || undefined,
    to: to || undefined,
    groupBy,
  })
  const chartData = useMemo(
    () => (growth.data ? fillGrowthSeries(growth.data) : []),
    [growth.data]
  )
  const totals = useMemo(
    () =>
      chartData.reduce(
        (sum, bucket) => ({
          joins: sum.joins + bucket.joins,
          firstContributions:
            sum.firstContributions + bucket.firstContributions,
        }),
        { joins: 0, firstContributions: 0 }
      ),
    [chartData]
  )

  if (growth.isError && !growth.data) {
    return (
      <CircleAnalyticsError
        title="Circle growth unavailable"
        error={growth.error}
        fallback="Could not load circle growth."
        onRetry={() => growth.refetch()}
      />
    )
  }

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <div className="flex min-w-0 flex-col gap-1.5">
          <CardTitle className="text-base">
            Joins vs first contributions
          </CardTitle>
          <CardDescription>
            {growth.data
              ? `${totals.joins.toLocaleString()} joins and ${totals.firstContributions.toLocaleString()} first contributions in this period. The gap between them is the conversion problem.`
              : "Circles created, members joining and first contributions over time."}
          </CardDescription>
        </div>
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end lg:w-fit lg:grid-cols-[24rem_auto] lg:self-end xl:self-start xl:justify-self-end">
          <FieldGroup className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
            <Field className="min-w-0">
              <FieldLabel htmlFor="circle-growth-from" className="text-xs">
                From
              </FieldLabel>
              <DatePicker
                id="circle-growth-from"
                value={from}
                onChange={setFrom}
                placeholder="First circle"
                maxDate={to ? parseISO(to) : undefined}
                className="h-8 min-w-0 overflow-hidden"
              />
            </Field>
            <Field className="min-w-0">
              <FieldLabel htmlFor="circle-growth-to" className="text-xs">
                To
              </FieldLabel>
              <DatePicker
                id="circle-growth-to"
                value={to}
                onChange={setTo}
                placeholder="Today"
                minDate={from ? parseISO(from) : undefined}
                className="h-8 min-w-0 overflow-hidden"
              />
            </Field>
          </FieldGroup>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={groupBy}
            onValueChange={(value) => {
              if (value) setGroupBy(value as CircleGrowthGroup)
            }}
            aria-label="Circle growth grouping"
            className="w-fit md:justify-self-end"
          >
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {growth.isLoading || !growth.data ? (
          <Skeleton className="h-72 w-full rounded-lg" />
        ) : chartData.length === 0 ? (
          <p className="flex h-72 items-center justify-center text-sm text-muted-foreground">
            No Circle activity in this period.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-72 w-full"
          >
            <BarChart data={chartData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={28}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="circlesCreated"
                fill="var(--color-circlesCreated)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="joins"
                fill="var(--color-joins)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="firstContributions"
                fill="var(--color-firstContributions)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
