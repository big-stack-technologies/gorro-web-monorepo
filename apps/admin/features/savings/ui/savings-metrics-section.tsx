"use client"

import { useMemo, useState } from "react"
import {
  AlertCircleIcon,
  CalendarDaysIcon,
  CoinsIcon,
  PiggyBankIcon,
  RefreshCwIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { Input } from "@gorro/ui/components/ui/input"
import { Label } from "@gorro/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gorro/ui/components/ui/select"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gorro/ui/components/ui/table"
import {
  getSavingsMetricsProductLabel,
  SAVINGS_CURRENCY,
  SAVINGS_OVERVIEW_PRODUCT_FILTER_OPTIONS,
} from "@/features/savings/constants"
import type { SavingsMetricsSummaryParams } from "@/features/savings/types"
import { useSavingsMetricsSummary } from "@/features/savings/usecases"
import { cn, formatCurrencyAmount } from "@gorro/ui/utils"

function formatCount(value: number) {
  if (value < 0) return "—"
  return value.toLocaleString()
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
}) {
  return (
    <Card className="border-border/80 bg-linear-to-br from-primary/[0.07] from-0% to-card to-45% shadow-sm ring-1 ring-border/50">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="min-w-0 space-y-1 pr-2">
          <CardDescription className="text-[0.7rem] font-medium tracking-wide uppercase">
            {label}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums tracking-tight text-foreground @container/card:text-3xl">
            {value}
          </CardTitle>
        </div>
        <div className="shrink-0 rounded-xl bg-primary/12 p-2.5 text-primary">
          <Icon className="size-4" aria-hidden />
        </div>
      </CardHeader>
      {hint ? (
        <CardContent className="pt-0 text-xs leading-relaxed text-muted-foreground">
          {hint}
        </CardContent>
      ) : null}
    </Card>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-border/80 ring-1 ring-border/50">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="w-full space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="size-10 shrink-0 rounded-xl" />
            </CardHeader>
          </Card>
        ))}
      </div>
      <Skeleton className="h-48 rounded-xl" />
    </div>
  )
}

export function SavingsMetricsSection() {
  const [product, setProduct] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const filters = useMemo((): SavingsMetricsSummaryParams => {
    const params: SavingsMetricsSummaryParams = {}
    if (product) params.product = product
    if (from) params.from = from
    if (to) params.to = to
    return params
  }, [product, from, to])

  const { data, isLoading, isFetching, isError, error, refetch } =
    useSavingsMetricsSummary(filters)

  if (isLoading) {
    return <AnalyticsSkeleton />
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col gap-4 rounded-xl border border-destructive/25 bg-destructive/6 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertCircleIcon className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-destructive">
              Couldn&apos;t load savings metrics
            </p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 transition-opacity duration-200",
        isFetching && "opacity-[0.88]"
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="metrics-product">Product</Label>
            <Select
              value={product || "__all__"}
              onValueChange={(v) => setProduct(v === "__all__" ? "" : v)}
            >
              <SelectTrigger id="metrics-product" className="w-[180px]">
                <SelectValue placeholder="All products" />
              </SelectTrigger>
              <SelectContent>
                {SAVINGS_OVERVIEW_PRODUCT_FILTER_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value || "__all__"}
                    value={opt.value || "__all__"}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="metrics-from">From</Label>
            <Input
              id="metrics-from"
              type="date"
              className="w-[160px]"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="metrics-to">To</Label>
            <Input
              id="metrics-to"
              type="date"
              className="w-[160px]"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh metrics"
          >
            <RefreshCwIcon
              className={cn("size-3.5", isFetching && "animate-spin")}
            />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={CoinsIcon}
          label="Total AUM"
          value={formatCurrencyAmount(data.blended.totalAum, SAVINGS_CURRENCY)}
        />
        <StatCard
          icon={PiggyBankIcon}
          label="Active accounts"
          value={formatCount(data.blended.activeAccounts)}
        />
        <StatCard
          icon={UsersIcon}
          label="Saving users"
          value={formatCount(data.blended.savingUsers)}
        />
      </div>

      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-base">By product</CardTitle>
          <CardDescription>Active accounts and AUM per product</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Accounts</TableHead>
                <TableHead className="text-right">AUM</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead className="text-right">Avg balance</TableHead>
                <TableHead className="text-right">New (week)</TableHead>
                <TableHead className="text-right">New (month)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.byProduct.map((row) => (
                <TableRow key={row.product}>
                  <TableCell className="font-medium">
                    {getSavingsMetricsProductLabel(row.product)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCount(row.activeAccounts)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrencyAmount(row.totalAum, SAVINGS_CURRENCY)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCount(row.uniqueUsers)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrencyAmount(
                      row.avgBalancePerUser,
                      SAVINGS_CURRENCY
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCount(row.newAccountsThisWeek)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCount(row.newAccountsThisMonth)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base">
              Maturity pipeline
            </CardTitle>
            <CardDescription>Upcoming maturities by window</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(
              [
                ["Next 7 days", data.maturityPipeline.next7Days],
                ["Next 30 days", data.maturityPipeline.next30Days],
                ["Next 90 days", data.maturityPipeline.next90Days],
              ] as const
            ).map(([label, bucket]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2"
              >
                <span className="text-sm text-muted-foreground">{label}</span>
                <div className="text-right">
                  <p className="text-sm font-medium tabular-nums">
                    {formatCount(bucket.count)} accounts
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {formatCurrencyAmount(bucket.amount, SAVINGS_CURRENCY)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-base">
              Early withdrawals
            </CardTitle>
            <CardDescription>Volume and rate in selected period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Count</span>
              <span className="font-medium tabular-nums">
                {formatCount(data.earlyWithdrawals.count)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Volume</span>
              <span className="font-medium tabular-nums">
                {formatCurrencyAmount(
                  data.earlyWithdrawals.volume,
                  SAVINGS_CURRENCY
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rate</span>
              <span className="font-medium tabular-nums">
                {data.earlyWithdrawals.ratePercent}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-base">Two-tier mix</CardTitle>
          <CardDescription>
            AUM below and above{" "}
            {formatCurrencyAmount(
              data.twoTierMix.thresholdNaira,
              SAVINGS_CURRENCY
            )}{" "}
            threshold
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Below threshold</p>
            <p className="text-lg font-semibold tabular-nums">
              {formatCurrencyAmount(
                data.twoTierMix.belowThresholdAum,
                SAVINGS_CURRENCY
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {data.twoTierMix.percentBelow}% of AUM
            </p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Above threshold</p>
            <p className="text-lg font-semibold tabular-nums">
              {formatCurrencyAmount(
                data.twoTierMix.aboveThresholdAum,
                SAVINGS_CURRENCY
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {data.twoTierMix.percentAbove}% of AUM
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-base flex items-center gap-2">
            <TrendingUpIcon className="size-4" aria-hidden />
            Cohorts by signup month
          </CardTitle>
          <CardDescription>Users and AUM by signup month</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {data.cohortsBySignupMonth.length === 0 ? (
            <p className="text-sm text-muted-foreground">No cohort data</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Users</TableHead>
                  <TableHead className="text-right">AUM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.cohortsBySignupMonth.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDaysIcon
                          className="size-3.5 text-muted-foreground"
                          aria-hidden
                        />
                        {row.month}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCount(row.users)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrencyAmount(row.aum, SAVINGS_CURRENCY)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {data.generatedAt ? (
        <p className="text-xs text-muted-foreground">
          Generated {new Date(data.generatedAt).toLocaleString()}
        </p>
      ) : null}
    </div>
  )
}
