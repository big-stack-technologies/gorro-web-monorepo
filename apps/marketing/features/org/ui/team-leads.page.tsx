"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTableFilterBar } from "@gorro/ui/components/data-table"
import { Button } from "@gorro/ui/components/ui/button"
import { Label } from "@gorro/ui/components/ui/label"
import { Switch } from "@gorro/ui/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gorro/ui/components/ui/tabs"
import { formatUtcDate } from "@gorro/ui/utils"

import { CgaSortableTable } from "@/features/cgas/ui/cga-sortable-table"
import { useLocalFilters } from "@/features/cgas/hooks/use-local-filters"
import { createTeamLeadListColumns } from "@/features/org/columns/team-lead-list.columns"
import { teamLeadPerformanceColumns } from "@/features/org/columns/team-lead-performance.columns"
import {
  TEAM_LEAD_PERF_DEFAULT_FILTERS,
  TEAM_LEAD_PERF_FILTER_KEYS,
  teamLeadPerformanceFilterFields,
  teamLeadPerformanceFiltersFromActive,
} from "@/features/org/filter-config"
import { TeamLeadFormDialog } from "@/features/org/ui/team-lead-form-dialog"
import {
  useOrgTeamLeads,
  useTeamLeadsPerformance,
} from "@/features/org/usecases"
import {
  SectionError,
  SectionHeading,
} from "@/features/overview/ui/section"

export function TeamLeadsPage() {
  const [includeInactive, setIncludeInactive] = React.useState(false)
  const [createOpen, setCreateOpen] = React.useState(false)

  const teamLeads = useOrgTeamLeads({ includeInactive })

  const periodFilters = useLocalFilters(
    TEAM_LEAD_PERF_FILTER_KEYS,
    TEAM_LEAD_PERF_DEFAULT_FILTERS
  )
  const performanceQuery = React.useMemo(
    () => teamLeadPerformanceFiltersFromActive(periodFilters.activeFilters),
    [periodFilters.activeFilters]
  )
  const performance = useTeamLeadsPerformance(performanceQuery)

  const listColumns = React.useMemo(() => createTeamLeadListColumns(), [])

  const performanceRows = performance.data?.teams ?? []

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          title="Team leads"
          description="Lead field teams and compare spread of CGA target achievement—not just team totals."
        />
        <Button type="button" onClick={() => setCreateOpen(true)}>
          <PlusIcon />
          New team lead
        </Button>
      </div>

      <Tabs defaultValue="directory" className="flex flex-col gap-6">
        <TabsList>
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="mt-0 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Switch
              id="team-leads-include-inactive"
              checked={includeInactive}
              onCheckedChange={setIncludeInactive}
            />
            <Label htmlFor="team-leads-include-inactive">
              Show inactive team leads
            </Label>
          </div>
          {teamLeads.isError ? (
            <SectionError
              error={teamLeads.error}
              onRetry={() => void teamLeads.refetch()}
            />
          ) : (
            <CgaSortableTable
              data={teamLeads.data ?? []}
              columns={listColumns}
              isLoading={teamLeads.isLoading}
              emptyMessage="No team leads yet. Add one to group CGAs."
              defaultSorting={[{ id: "name", desc: false }]}
            />
          )}
        </TabsContent>

        <TabsContent value="performance" className="mt-0 flex flex-col gap-6">
          <SectionHeading
            title="Team lead comparison"
            description="Average CGA achievement and the share of CGAs at or above 80% of target show spread within each team. CGAs without a target are excluded from those metrics and counted separately. Team target is the sum of CGA targets. Unassigned stays last and holds every CGA not yet assigned to a team lead."
          />
          <DataTableFilterBar
            fields={teamLeadPerformanceFilterFields}
            activeFilters={periodFilters.activeFilters}
            setFilters={periodFilters.setFilters}
            clearFilters={periodFilters.clearFilters}
          />
          {performance.data ? (
            <p className="text-sm text-muted-foreground">
              {formatUtcDate(performance.data.period.from)} –{" "}
              {formatUtcDate(performance.data.period.to)}
              {" · "}
              Org pace {performance.data.pacePct}%
            </p>
          ) : null}
          {performance.isError ? (
            <SectionError
              error={performance.error}
              onRetry={() => void performance.refetch()}
            />
          ) : (
            <CgaSortableTable
              data={performanceRows}
              columns={teamLeadPerformanceColumns}
              isLoading={performance.isLoading}
              emptyMessage="No performance data for this period."
              defaultSorting={[{ id: "avgCgaAchievementPct", desc: true }]}
              pinLast={(row) => row.teamLeadId == null}
            />
          )}
        </TabsContent>
      </Tabs>

      <TeamLeadFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
