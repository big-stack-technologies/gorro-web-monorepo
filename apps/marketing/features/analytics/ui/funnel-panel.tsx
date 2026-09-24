"use client"

import { cn, formatSnakeCaseWords } from "@gorro/ui/utils"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"

import { FUNNEL_STAGE_LABELS } from "@/features/overview/constants"
import {
  formatComparedWith,
  formatPeriodRange,
} from "@/features/overview/format"
import { SectionError, SectionHeading } from "@/features/overview/ui/section"
import type { MarketingFunnelResponse } from "@/features/analytics/types"

function stageLabel(key: string) {
  return FUNNEL_STAGE_LABELS[key] ?? formatSnakeCaseWords(key)
}

function formatChangePct(changePct: number | null) {
  if (changePct == null) return null
  const sign = changePct > 0 ? "+" : ""
  return `${sign}${changePct}% vs prior period`
}

export function FunnelPanel({
  data,
  isLoading,
  error,
  onRetry,
}: {
  data: MarketingFunnelResponse | null
  isLoading: boolean
  error: unknown
  onRetry: () => void
}) {
  if (isLoading && !data) {
    return <Skeleton className="h-80 w-full rounded-xl" />
  }

  if (error) {
    return <SectionError error={error} onRetry={onRetry} />
  }

  if (!data) return null

  const compared = formatComparedWith(data.period)
  const range = formatPeriodRange(data.period)

  return (
    <div className="space-y-4">
      <SectionHeading
        title="Sign-up cohort funnel"
        description={
          range
            ? `Cohort of ${data.cohortSize.toLocaleString()} sign-ups (${range})${compared ? `. Prior period: ${compared}.` : "."} Conversion is a share of sign-ups, not of the previous stage.`
            : `Cohort of ${data.cohortSize.toLocaleString()} sign-ups. Conversion is a share of sign-ups, not of the previous stage.`
        }
      />

      {data.biggestDropOff ? (
        <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-foreground ring-1 ring-amber-500/30">
          Largest drop-off is {data.biggestDropOff.lostPct}% between{" "}
          {stageLabel(data.biggestDropOff.from)} and{" "}
          {stageLabel(data.biggestDropOff.to)}.
        </p>
      ) : null}

      <ul className="space-y-4">
        {data.stages.map((stage) => {
          const unavailable = stage.count == null
          const width =
            stage.conversionPct == null
              ? 0
              : Math.max(0, Math.min(100, stage.conversionPct))
          const change = formatChangePct(stage.changePct)

          return (
            <li key={stage.key} className="space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm">
                <span
                  className={cn(
                    "font-medium",
                    unavailable && "text-muted-foreground"
                  )}
                >
                  {stageLabel(stage.key)}
                </span>
                <span
                  className={cn(
                    "tabular-nums",
                    unavailable
                      ? "text-muted-foreground"
                      : "text-foreground"
                  )}
                >
                  {unavailable
                    ? "Not available"
                    : (stage.count ?? 0).toLocaleString()}
                  {stage.conversionPct != null
                    ? ` · ${stage.conversionPct}% of sign-ups`
                    : ""}
                </span>
              </div>
              <div
                className={cn(
                  "h-3 overflow-hidden rounded-md",
                  unavailable ? "bg-muted/60" : "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "h-full rounded-md transition-[width]",
                    unavailable ? "bg-muted-foreground/25" : "bg-primary"
                  )}
                  style={{ width: `${unavailable ? 0 : width}%` }}
                />
              </div>
              {!unavailable && change ? (
                <p className="text-xs text-muted-foreground">{change}</p>
              ) : null}
              {unavailable ? (
                <p className="text-xs text-muted-foreground">
                  Awaiting field reporting — not counted as zero.
                </p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
