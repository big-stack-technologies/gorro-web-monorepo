"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import { ReceiptIcon, SigmaIcon, WalletIcon } from "lucide-react"

import { AnalyticsStatCard } from "@gorro/ui/components/analytics-stat-card"
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
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import { formatUtcDate } from "@gorro/ui/utils"

import { CgaSortableTable } from "@/features/cgas/ui/cga-sortable-table"
import { financeDailyColumns } from "@/features/finance/columns/finance-daily.columns"
import { PARTIAL_FALLBACK_REASON } from "@/features/finance/constants"
import {
  formatFinanceRange,
  formatKobo,
  formatKoboCompact,
  gapFillDailyRows,
} from "@/features/finance/format"
import type {
  FinanceDailyResponse,
  FinancePeriodFilters,
} from "@/features/finance/types"
import { useFinanceDaily } from "@/features/finance/usecases"
import {
  FinanceNote,
  FinancePartialBanner,
  FinanceSectionError,
} from "@/features/finance/ui/finance-states"
import { SectionHeading } from "@/features/overview/ui/section"

const flowChartConfig = {
  totalRevenueMinorUnits: { label: "Revenue", color: "var(--chart-1)" },
  totalCostMinorUnits: { label: "Cost", color: "var(--chart-2)" },
} satisfies ChartConfig

// Neutral colour on purpose: red/green would read the partial net as a loss/profit.
const cumulativeChartConfig = {
  cumulativeNetMinorUnits: {
    label: "Running net (partial)",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

const SERIES_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries({ ...flowChartConfig, ...cumulativeChartConfig }).map(
    ([key, config]) => [key, config.label]
  )
)

function DailyCharts({ data }: { data: FinanceDailyResponse }) {
  const rows = React.useMemo(() => gapFillDailyRows(data), [data])

  if (data.days.length === 0) {
    return (
      <p className="flex h-[200px] w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        No finance activity in this range.
      </p>
    )
  }

  const xAxis = (
    <XAxis
      dataKey="date"
      tickLine={false}
      axisLine={false}
      tickMargin={8}
      minTickGap={24}
      tickFormatter={(value) => formatUtcDate(String(value))}
    />
  )
  const yAxis = (
    <YAxis
      tickLine={false}
      axisLine={false}
      width={64}
      tickFormatter={(value) => formatKoboCompact(Number(value))}
    />
  )
  const tooltip = (
    <ChartTooltip
      content={
        <ChartTooltipContent
          labelFormatter={(value) => formatUtcDate(String(value))}
          formatter={(value, name) => (
            <div className="flex w-full items-center justify-between gap-4">
              <span className="text-muted-foreground">
                {SERIES_LABELS[String(name)] ?? String(name)}
              </span>
              <span className="font-mono tabular-nums">
                {formatKobo(Number(value))}
              </span>
            </div>
          )}
        />
      }
    />
  )

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card className="ring-1 ring-foreground/10">
        <CardHeader>
          <CardTitle className="font-heading text-base">
            Daily revenue vs cost
          </CardTitle>
          <CardDescription>
            Days without activity are shown as zero.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-4 sm:px-6">
          <ChartContainer
            config={flowChartConfig}
            className="aspect-auto h-[260px] w-full"
          >
            <BarChart data={rows} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              {xAxis}
              {yAxis}
              {tooltip}
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="totalRevenueMinorUnits"
                fill="var(--color-totalRevenueMinorUnits)"
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="totalCostMinorUnits"
                fill="var(--color-totalCostMinorUnits)"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="ring-1 ring-foreground/10">
        <CardHeader>
          <CardTitle className="font-heading text-base">
            Running net (partial)
          </CardTitle>
          <CardDescription>
            Cumulative revenue minus cost. Missing its largest revenue line —
            see the banner above.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pb-4 sm:px-6">
          <ChartContainer
            config={cumulativeChartConfig}
            className="aspect-auto h-[260px] w-full"
          >
            <AreaChart data={rows} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              {xAxis}
              {yAxis}
              {tooltip}
              <Area
                type="stepAfter"
                dataKey="cumulativeNetMinorUnits"
                stroke="var(--color-cumulativeNetMinorUnits)"
                fill="var(--color-cumulativeNetMinorUnits)"
                fillOpacity={0.15}
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

function DailyContent({ data }: { data: FinanceDailyResponse }) {
  const partialReason = data.partialReason || PARTIAL_FALLBACK_REASON

  return (
    <div className="flex flex-col gap-4">
      {data.partial ? <FinancePartialBanner reason={partialReason} /> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AnalyticsStatCard
          icon={WalletIcon}
          label="Revenue"
          value={formatKobo(data.totals.totalRevenueMinorUnits)}
          hint={formatFinanceRange(data)}
        />
        <AnalyticsStatCard
          icon={ReceiptIcon}
          label="Cost"
          value={formatKobo(data.totals.totalCostMinorUnits)}
          hint="Processor charges and interest paid to customers."
        />
        <AnalyticsStatCard
          icon={SigmaIcon}
          label={data.partial ? "Net position (partial)" : "Net position"}
          value={formatKobo(data.totals.netMinorUnits)}
          hint={
            data.partial ? (
              <FinanceNote tone="warning">
                Not a profit or loss figure. {partialReason}
              </FinanceNote>
            ) : (
              "Revenue minus cost for the range."
            )
          }
        />
      </div>

      <DailyCharts data={data} />

      <CgaSortableTable
        data={data.days}
        columns={financeDailyColumns}
        isLoading={false}
        defaultSorting={[{ id: "date", desc: true }]}
        emptyMessage="No finance activity in this range."
      />
    </div>
  )
}

export function DailyPanel({ filters }: { filters: FinancePeriodFilters }) {
  const { data, isLoading, error, refetch } = useFinanceDaily(filters)

  return (
    <section className="space-y-4">
      <SectionHeading
        title="Daily net position"
        description="Realised revenue against costs, day by day, with a running total."
      />
      {isLoading && !data ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : null}
      {error ? (
        <FinanceSectionError
          error={error}
          onRetry={() => {
            void refetch()
          }}
        />
      ) : null}
      {data && !error ? <DailyContent data={data} /> : null}
    </section>
  )
}
