"use client"

import { useMemo, useState } from "react"
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  format,
  isValid,
  parseISO,
} from "date-fns"
import {
  ActivityIcon,
  BanknoteIcon,
  Layers3Icon,
  RefreshCwIcon,
  UsersRoundIcon,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { AnalyticsStatCard } from "@gorro/ui/components/analytics-stat-card"
import { Button } from "@gorro/ui/components/ui/button"
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@gorro/ui/components/ui/chart"
import { Field, FieldGroup, FieldLabel } from "@gorro/ui/components/ui/field"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@gorro/ui/components/ui/toggle-group"
import { CLUSTER_CURRENCY } from "@/features/clusters/constants"
import type {
  TopClusterByActivity,
  TopClusterByBalance,
  WithdrawalVolume,
  WithdrawalVolumeBucket,
  WithdrawalVolumeGroup,
} from "@/features/clusters/types"
import {
  useClustersOverview,
  useClusterWithdrawalVolume,
  useTopClustersByActivity,
  useTopClustersByBalance,
} from "@/features/clusters/usecases"
import { cn, formatCurrencyAmount } from "@gorro/ui/utils"

const chartConfig = {
  totalNaira: {
    label: "Completed withdrawal volume",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function periodKey(date: Date, groupBy: WithdrawalVolumeGroup): string {
  if (groupBy === "month") return format(date, "yyyy-MM")
  if (groupBy === "week") return format(date, "RRRR-'W'II")
  return format(date, "yyyy-MM-dd")
}

function fillWithdrawalBuckets(
  data: WithdrawalVolume
): WithdrawalVolumeBucket[] {
  const start = parseISO(data.from)
  const end = parseISO(data.to)
  if (!isValid(start) || !isValid(end) || start > end) return data.buckets

  const dates =
    data.groupBy === "month"
      ? eachMonthOfInterval({ start, end })
      : data.groupBy === "week"
        ? eachWeekOfInterval({ start, end }, { weekStartsOn: 1 })
        : eachDayOfInterval({ start, end })
  const byPeriod = new Map(
    data.buckets.map((bucket) => [bucket.period, bucket])
  )

  return dates.map((date) => {
    const period = periodKey(date, data.groupBy)
    return byPeriod.get(period) ?? { period, count: 0, totalNaira: 0 }
  })
}

function RankingTable({
  rows,
  kind,
}: {
  rows: TopClusterByBalance[] | TopClusterByActivity[]
  kind: "balance" | "activity"
}) {
  if (rows.length === 0) {
    return (
      <p className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No ranking data available.
      </p>
    )
  }

  return (
    <div className="flex flex-col divide-y">
      {rows.map((row) => {
        const value =
          kind === "balance"
            ? formatCurrencyAmount(
                (row as TopClusterByBalance).balanceNaira,
                CLUSTER_CURRENCY
              )
            : `${(row as TopClusterByActivity).transactionCount.toLocaleString()} transactions`
        return (
          <div
            key={row.clusterId}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-xs font-medium">
              {row.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{row.clusterName}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {row.clusterCode} · {row.memberCount.toLocaleString()} members
              </p>
            </div>
            <span className="shrink-0 text-sm font-medium tabular-nums">
              {value}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function ClustersAnalyticsSection() {
  const [activityFrom, setActivityFrom] = useState("")
  const [activityTo, setActivityTo] = useState("")
  const [volumeFrom, setVolumeFrom] = useState("")
  const [volumeTo, setVolumeTo] = useState("")
  const [groupBy, setGroupBy] = useState<WithdrawalVolumeGroup>("day")

  const overview = useClustersOverview()
  const topBalance = useTopClustersByBalance(5)
  const topActivity = useTopClustersByActivity({
    limit: 5,
    from: activityFrom || undefined,
    to: activityTo || undefined,
  })
  const volume = useClusterWithdrawalVolume({
    from: volumeFrom || undefined,
    to: volumeTo || undefined,
    groupBy,
  })
  const chartData = useMemo(
    () => (volume.data ? fillWithdrawalBuckets(volume.data) : []),
    [volume.data]
  )

  if (overview.isLoading && !overview.data) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  if (overview.isError || !overview.data) {
    return (
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-base">
            Cluster analytics unavailable
          </CardTitle>
          <CardDescription className="text-destructive">
            {overview.error instanceof Error
              ? overview.error.message
              : "Could not load cluster analytics."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => overview.refetch()}
          >
            <RefreshCwIcon data-icon="inline-start" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const data = overview.data

  return (
    <section className="flex flex-col gap-4" aria-label="Cluster analytics">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsStatCard
          icon={Layers3Icon}
          label="Total clusters"
          value={data.clustersByStatus.total.toLocaleString()}
        />
        <AnalyticsStatCard
          icon={ActivityIcon}
          label="Active clusters"
          value={data.clustersByStatus.active.toLocaleString()}
        />
        <AnalyticsStatCard
          icon={BanknoteIcon}
          label="Assets under management"
          value={formatCurrencyAmount(data.totalAumNaira, CLUSTER_CURRENCY)}
        />
        <AnalyticsStatCard
          icon={UsersRoundIcon}
          label="Active members"
          value={data.totalMembers.toLocaleString()}
        />
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
          <div className="flex min-w-0 flex-col gap-1.5">
            <CardTitle className="text-base">
              Completed withdrawal volume
            </CardTitle>
            <CardDescription>
              {volume.data
                ? `${volume.data.totalCount.toLocaleString()} withdrawals totaling ${formatCurrencyAmount(volume.data.totalNaira, CLUSTER_CURRENCY)}`
                : "Completed cluster withdrawals over time."}
            </CardDescription>
          </div>
          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end lg:w-fit lg:grid-cols-[24rem_auto] lg:self-end xl:self-start xl:justify-self-end">
            <FieldGroup className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
              <Field className="min-w-0">
                <FieldLabel htmlFor="cluster-volume-from" className="text-xs">
                  From
                </FieldLabel>
                <DatePicker
                  id="cluster-volume-from"
                  value={volumeFrom}
                  onChange={setVolumeFrom}
                  placeholder="Start date"
                  maxDate={volumeTo ? parseISO(volumeTo) : undefined}
                  className="h-8 min-w-0 overflow-hidden"
                />
              </Field>
              <Field className="min-w-0">
                <FieldLabel htmlFor="cluster-volume-to" className="text-xs">
                  To
                </FieldLabel>
                <DatePicker
                  id="cluster-volume-to"
                  value={volumeTo}
                  onChange={setVolumeTo}
                  placeholder="End date"
                  minDate={volumeFrom ? parseISO(volumeFrom) : undefined}
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
                if (value) setGroupBy(value as WithdrawalVolumeGroup)
              }}
              aria-label="Withdrawal chart grouping"
              className="w-fit md:justify-self-end"
            >
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          {volume.isLoading ? (
            <Skeleton className="h-72 w-full rounded-lg" />
          ) : volume.isError ? (
            <p className="flex h-72 items-center justify-center text-sm text-destructive">
              {volume.error instanceof Error
                ? volume.error.message
                : "Could not load withdrawal volume."}
            </p>
          ) : chartData.length === 0 ? (
            <p className="flex h-72 items-center justify-center text-sm text-muted-foreground">
              No completed withdrawals in this period.
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
                <YAxis hide />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) =>
                        formatCurrencyAmount(Number(value), CLUSTER_CURRENCY)
                      }
                    />
                  }
                />
                <Bar
                  dataKey="totalNaira"
                  fill="var(--color-totalNaira)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card
          className={cn(
            "border-border/80 shadow-sm",
            topBalance.isFetching && "opacity-90"
          )}
        >
          <CardHeader>
            <CardTitle className="text-base">Top balances</CardTitle>
            <CardDescription>
              Active clusters with the highest ledger balances.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topBalance.isLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : topBalance.isError ? (
              <p className="text-sm text-destructive">
                Could not load balance rankings.
              </p>
            ) : (
              <RankingTable rows={topBalance.data ?? []} kind="balance" />
            )}
          </CardContent>
        </Card>

        <Card
          className={cn(
            "border-border/80 shadow-sm",
            topActivity.isFetching && "opacity-90"
          )}
        >
          <CardHeader className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <CardTitle className="text-base">Top activity</CardTitle>
              <CardDescription>
                Clusters ranked by posted transactions.
              </CardDescription>
            </div>
            <FieldGroup className="grid w-full grid-cols-1 gap-2 sm:max-w-lg sm:grid-cols-2">
              <Field className="min-w-0">
                <FieldLabel htmlFor="cluster-activity-from" className="text-xs">
                  From
                </FieldLabel>
                <DatePicker
                  id="cluster-activity-from"
                  value={activityFrom}
                  onChange={setActivityFrom}
                  placeholder="Start date"
                  maxDate={activityTo ? parseISO(activityTo) : undefined}
                  className="h-8 min-w-0 overflow-hidden"
                />
              </Field>
              <Field className="min-w-0">
                <FieldLabel htmlFor="cluster-activity-to" className="text-xs">
                  To
                </FieldLabel>
                <DatePicker
                  id="cluster-activity-to"
                  value={activityTo}
                  onChange={setActivityTo}
                  placeholder="End date"
                  minDate={activityFrom ? parseISO(activityFrom) : undefined}
                  className="h-8 min-w-0 overflow-hidden"
                />
              </Field>
            </FieldGroup>
          </CardHeader>
          <CardContent>
            {topActivity.isLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : topActivity.isError ? (
              <p className="text-sm text-destructive">
                Could not load activity rankings.
              </p>
            ) : (
              <RankingTable rows={topActivity.data ?? []} kind="activity" />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
