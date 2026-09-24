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
import { createTerritoryListColumns } from "@/features/org/columns/territory-list.columns"
import { territoryPerformanceColumns } from "@/features/org/columns/territory-performance.columns"
import {
  TERRITORY_PERF_DEFAULT_FILTERS,
  TERRITORY_PERF_FILTER_KEYS,
  territoryPerformanceFilterFields,
  territoryPerformanceFiltersFromActive,
} from "@/features/org/filter-config"
import { TerritoryFormDialog } from "@/features/org/ui/territory-form-dialog"
import {
  useOrgTerritories,
  useTerritoriesPerformance,
} from "@/features/org/usecases"
import {
  SectionError,
  SectionHeading,
} from "@/features/overview/ui/section"
export function TerritoriesPage() {
  const [includeInactive, setIncludeInactive] = React.useState(false)
  const [createOpen, setCreateOpen] = React.useState(false)

  const territories = useOrgTerritories({ includeInactive })

  const periodFilters = useLocalFilters(
    TERRITORY_PERF_FILTER_KEYS,
    TERRITORY_PERF_DEFAULT_FILTERS
  )
  const performanceQuery = React.useMemo(
    () => territoryPerformanceFiltersFromActive(periodFilters.activeFilters),
    [periodFilters.activeFilters]
  )
  const performance = useTerritoriesPerformance(performanceQuery)

  const listColumns = React.useMemo(() => createTerritoryListColumns(), [])

  const performanceRows = performance.data?.regions ?? []

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          title="Territories"
          description="Define regions for CGAs and team leads. Compare territories on per-CGA rates, not raw totals alone."
        />
        <Button type="button" onClick={() => setCreateOpen(true)}>
          <PlusIcon />
          New territory
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
              id="territories-include-inactive"
              checked={includeInactive}
              onCheckedChange={setIncludeInactive}
            />
            <Label htmlFor="territories-include-inactive">
              Show inactive territories
            </Label>
          </div>
          {territories.isError ? (
            <SectionError
              error={territories.error}
              onRetry={() => void territories.refetch()}
            />
          ) : (
            <CgaSortableTable
              data={territories.data ?? []}
              columns={listColumns}
              isLoading={territories.isLoading}
              emptyMessage="No territories yet. Create one to organize the field."
              defaultSorting={[{ id: "name", desc: false }]}
            />
          )}
        </TabsContent>

        <TabsContent value="performance" className="mt-0 flex flex-col gap-6">
          <SectionHeading
            title="Territory comparison"
            description="GTV per CGA and sign-ups per CGA are the fairest comparisons. Unassigned stays last and covers CGAs with no territory. Customers with no CGA attribution are not in any territory and do not appear here."
          />
          <DataTableFilterBar
            fields={territoryPerformanceFilterFields}
            activeFilters={periodFilters.activeFilters}
            setFilters={periodFilters.setFilters}
            clearFilters={periodFilters.clearFilters}
          />
          {performance.data?.period ? (
            <p className="text-sm text-muted-foreground">
              {formatUtcDate(performance.data.period.from)} –{" "}
              {formatUtcDate(performance.data.period.to)}
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
              columns={territoryPerformanceColumns}
              isLoading={performance.isLoading}
              emptyMessage="No performance data for this period."
              defaultSorting={[{ id: "gtvPerCga", desc: true }]}
              pinLast={(row) => row.territoryId == null}
            />
          )}
        </TabsContent>
      </Tabs>

      <TerritoryFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
