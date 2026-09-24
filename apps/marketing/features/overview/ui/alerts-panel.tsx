"use client"

import { Badge } from "@gorro/ui/components/ui/badge"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import { cn } from "@gorro/ui/utils"

import type { MarketingAlert, MarketingAlerts } from "@/features/overview/types"
import { SectionError } from "@/features/overview/ui/section"

function severityLabel(severity: string) {
  if (severity === "HIGH") return "High"
  if (severity === "LOW") return "Low"
  return "Medium"
}

function severityDot(severity: string) {
  if (severity === "HIGH") return "bg-destructive"
  if (severity === "LOW") return "bg-muted-foreground"
  return "bg-amber-500"
}

function subjectLabel(alert: MarketingAlert) {
  if (alert.subject.name) return alert.subject.name
  const type = alert.subject.type
  return type.charAt(0).toUpperCase() + type.slice(1)
}
function alertLabel(code: string) {
  const words = code.replace(/_/g, " ").toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function AlertListItem({ alert }: { alert: MarketingAlert }) {
  return (
    <li className="flex items-start gap-3 px-4 py-2.5">
      <span
        className={cn(
          "mt-1.5 size-1.5 shrink-0 rounded-full",
          severityDot(alert.severity)
        )}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate text-sm font-medium">{subjectLabel(alert)}</p>
          <p className="shrink-0 text-xs text-muted-foreground tabular-nums">
            <span className="font-medium text-foreground">
              {alert.value.toLocaleString()}
            </span>
            {" / "}
            {alert.threshold.toLocaleString()} threshold
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{alert.message}</p>
        <p className="text-xs text-muted-foreground">
          {severityLabel(alert.severity)} · {alertLabel(alert.code)}
        </p>
      </div>
    </li>
  )
}

export function AlertsPanel({
  alerts,
  isLoading,
  error,
  onRetry,
}: {
  alerts: MarketingAlerts | null
  isLoading: boolean
  error: unknown
  onRetry: () => void
}) {
  return (
    <section aria-label="Alerts">
      {isLoading ? (
        <Skeleton className="h-28 w-full rounded-xl" />
      ) : null}
      {!isLoading && error ? (
        <SectionError error={error} onRetry={onRetry} />
      ) : null}
      {!isLoading && !error && alerts ? (
        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <div className="flex items-center justify-between gap-3 border-b px-4 py-2.5">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-sm font-semibold tracking-tight">
                Alerts
              </h2>
              <Badge variant={alerts.alertCount > 0 ? "destructive" : "secondary"}>
                {alerts.alertCount}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {alerts.pacePct}% of the period has passed
            </p>
          </div>
          {alerts.alerts.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              Nothing is currently wrong.
            </p>
          ) : (
            <ul className="divide-y">
              {alerts.alerts.map((alert) => (
                <AlertListItem
                  key={`${alert.code}-${alert.subject.id ?? alert.subject.type}-${alert.message}`}
                  alert={alert}
                />
              ))}
            </ul>
          )}
          {alerts.notBuilt.length > 0 ? (
            <details className="border-t px-4 py-2 text-xs text-muted-foreground">
              <summary className="cursor-pointer">
                {alerts.notBuilt.length} rules not built
              </summary>
              <ul className="mt-2 space-y-1.5">
                {alerts.notBuilt.map((item) => (
                  <li key={item.rule}>
                    <span className="font-medium text-foreground">
                      {item.rule}.
                    </span>{" "}
                    {item.reason}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
