"use client"

import {
  AlertCircleIcon,
  IdCardIcon,
  Loader2Icon,
  RefreshCwIcon,
} from "lucide-react"

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
import { useUsersByTier } from "@/features/users/usecases"
import type { UserKycTierBreakdown } from "@/features/users/types"
import { cn, formatSnakeCaseWords } from "@gorro/ui/utils"

function tierLabel(tier: string) {
  return formatSnakeCaseWords(tier.replace(/-/g, "_"))
}

function TierSkeleton() {
  return (
    <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-40 w-full rounded-md" />
      </CardContent>
    </Card>
  )
}

function TierBreakdownTable({ rows }: { rows: UserKycTierBreakdown[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/20 px-3 py-8 text-center text-sm text-muted-foreground">
        No tier breakdown data.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border/60">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Tier</TableHead>
            <TableHead className="text-right">Users</TableHead>
            <TableHead className="w-[40%] min-w-48">Share</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.tier}>
              <TableCell>
                <Badge variant="secondary" className="font-normal capitalize">
                  {tierLabel(row.tier)}
                </Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums font-medium">
                {row.count.toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary/80 transition-[width]"
                      style={{ width: `${Math.min(100, Math.max(0, row.percentage))}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                    {row.percentage}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function UsersKycTierSection() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useUsersByTier()

  if (isLoading) {
    return <TierSkeleton />
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
              Couldn&apos;t load KYC tier breakdown
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

  const rows = data ?? []

  return (
    <div
      className={cn(
        "flex flex-col gap-4 transition-opacity duration-200",
        isFetching && "opacity-[0.88]"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <IdCardIcon className="size-4 text-muted-foreground" aria-hidden />
          <h2 className="font-heading text-sm font-semibold tracking-tight text-foreground">
            KYC by tier
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
            aria-label="Refresh KYC tier breakdown"
          >
            <RefreshCwIcon
              className={cn("size-3.5", isFetching && "animate-spin")}
            />
          </Button>
        </div>
      </div>

      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-base">User breakdown</CardTitle>
          <CardDescription>
            Count and share of users by verification tier (latest from the server).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TierBreakdownTable rows={rows} />
        </CardContent>
      </Card>
    </div>
  )
}
