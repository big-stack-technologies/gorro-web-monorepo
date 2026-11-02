"use client"

import { useState } from "react"
import Link from "next/link"
import { parseISO } from "date-fns"

import { DatePicker } from "@gorro/ui/components/date-picker"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@gorro/ui/components/ui/field"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gorro/ui/components/ui/table"
import { CIRCLE_CURRENCY } from "@/features/circles/constants"
import { formatRate } from "@/features/circles/format"
import type { CircleFunnel } from "@/features/circles/types"
import { CircleAnalyticsError } from "@/features/circles/ui/circle-analytics-error"
import { useCircleFunnel } from "@/features/circles/usecases"
import { routes } from "@/lib/routes"
import { cn, formatCurrencyAmount, formatUtcDate } from "@gorro/ui/utils"

function StageBar({
  label,
  hint,
  value,
  max,
  muted = false,
}: {
  label: string
  hint: string
  value: number
  max: number
  muted?: boolean
}) {
  const width = max > 0 ? (value / max) * 100 : 0

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <span className="text-lg font-semibold tabular-nums">
          {value.toLocaleString()}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div
          className={cn(
            "h-full rounded-full",
            muted ? "bg-muted-foreground/40" : "bg-primary"
          )}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

function FunnelBody({ data }: { data: CircleFunnel }) {
  const { totals, byCircle } = data
  const max = Math.max(totals.joined, totals.funded, totals.left)

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,16rem)_1fr] lg:items-center">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Join-to-fund rate
          </p>
          <p className="text-5xl font-semibold tracking-tight tabular-nums">
            {totals.joined > 0 ? formatRate(totals.joinToFundRate) : "—"}
          </p>
          <p className="text-sm text-muted-foreground">
            {totals.joined > 0
              ? `${totals.funded.toLocaleString()} of ${totals.joined.toLocaleString()} memberships have contributed`
              : "No one has joined a circle in this period."}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {totals.created.toLocaleString()}{" "}
            {totals.created === 1 ? "circle" : "circles"} created
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <StageBar
            label="Joined"
            hint="Every membership ever taken out, including people who have since left"
            value={totals.joined}
            max={max}
          />
          <StageBar
            label="Funded"
            hint="Members who have made a contribution"
            value={totals.funded}
            max={max}
          />
          <StageBar
            label="Left"
            hint="Joined, then walked away"
            value={totals.left}
            max={max}
            muted
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">By circle</h3>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Circle</TableHead>
                <TableHead className="text-right">Joined</TableHead>
                <TableHead className="text-right">Active now</TableHead>
                <TableHead className="text-right">Left</TableHead>
                <TableHead className="text-right">Funded</TableHead>
                <TableHead className="text-right">Principal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byCircle.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-20 text-center text-muted-foreground"
                  >
                    No circles were created in this period.
                  </TableCell>
                </TableRow>
              ) : (
                byCircle.map((row) => (
                  <TableRow key={row.circleId}>
                    <TableCell className="font-medium">
                      <Link
                        href={routes.protected.circles.detail(row.circleId)}
                        className="hover:underline"
                      >
                        {row.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.joined.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.active.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.left.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.funded.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrencyAmount(
                        row.principalNaira,
                        CIRCLE_CURRENCY
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export function CircleFunnelCard() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const funnel = useCircleFunnel({
    from: from || undefined,
    to: to || undefined,
  })

  if (funnel.isError && !funnel.data) {
    return (
      <CircleAnalyticsError
        title="Circle funnel unavailable"
        error={funnel.error}
        fallback="Could not load the circle funnel."
        onRetry={() => funnel.refetch()}
      />
    )
  }

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <div className="flex min-w-0 flex-col gap-1.5">
          <CardTitle className="text-base">Join-to-fund funnel</CardTitle>
          <CardDescription>
            {funnel.data
              ? `Circles created between ${formatUtcDate(funnel.data.from)} and ${formatUtcDate(funnel.data.to)}. Membership figures are lifetime for those circles.`
              : "How many people who join a circle go on to contribute."}
          </CardDescription>
        </div>
        <FieldGroup className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 xl:w-96">
          <Field className="min-w-0">
            <FieldLabel htmlFor="circle-funnel-from" className="text-xs">
              Circles created from
            </FieldLabel>
            <DatePicker
              id="circle-funnel-from"
              value={from}
              onChange={setFrom}
              placeholder="First circle"
              maxDate={to ? parseISO(to) : undefined}
              className="h-8 min-w-0 overflow-hidden"
            />
          </Field>
          <Field className="min-w-0">
            <FieldLabel htmlFor="circle-funnel-to" className="text-xs">
              Circles created to
            </FieldLabel>
            <DatePicker
              id="circle-funnel-to"
              value={to}
              onChange={setTo}
              placeholder="Today"
              minDate={from ? parseISO(from) : undefined}
              className="h-8 min-w-0 overflow-hidden"
            />
          </Field>
        </FieldGroup>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {funnel.isLoading || !funnel.data ? (
          <Skeleton className="h-72 w-full rounded-lg" />
        ) : (
          <FunnelBody data={funnel.data} />
        )}
        <p className="text-xs text-muted-foreground">
          Counts only what reached the server. People who opened Circle and left
          without joining are not tracked — that needs app-side instrumentation.
        </p>
      </CardContent>
    </Card>
  )
}
