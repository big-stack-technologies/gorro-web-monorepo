"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTableFilterBar } from "@gorro/ui/components/data-table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gorro/ui/components/ui/tabs"

import { fieldReportComparisonColumns } from "@/features/cgas/columns/field-report-comparison.columns"
import { createCgaPerformanceColumns } from "@/features/cgas/columns/cga-performance.columns"
import { createCgaPlacementsColumns } from "@/features/cgas/columns/cga-placements.columns"
import { CGA_KPI_LABELS } from "@/features/cgas/constants"
import {
  COMPARISON_FILTER_KEYS,
  comparisonFilterFields,
  comparisonFiltersFromActive,
  currentMonthComparisonDefaults,
  currentMonthPerformanceDefaults,
  performanceFilterFields,
  performanceFiltersFromActive,
  trendsFilterFields,
  trendsFiltersFromActive,
  TRENDS_DEFAULT_FILTERS,
  TRENDS_FILTER_KEYS,
  PERFORMANCE_FILTER_KEYS,
} from "@/features/cgas/cga-filter-config"
import { useLocalFilters } from "@/features/cgas/hooks/use-local-filters"
import { CgaAssignmentDialog } from "@/features/cgas/ui/cga-assignment-dialog"
import { CgaSortableTable } from "@/features/cgas/ui/cga-sortable-table"
import { CgaTargetDialog } from "@/features/cgas/ui/cga-target-dialog"
import { CgaTrendsChart } from "@/features/cgas/ui/cga-trends-chart"
import type { CgaActionSubject } from "@/features/cgas/types"
import {
  useCgaPageData,
  useFieldReportComparison,
  useTerritories,
} from "@/features/cgas/usecases"
import {
  SectionError,
  SectionHeading,
} from "@/features/overview/ui/section"
import { routes } from "@/lib/routes"

function CgaSection({
  children,
  title,
  description,
}: {
  children: React.ReactNode
  title: string
  description: string
}) {
  return (
    <section className="flex min-w-0 flex-col gap-4">
      <SectionHeading title={title} description={description} />
      {children}
    </section>
  )
}

export function CgasPage() {
  const router = useRouter()

  const [targetCga, setTargetCga] = React.useState<CgaActionSubject | null>(
    null
  )
  const [assignCga, setAssignCga] = React.useState<CgaActionSubject | null>(
    null
  )

  const territories = useTerritories()

  const monthPerformanceDefaults = React.useMemo(
    () => currentMonthPerformanceDefaults(),
    []
  )
  const monthComparisonDefaults = React.useMemo(
    () => currentMonthComparisonDefaults(),
    []
  )

  const trendsFilters = useLocalFilters(
    TRENDS_FILTER_KEYS,
    TRENDS_DEFAULT_FILTERS
  )
  const performanceFilters = useLocalFilters(
    PERFORMANCE_FILTER_KEYS,
    monthPerformanceDefaults
  )
  const comparisonFilters = useLocalFilters(
    COMPARISON_FILTER_KEYS,
    monthComparisonDefaults
  )

  const trendsApiFilters = React.useMemo(
    () => trendsFiltersFromActive(trendsFilters.activeFilters),
    [trendsFilters.activeFilters]
  )

  const performanceApiFilters = React.useMemo(
    () => performanceFiltersFromActive(performanceFilters.activeFilters),
    [performanceFilters.activeFilters]
  )

  const comparisonApiFilters = React.useMemo(
    () => comparisonFiltersFromActive(comparisonFilters.activeFilters),
    [comparisonFilters.activeFilters]
  )

  const perfFilterFieldDefs = React.useMemo(
    () => performanceFilterFields(territories.data ?? []),
    [territories.data]
  )

  const { placements, performance } = useCgaPageData(performanceApiFilters)
  const comparison = useFieldReportComparison(comparisonApiFilters)

  const placementRows = React.useMemo(
    () => placements.data ?? [],
    [placements.data]
  )
  const performanceRows = React.useMemo(
    () => performance.data?.cgas ?? [],
    [performance.data?.cgas]
  )
  const comparisonRows = React.useMemo(
    () => comparison.data?.rows ?? [],
    [comparison.data?.rows]
  )

  const performanceColumns = React.useMemo(
    () => createCgaPerformanceColumns({ onSetTarget: setTargetCga }),
    []
  )

  const placementsColumns = React.useMemo(
    () => createCgaPlacementsColumns({ onAssign: setAssignCga }),
    []
  )

  const goToCustomers = React.useCallback(
    (userId: string) => router.push(routes.cgas.detail(userId)),
    [router]
  )

  const performanceMeta = performance.data

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="CGA performance"
        description="Signups, KYCs, first deposits, and deposit value for the selected period. Dates default to this month."
      />

      <CgaSection
        title="Referral trends"
        description="New referrals and bonus paid over time. Use email or phone to narrow to one CGA."
      >
        <div className="min-w-0 overflow-hidden rounded-xl border border-border ring-1 ring-foreground/10">
          <DataTableFilterBar
            fields={trendsFilterFields}
            activeFilters={trendsFilters.activeFilters}
            setFilters={trendsFilters.setFilters}
            clearFilters={trendsFilters.clearFilters}
          />
          <div className="p-4 lg:p-6">
            <CgaTrendsChart filters={trendsApiFilters} embedded />
          </div>
        </div>
      </CgaSection>

      <Tabs defaultValue="performance" className="gap-6">
        <TabsList className="h-9 w-full max-w-full justify-start overflow-x-auto overflow-y-hidden sm:w-fit">
          <TabsTrigger
            value="performance"
            className="flex-none text-xs sm:text-sm"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger
            value="roster-placement"
            className="flex-none text-xs sm:text-sm"
          >
            Roster & placement
          </TabsTrigger>
          <TabsTrigger
            value="territory-performance"
            className="flex-none text-xs sm:text-sm"
          >
            Territory ranking
          </TabsTrigger>
          <TabsTrigger
            value="reported-vs-measured"
            className="flex-none text-xs sm:text-sm"
          >
            Reported vs measured
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-0">
          <CgaSection
            title="CGA performance"
            description="Signups, KYCs completed, first deposits, and deposit value. Deposit value is deposits only."
          >
            {performanceMeta ? (
              <p className="text-xs text-muted-foreground">
                Period {performanceMeta.period.from.slice(0, 10)} –{" "}
                {performanceMeta.period.to.slice(0, 10)} · Month pace{" "}
                {performanceMeta.pacePct}% · Headline metric:{" "}
                {CGA_KPI_LABELS[
                  performanceMeta.headlineMetric as keyof typeof CGA_KPI_LABELS
                ] ?? performanceMeta.headlineMetric}
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
                columns={performanceColumns}
                isLoading={performance.isLoading}
                emptyMessage="No CGA performance for this period."
                defaultSorting={[{ id: "gtv", desc: true }]}
                onRowClick={(row) => goToCustomers(row.userId)}
                filterFields={perfFilterFieldDefs}
                activeFilters={performanceFilters.activeFilters}
                setFilters={performanceFilters.setFilters}
                clearFilters={performanceFilters.clearFilters}
              />
            )}
          </CgaSection>
        </TabsContent>

        <TabsContent value="roster-placement" className="mt-0">
          <CgaSection
            title="Roster & placement"
            description="Where each CGA sits: team lead, territory, and attributed customer count."
          >
            {placements.isError ? (
              <SectionError
                error={placements.error}
                onRetry={() => void placements.refetch()}
              />
            ) : (
              <CgaSortableTable
                data={placementRows}
                columns={placementsColumns}
                isLoading={placements.isLoading}
                emptyMessage="No CGAs on the roster."
                defaultSorting={[{ id: "customersAttributed", desc: true }]}
                onRowClick={(row) => goToCustomers(row.userId)}
              />
            )}
          </CgaSection>
        </TabsContent>

        <TabsContent value="territory-performance" className="mt-0">
          <CgaSection
            title="Territory ranking"
            description="Same period as Performance. Narrow with the territory filter, or leave it on all territories."
          >
            {performance.isError ? (
              <SectionError
                error={performance.error}
                onRetry={() => void performance.refetch()}
              />
            ) : (
              <CgaSortableTable
                data={performanceRows}
                columns={performanceColumns}
                isLoading={performance.isLoading}
                emptyMessage="No performance rows for this period."
                defaultSorting={[{ id: "gtv", desc: true }]}
                onRowClick={(row) => goToCustomers(row.userId)}
                filterFields={perfFilterFieldDefs}
                activeFilters={performanceFilters.activeFilters}
                setFilters={performanceFilters.setFilters}
                clearFilters={performanceFilters.clearFilters}
              />
            )}
          </CgaSection>
        </TabsContent>

        <TabsContent value="reported-vs-measured" className="mt-0">
          <CgaSection
            title="Reported vs measured"
            description="What each CGA reported on field reports, next to what the system measured. A positive variance means the system saw more than the CGA claimed."
          >
            {comparison.isError ? (
              <SectionError
                error={comparison.error}
                onRetry={() => void comparison.refetch()}
              />
            ) : (
              <CgaSortableTable
                data={comparisonRows}
                columns={fieldReportComparisonColumns}
                isLoading={comparison.isLoading}
                emptyMessage="No field-report comparison for this period."
                defaultSorting={[{ id: "variance", desc: true }]}
                filterFields={comparisonFilterFields}
                activeFilters={comparisonFilters.activeFilters}
                setFilters={comparisonFilters.setFilters}
                clearFilters={comparisonFilters.clearFilters}
              />
            )}
          </CgaSection>
        </TabsContent>
      </Tabs>

      <CgaTargetDialog
        cga={targetCga}
        open={targetCga != null}
        onOpenChange={(open) => {
          if (!open) setTargetCga(null)
        }}
      />
      <CgaAssignmentDialog
        cga={assignCga}
        open={assignCga != null}
        onOpenChange={(open) => {
          if (!open) setAssignCga(null)
        }}
      />
    </div>
  )
}
