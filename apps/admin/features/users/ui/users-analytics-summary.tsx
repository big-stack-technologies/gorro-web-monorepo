"use client"

import type { ReactNode } from "react"
import {
  AlertCircleIcon,
  BadgeCheckIcon,
  CalendarDaysIcon,
  Loader2Icon,
  RefreshCwIcon,
  UserMinusIcon,
  UsersIcon,
  ZapIcon,
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
import { useUsersAnalyticsSummary } from "@/features/users/usecases"
import { cn } from "@gorro/ui/utils"

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

export function UsersAnalyticsSection() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useUsersAnalyticsSummary()

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
              Couldn&apos;t load user analytics
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={UsersIcon}
          label="Total users"
          value={formatCount(data.totalUsers)}
        />
        <StatCard
          icon={ZapIcon}
          label="Active"
          value={formatCount(data.activeUsers)}
        />
        <StatCard
          icon={BadgeCheckIcon}
          label="Verified"
          value={formatCount(data.verifiedUsers)}
        />
        <StatCard
          icon={UserMinusIcon}
          label="Unverified"
          value={formatCount(data.unverifiedUsers)}
          hint={data.unverifiedUsers < 0 ? "Unavailable" : undefined}
        />
        <StatCard
          icon={CalendarDaysIcon}
          label="New this month"
          value={formatCount(data.newUsersThisMonth)}
        />
      </div>
    </div>
  )
}
