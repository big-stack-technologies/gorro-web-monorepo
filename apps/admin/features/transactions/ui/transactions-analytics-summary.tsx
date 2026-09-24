"use client"

import {
  AlertCircleIcon,
  ArrowLeftRightIcon,
  CoinsIcon,
  Loader2Icon,
  RefreshCwIcon,
  SigmaIcon,
} from "lucide-react"

import { AnalyticsStatCard } from "@gorro/ui/components/analytics-stat-card"
import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gorro/ui/components/ui/tabs"
import { useTransactionsAnalyticsSummary } from "@/features/transactions/usecases"
import { cn, formatCurrencyFromMinorUnits, formatSnakeCaseWords } from "@gorro/ui/utils"

function BreakdownChips({
  entries,
}: {
  entries: Partial<Record<string, number>> | undefined
}) {
  const pairs = Object.entries(entries ?? {}).filter(
    (e): e is [string, number] =>
      typeof e[1] === "number" && !Number.isNaN(e[1])
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

function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-border/80 ring-1 ring-border/50">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="w-full space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="size-10 shrink-0 rounded-xl" />
            </CardHeader>
          </Card>
        ))}
      </div>
      <Skeleton className="h-56 rounded-xl" />
    </div>
  )
}

export function TransactionsAnalyticsSection() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useTransactionsAnalyticsSummary()

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
              Couldn&apos;t load transaction analytics
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-sm font-semibold tracking-tight text-foreground">
          Overview
        </h2>
        <div className="flex items-center gap-2">
          {isFetching ? (
            <Loader2Icon
              className="size-3.5 shrink-0 animate-spin text-muted-foreground"
              aria-hidden
            />
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh analytics"
          >
            <RefreshCwIcon
              className={cn("size-3.5", isFetching && "animate-spin")}
            />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnalyticsStatCard
          icon={ArrowLeftRightIcon}
          label="Total transactions"
          value={data.totalTransactions.toLocaleString()}
        />
        <AnalyticsStatCard
          icon={CoinsIcon}
          label="Total value"
          value={formatCurrencyFromMinorUnits(data.totalValue, data.currency)}
          hint={data.currency}
        />
        <AnalyticsStatCard
          icon={SigmaIcon}
          label="Average transaction"
          value={formatCurrencyFromMinorUnits(
            data.averageTransactionValue,
            data.currency
          )}
        />
      </div>

      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-base">Breakdown</CardTitle>
          <CardDescription>Counts by type, status, and direction</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="type" className="gap-4">
            <TabsList className="h-9 w-fit justify-start">
              <TabsTrigger value="type" className="flex-none text-xs sm:text-sm">
                Type
              </TabsTrigger>
              <TabsTrigger value="status" className="flex-none text-xs sm:text-sm">
                Status
              </TabsTrigger>
              <TabsTrigger value="direction" className="flex-none text-xs sm:text-sm">
                Direction
              </TabsTrigger>
            </TabsList>
            <TabsContent value="type" className="mt-0 pt-1">
              <BreakdownChips entries={data.byType} />
            </TabsContent>
            <TabsContent value="status" className="mt-0 pt-1">
              <BreakdownChips entries={data.byStatus} />
            </TabsContent>
            <TabsContent value="direction" className="mt-0 pt-1">
              <BreakdownChips entries={data.byDirection} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
