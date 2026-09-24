"use client"

import * as React from "react"
import {
  AlertCircleIcon,
  ArrowLeftRightIcon,
  CoinsIcon,
  Loader2Icon,
  ReceiptIcon,
  RefreshCwIcon,
  ShieldAlertIcon,
  UsersIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { Separator } from "@gorro/ui/components/ui/separator"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gorro/ui/components/ui/tabs"
import {
  DASHBOARD_PERIODS,
  DEFAULT_DASHBOARD_PERIOD,
} from "@/features/dashboard/constants"
import { TransactionVolumeChart } from "@/features/dashboard/ui/transaction-volume-chart"
import { UserGrowthChart } from "@/features/dashboard/ui/user-growth-chart"
import { useDashboardSummary } from "@/features/dashboard/usecases"
import type { DashboardPeriod } from "@/features/dashboard/types"
import {
  cn,
  formatCurrencyAmount,
  formatCurrencyFromMinorUnits,
  formatDateTime,
  formatSnakeCaseWords,
} from "@gorro/ui/utils"

function formatCount(value: number) {
  if (value < 0) return "—"
  return value.toLocaleString()
}

function MetricRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums font-medium text-foreground">{value}</span>
    </div>
  )
}

function BreakdownChips({
  entries,
}: {
  entries: Record<string, number> | undefined
}) {
  const pairs = Object.entries(entries ?? {}).filter(
    ([, n]) => typeof n === "number" && !Number.isNaN(n)
  )
  if (pairs.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/20 px-3 py-6 text-center text-sm text-muted-foreground">
        Nothing in this period
      </p>
    )
  }
  return (
    <div className="flex flex-wrap gap-2">
      {pairs.map(([key, n]) => (
        <Badge
          key={key}
          variant="secondary"
          className="gap-2 py-1.5 pl-2.5 pr-2 font-normal"
        >
          <span className="max-w-40 truncate">
            {formatSnakeCaseWords(key)}
          </span>
          <span className="tabular-nums font-semibold text-foreground">
            {n.toLocaleString()}
          </span>
        </Badge>
      ))}
    </div>
  )
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

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="border-border/80 ring-1 ring-border/50"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="w-full space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-28" />
              </div>
              <Skeleton className="size-10 shrink-0 rounded-xl" />
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  )
}

export function DashboardPage() {
  const [period, setPeriod] = React.useState<DashboardPeriod>(
    DEFAULT_DASHBOARD_PERIOD
  )
  const { data, isLoading, isFetching, isError, error, refetch } =
    useDashboardSummary(period)

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <div className="flex flex-col gap-6 border-b border-border/70 pb-6 md:flex-row md:items-start md:justify-between">
        <AdminPageHeader
          title="Dashboard"
          description="Users, ledger activity, AML, and fees — switch the reporting window anytime."
          className="max-w-xl"
        />
        <div className="flex w-full flex-col gap-3 sm:max-w-md sm:items-end md:w-auto">
          <div className="flex w-full flex-col gap-2 sm:items-end">
            <span className="text-xs font-medium text-muted-foreground">
              Reporting period
            </span>
            <div
              className="inline-flex w-full rounded-xl border border-border bg-muted/40 p-1 sm:w-auto"
              role="group"
              aria-label="Reporting period"
            >
              {DASHBOARD_PERIODS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPeriod(p.value)}
                  className={cn(
                    "min-h-9 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all sm:flex-none sm:px-4",
                    period === p.value
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                      : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {data ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:justify-end">
              {isFetching ? (
                <Loader2Icon
                  className="size-3.5 shrink-0 animate-spin text-muted-foreground"
                  aria-hidden
                />
              ) : null}
              <span>
                Updated {formatDateTime(data.lastUpdated)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={() => refetch()}
                disabled={isFetching}
                aria-label="Refresh dashboard"
              >
                <RefreshCwIcon
                  className={cn("size-3.5", isFetching && "animate-spin")}
                />
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {isError ? (
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
                Couldn&apos;t load dashboard
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
      ) : null}

      {isLoading && !data ? <DashboardSkeleton /> : null}

      {data ? (
        <div
          className={cn(
            "flex flex-col gap-10 transition-opacity duration-200",
            isFetching && "opacity-[0.88]"
          )}
        >
          <section className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-heading text-sm font-semibold tracking-tight text-foreground">
                At a glance
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={UsersIcon}
                label="Total users"
                value={formatCount(data.users.totalUsers)}
                hint={
                  <>
                    <span className="font-medium text-foreground">
                      {formatCount(data.users.activeUsers)}
                    </span>{" "}
                    active
                  </>
                }
              />
              <StatCard
                icon={ArrowLeftRightIcon}
                label="Transactions"
                value={data.transactions.totalTransactions.toLocaleString()}
                hint={
                  <>
                    Avg.{" "}
                    {formatCurrencyFromMinorUnits(
                      data.transactions.averageTransactionValue,
                      data.transactions.currency
                    )}
                  </>
                }
              />
              <StatCard
                icon={CoinsIcon}
                label="Volume"
                value={formatCurrencyFromMinorUnits( //formatCurrencyAmount
                  data.transactions.totalValue,
                  data.transactions.currency
                )}
                hint={data.transactions.currency}
              />
              <StatCard
                icon={ShieldAlertIcon}
                label="AML in review"
                value={data.aml.pendingReview.toLocaleString()}
                hint={
                  <>
                    {data.aml.totalFlagged.toLocaleString()} total flagged
                  </>
                }
              />
            </div>
          </section>

          <UserGrowthChart />

          <TransactionVolumeChart currency={data.transactions.currency} />

          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base">Users</CardTitle>
                <CardDescription>
                  Verification and growth (monthly new users are calendar-based)
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/60 px-0">
                <div className="px-6">
                  <MetricRow
                    label="Verified"
                    value={formatCount(data.users.verifiedUsers)}
                  />
                </div>
                <div className="px-6">
                  <MetricRow
                    label="Unverified"
                    value={formatCount(data.users.unverifiedUsers)}
                  />
                </div>
                <div className="px-6">
                  <MetricRow
                    label="New this month"
                    value={data.users.newUsersThisMonth.toLocaleString()}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-base">
                  Transactions
                </CardTitle>
                <CardDescription>
                  How activity splits for this period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="type" className="gap-4">
                  <TabsList className="grid h-9 w-full grid-cols-3">
                    <TabsTrigger value="type" className="text-xs sm:text-sm">
                      Type
                    </TabsTrigger>
                    <TabsTrigger value="status" className="text-xs sm:text-sm">
                      Status
                    </TabsTrigger>
                    <TabsTrigger
                      value="direction"
                      className="text-xs sm:text-sm"
                    >
                      Direction
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="type" className="mt-0 pt-1">
                    <BreakdownChips
                      entries={
                        data.transactions.byType as Record<string, number>
                      }
                    />
                  </TabsContent>
                  <TabsContent value="status" className="mt-0 pt-1">
                    <BreakdownChips
                      entries={
                        data.transactions.byStatus as Record<string, number>
                      }
                    />
                  </TabsContent>
                  <TabsContent value="direction" className="mt-0 pt-1">
                    <BreakdownChips
                      entries={
                        data.transactions.byDirection as Record<string, number>
                      }
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          <Separator className="bg-border/60" />

          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base">AML</CardTitle>
                <CardDescription>Review outcomes and flags</CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/60 px-0">
                <div className="px-6">
                  <MetricRow
                    label="Approved"
                    value={data.aml.approved.toLocaleString()}
                  />
                </div>
                <div className="px-6">
                  <MetricRow
                    label="Rejected"
                    value={data.aml.rejected.toLocaleString()}
                  />
                </div>
                <div className="px-6">
                  <MetricRow
                    label="Recent flags (items)"
                    value={data.aml.recentFlags.length.toLocaleString()}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <ReceiptIcon className="size-4 text-muted-foreground" />
                  <CardTitle className="font-heading text-base">Revenue</CardTitle>
                </div>
                <CardDescription>Fees recorded in this period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-baseline justify-between gap-4 rounded-lg bg-muted/30 px-3 py-3">
                  <span className="text-sm text-muted-foreground">Total fees</span>
                  <span className="text-lg font-semibold tabular-nums tracking-tight">
                    {formatCurrencyAmount(
                      data.revenue.totalFees,
                      data.revenue.currency
                    )}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
                    By fee type
                  </p>
                  <BreakdownChips entries={data.revenue.feesByType} />
                </div>
                <div className="space-y-2">
                  <p className="text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
                    Monthly fees
                  </p>
                  <BreakdownChips entries={data.revenue.monthlyFees} />
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      ) : null}
    </div>
  )
}
