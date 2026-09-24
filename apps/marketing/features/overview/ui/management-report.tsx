"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@gorro/ui/components/ui/card"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import { cn, formatNgn, formatSnakeCaseWords } from "@gorro/ui/utils"

import { FUNNEL_STAGE_LABELS } from "@/features/overview/constants"
import type {
  MarketingCgaHighlight,
  MarketingFunnel,
  MarketingManagementSummary,
  MarketingRetention,
} from "@/features/overview/types"
import { SectionError, SectionHeading } from "@/features/overview/ui/section"

function stageLabel(key: string) {
  return FUNNEL_STAGE_LABELS[key] ?? formatSnakeCaseWords(key)
}

function FunnelSection({ funnel }: { funnel: MarketingFunnel }) {
  return (
    <div className="space-y-3">
      <SectionHeading
        title="Funnel"
        description={`Cohort of ${funnel.cohortSize.toLocaleString()} sign-ups. Conversion is a share of sign-ups, not of the previous stage.`}
      />
      {funnel.biggestDropOff ? (
        <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-foreground ring-1 ring-amber-500/30">
          Largest drop-off is {funnel.biggestDropOff.lostPct}% between{" "}
          {stageLabel(funnel.biggestDropOff.from)} and{" "}
          {stageLabel(funnel.biggestDropOff.to)}.
        </p>
      ) : null}
      <ul className="space-y-3">
        {funnel.stages.map((stage) => {
          const width =
            stage.conversionPct == null
              ? 0
              : Math.max(0, Math.min(100, stage.conversionPct))
          const unavailable = stage.count == null
          return (
            <li key={stage.key} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className={cn(unavailable && "text-muted-foreground")}>
                  {stageLabel(stage.key)}
                </span>
                <span
                  className={cn(
                    "tabular-nums",
                    unavailable
                      ? "text-muted-foreground"
                      : "font-medium text-foreground"
                  )}
                >
                  {stage.count == null
                    ? "Not available"
                    : stage.count.toLocaleString()}
                  {stage.conversionPct != null
                    ? ` · ${stage.conversionPct}%`
                    : ""}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${unavailable ? 0 : width}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function RetentionSection({ retention }: { retention: MarketingRetention }) {
  const states = [
    { label: "Never activated", value: retention.neverActivated },
    { label: "Active", value: retention.active },
    { label: "Dormant", value: retention.dormant },
  ]
  return (
    <div className="space-y-3">
      <SectionHeading
        title="Retention"
        description="Dormancy is measured across customers who have ever transacted. Never activated is an onboarding gap, not a retention one."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {states.map((state) => (
          <Card key={state.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {state.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">
                {state.value.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Dormancy rate{" "}
        <span className="font-medium text-foreground tabular-nums">
          {retention.dormancyRate}%
        </span>
        .
      </p>
    </div>
  )
}

function PersonCard({
  title,
  person,
}: {
  title: string
  person: MarketingCgaHighlight
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-lg font-semibold">{person.name}</p>
        <p className="text-2xl font-semibold tabular-nums">
          {formatNgn(person.gtv)}
        </p>
        <p className="text-xs text-muted-foreground">
          {person.signups.toLocaleString()} sign-ups
        </p>
      </CardContent>
    </Card>
  )
}

export function ManagementReport({
  report,
  isLoading,
  error,
  onRetry,
}: {
  report: MarketingManagementSummary | null
  isLoading: boolean
  error: unknown
  onRetry: () => void
}) {
  return (
    <section className="space-y-6" aria-label="Management summary">
      <SectionHeading
        title="Management summary"
        description="Funnel, retention, and the best and weakest CGAs by GTV."
      />
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ) : null}
      {!isLoading && error ? (
        <SectionError error={error} onRetry={onRetry} />
      ) : null}
      {!isLoading && !error && report ? (
        <div className="space-y-8">
          {report.funnel ? <FunnelSection funnel={report.funnel} /> : null}
          {report.retention ? (
            <RetentionSection retention={report.retention} />
          ) : null}
          <div className="space-y-3">
            <SectionHeading
              title="People"
              description={`Best and weakest of ${report.people.cgaCount.toLocaleString()} CGAs, ranked by GTV rather than sign-ups.`}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <PersonCard title="Best CGA" person={report.people.best} />
              <PersonCard title="Weakest CGA" person={report.people.weakest} />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
