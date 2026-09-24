"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  Loader2Icon,
  RefreshCwIcon,
  ShieldAlertIcon,
  XCircleIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gorro/ui/components/ui/table"
import { useAmlFlagsAnalytics } from "@/features/transactions/usecases"
import type { AmlRecentFlag } from "@/features/transactions/types"
import { cn, formatCurrencyAmount, formatDateTime } from "@gorro/ui/utils"

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: ReactNode
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
    </Card>
  )
}

function AmlFlagsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/80 ring-1 ring-border/50">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="w-full space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="size-10 shrink-0 rounded-xl" />
            </CardHeader>
          </Card>
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}

function RecentFlagsTable({ flags }: { flags: AmlRecentFlag[] }) {
  if (flags.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/20 px-3 py-8 text-center text-sm text-muted-foreground">
        No recent AML flags.
      </p>
    )
  }

  return (
    <div className="max-h-[min(24rem,50vh)] overflow-auto rounded-md border border-border/60">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="whitespace-nowrap">Transaction</TableHead>
            <TableHead className="whitespace-nowrap">Initiator</TableHead>
            <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
            <TableHead className="min-w-[8rem]">Reason</TableHead>
            <TableHead className="whitespace-nowrap">Flagged</TableHead>
            <TableHead className="whitespace-nowrap">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flags.map((flag) => (
            <TableRow key={`${flag.transactionId}-${flag.flaggedAt}`}>
              <TableCell className="font-medium">
                <Link
                  href={`/admin/transactions/${encodeURIComponent(flag.transactionId)}`}
                  className="text-primary hover:underline"
                >
                  {flag.transactionId.slice(0, 8)}…
                </Link>
              </TableCell>
              <TableCell className="max-w-[10rem] truncate font-mono text-xs">
                {flag.initiatorId}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrencyAmount(flag.amount, "NGN")}
              </TableCell>
              <TableCell
                className="max-w-[14rem] truncate text-muted-foreground"
                title={flag.flagReason}
              >
                {flag.flagReason}
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground text-xs">
                {formatDateTime(flag.flaggedAt)}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal">
                  {flag.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function AmlFlagsAnalyticsSection() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useAmlFlagsAnalytics()

  if (isLoading) {
    return <AmlFlagsSkeleton />
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
              Couldn&apos;t load AML analytics
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
        <div className="flex items-center gap-2">
          <ShieldAlertIcon className="size-4 text-muted-foreground" aria-hidden />
          <h2 className="font-heading text-sm font-semibold tracking-tight text-foreground">
            AML
          </h2>
        </div>
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
            aria-label="Refresh AML analytics"
          >
            <RefreshCwIcon
              className={cn("size-3.5", isFetching && "animate-spin")}
            />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ShieldAlertIcon}
          label="Total flagged"
          value={data.totalFlagged.toLocaleString()}
        />
        <StatCard
          icon={ClockIcon}
          label="Pending review"
          value={data.pendingReview.toLocaleString()}
        />
        <StatCard
          icon={CheckCircleIcon}
          label="Approved"
          value={data.approved.toLocaleString()}
        />
        <StatCard
          icon={XCircleIcon}
          label="Rejected"
          value={data.rejected.toLocaleString()}
        />
      </div>

      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-base">Recent flags</CardTitle>
          <CardDescription>
            Latest AML-flagged transactions (amounts as NGN).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentFlagsTable flags={data.recentFlags} />
        </CardContent>
      </Card>
    </div>
  )
}
