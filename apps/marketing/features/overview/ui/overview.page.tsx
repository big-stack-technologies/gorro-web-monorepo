"use client"

import { useQueryClient } from "@tanstack/react-query"
import { RefreshCwIcon } from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { Button } from "@gorro/ui/components/ui/button"

import { QUERY_KEYS } from "@/lib/query-keys"

import { formatComparedWith, formatPeriodRange } from "@/features/overview/format"
import {
  useManagementSummary,
  useMarketingAlerts,
  useMarketingSummary,
} from "@/features/overview/usecases"
import { AlertsPanel } from "@/features/overview/ui/alerts-panel"
import { HeadlineMetrics } from "@/features/overview/ui/headline-metrics"
import { ManagementReport } from "@/features/overview/ui/management-report"

export function OverviewPage() {
  const queryClient = useQueryClient()
  const summary = useMarketingSummary()
  const alerts = useMarketingAlerts()
  const management = useManagementSummary()

  const period =
    summary.data?.period ??
    management.data?.period ??
    alerts.data?.period ??
    null
  const range = formatPeriodRange(period)
  const compared = formatComparedWith(period)
  const isRefreshing =
    summary.isFetching || alerts.isFetching || management.isFetching

  function refresh() {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.overview.all })
  }

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          title="Overview"
          description={
            range
              ? `Executive summary for ${range}${compared ? `. Compared with ${compared}.` : "."}`
              : "Executive summary for the current period."
          }
        />
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={isRefreshing}
        >
          <RefreshCwIcon className={isRefreshing ? "animate-spin" : undefined} />
          Refresh
        </Button>
      </div>

      <AlertsPanel
        alerts={alerts.data ?? null}
        isLoading={alerts.isLoading}
        error={alerts.error}
        onRetry={() => {
          void alerts.refetch()
        }}
      />

      <HeadlineMetrics
        metrics={summary.data?.metrics ?? management.data?.headline ?? null}
        isLoading={summary.isLoading && !management.data?.headline}
        error={
          summary.error && !management.data?.headline ? summary.error : null
        }
        onRetry={() => {
          void summary.refetch()
        }}
      />

      <ManagementReport
        report={management.data ?? null}
        isLoading={management.isLoading}
        error={management.error}
        onRetry={() => {
          void management.refetch()
        }}
      />
    </div>
  )
}
