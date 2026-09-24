"use client"

import * as React from "react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DatePicker } from "@gorro/ui/components/date-picker"
import { Button } from "@gorro/ui/components/ui/button"
import { Label } from "@gorro/ui/components/ui/label"

import { CgaSortableTable } from "@/features/cgas/ui/cga-sortable-table"
import { targetHistoryColumns } from "@/features/targets-and-alerts/columns/target-history.columns"
import { AlertRulesPanel } from "@/features/targets-and-alerts/ui/alert-rules-panel"
import { SetTargetDialog } from "@/features/targets-and-alerts/ui/set-target-dialog"
import { useMarketingTargets } from "@/features/targets-and-alerts/usecases"
import { SectionError } from "@/features/overview/ui/section"

function defaultHistoryFilterDate() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${month}-${day}`
}

export function TargetsAndAlertsPage() {
  const [targetOpen, setTargetOpen] = React.useState(false)
  const [historyFilterDate, setHistoryFilterDate] = React.useState(
    defaultHistoryFilterDate()
  )
  const targets = useMarketingTargets(historyFilterDate)

  return (
    <div className="flex flex-col gap-10 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="Targets & alert rules"
        description="Set org-wide monthly targets and configure which conditions surface on the overview alerts panel."
      />

      <section aria-label="Target history" className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-base font-semibold tracking-tight">
              Target history
            </h2>
            <p className="text-sm text-muted-foreground">
              Newest targets first for the selected period. Pick any day in a
              month to view targets for that month.
            </p>
          </div>
          <Button type="button" onClick={() => setTargetOpen(true)}>
            Set target
          </Button>
        </div>

        <div className="flex max-w-xs flex-col gap-2">
          <Label htmlFor="target-history-date">Filter by period</Label>
          <DatePicker
            id="target-history-date"
            value={historyFilterDate}
            onChange={setHistoryFilterDate}
            placeholder="Pick a date"
          />
        </div>

        {targets.error ? (
          <SectionError
            error={targets.error}
            onRetry={() => void targets.refetch()}
          />
        ) : (
          <CgaSortableTable
            data={targets.data ?? []}
            columns={targetHistoryColumns}
            isLoading={targets.isLoading}
            emptyMessage="No targets for this month yet."
            defaultSorting={[{ id: "periodMonth", desc: true }]}
          />
        )}
      </section>

      <AlertRulesPanel />

      <SetTargetDialog open={targetOpen} onOpenChange={setTargetOpen} />
    </div>
  )
}
