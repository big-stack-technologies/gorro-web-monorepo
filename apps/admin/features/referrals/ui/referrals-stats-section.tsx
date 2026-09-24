"use client"

import type { ReactNode } from "react"
import {
  AlertCircleIcon,
  CoinsIcon,
  RefreshCwIcon,
  TrendingUpIcon,
  UserPlusIcon,
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
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gorro/ui/components/ui/table"
import { REFERRAL_CURRENCY } from "@/features/referrals/constants"
import type { TopReferrer } from "@/features/referrals/types"
import { useReferralStats } from "@/features/referrals/usecases"
import { cn, emptyAsNa, formatCurrencyAmount } from "@gorro/ui/utils"

function formatCount(value: number) {
  if (value < 0) return "—"
  return value.toLocaleString()
}

function formatAverage(value: number) {
  if (value < 0 || Number.isNaN(value)) return "—"
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon
  label: string
  value: ReactNode
  hint?: ReactNode
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
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
  )
}

function getTopReferrerLabel(referrer: TopReferrer) {
  return referrer.name ?? referrer.email ?? referrer.userId ?? "Unknown"
}

function getTopReferrerCount(referrer: TopReferrer) {
  if (typeof referrer.referralCount === "number") {
    return formatCount(referrer.referralCount)
  }
  return "—"
}

export function ReferralsStatsSection() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useReferralStats()

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
              Couldn&apos;t load referral stats
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
        "flex flex-col gap-4 transition-opacity duration-200",
        isFetching && "opacity-[0.88]"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-sm font-semibold tracking-tight text-foreground">
          Overview
        </h2>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh referral stats"
          >
            <RefreshCwIcon
              className={cn("size-3.5", isFetching && "animate-spin")}
            />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={UserPlusIcon}
          label="Referral pairs"
          value={formatCount(data.totalReferralPairs)}
        />
        <StatCard
          icon={CoinsIcon}
          label="Bonuses paid"
          value={formatCurrencyAmount(data.totalBonusesPaid, REFERRAL_CURRENCY)}
        />
        <StatCard
          icon={CoinsIcon}
          label="Bonuses pending"
          value={formatCurrencyAmount(
            data.totalBonusesPending,
            REFERRAL_CURRENCY
          )}
        />
        <StatCard
          icon={UsersIcon}
          label="Total referrers"
          value={formatCount(data.totalReferrers)}
        />
        <StatCard
          icon={TrendingUpIcon}
          label="Avg per user"
          value={formatAverage(data.averageReferralsPerUser)}
        />
      </div>
      {data.topReferrers.length > 0 ? (
        <Card className="border-border/80 ring-1 ring-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top referrers</CardTitle>
            <CardDescription>
              Users with the most successful referrals
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Referrals</TableHead>
                  <TableHead className="text-right">Bonuses paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topReferrers.map((referrer, index) => (
                  <TableRow key={referrer.userId ?? index}>
                    <TableCell className="font-medium">
                      {getTopReferrerLabel(referrer)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {emptyAsNa(referrer.email ?? null)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {getTopReferrerCount(referrer)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {typeof referrer.totalBonusesPaid === "number"
                        ? formatCurrencyAmount(
                          referrer.totalBonusesPaid,
                          REFERRAL_CURRENCY
                        )
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
