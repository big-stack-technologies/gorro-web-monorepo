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

import { cgaMetricsSummaryColumns } from "@/features/cgas/columns/cga-metrics-summary.columns"
import { createCgaPerformanceColumns } from "@/features/cgas/columns/cga-performance.columns"
import { createCgaPlacementsColumns } from "@/features/cgas/columns/cga-placements.columns"
import {
  performanceFilterFields,
  performanceFiltersFromActive,
  referralFilterFields,
  referralFiltersFromActive,
  REFERRAL_FILTER_KEYS,
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
import { useCgaPageData, useTerritories } from "@/features/cgas/usecases"
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

  const performanceTerritoryDefault = React.useMemo(() => {
    const first =
      territories.data?.find((t) => t.isActive) ?? territories.data?.[0]
    return first ? { perfTerritory: first.id } : undefined
  }, [territories.data])

  const referralFilters = useLocalFilters(REFERRAL_FILTER_KEYS)
  const trendsFilters = useLocalFilters(
    TRENDS_FILTER_KEYS,
    TRENDS_DEFAULT_FILTERS
  )
  const performanceFilters = useLocalFilters(
    PERFORMANCE_FILTER_KEYS,
    performanceTerritoryDefault
  )

  const referralApiFilters = React.useMemo(
    () => referralFiltersFromActive(referralFilters.activeFilters),
    [referralFilters.activeFilters]
  )

  const trendsApiFilters = React.useMemo(
    () => trendsFiltersFromActive(trendsFilters.activeFilters),
    [trendsFilters.activeFilters]
  )

  const performanceApiFilters = React.useMemo(
    () => performanceFiltersFromActive(performanceFilters.activeFilters),
    [performanceFilters.activeFilters]
  )

  const perfFilterFieldDefs = React.useMemo(
    () => performanceFilterFields(territories.data ?? []),
    [territories.data]
  )

  const { summary, placements, performance } = useCgaPageData(
    referralApiFilters,
    performanceApiFilters
  )

  const summaryRows = React.useMemo(
    () => summary.data?.data ?? [],
    [summary.data?.data]
  )
  const placementRows = React.useMemo(
    () => placements.data ?? [],
    [placements.data]
  )
  const performanceRows = React.useMemo(
    () => performance.data?.cgas ?? [],
    [performance.data?.cgas]
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
        title="CGA metrics & performance"
        description="Referral metrics, org placement, and territory-scoped performance are loaded from separate endpoints."
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

      <Tabs defaultValue="referral-leaderboard" className="gap-6">
        <TabsList className="h-9 w-full max-w-full justify-start overflow-x-auto overflow-y-hidden sm:w-fit">
          <TabsTrigger
            value="referral-leaderboard"
            className="flex-none text-xs sm:text-sm"
          >
            CGA referral leaderboard
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
            Territory performance ranking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="referral-leaderboard" className="mt-0">
          <CgaSection
            title="CGA referral leaderboard"
            description="Lifetime and in-range referrals, bonus earned, savings opened, and book value."
          >
            {summary.isError ? (
              <SectionError
                error={summary.error}
                onRetry={() => void summary.refetch()}
              />
            ) : (
              <CgaSortableTable
                data={summaryRows}
                columns={cgaMetricsSummaryColumns}
                isLoading={summary.isLoading}
                emptyMessage="No CGAs in this summary range."
                defaultSorting={[{ id: "newReferralsInRange", desc: true }]}
                onRowClick={(row) => goToCustomers(row.userId)}
                filterFields={referralFilterFields}
                activeFilters={referralFilters.activeFilters}
                setFilters={referralFilters.setFilters}
                clearFilters={referralFilters.clearFilters}
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
            title="Territory performance ranking"
            description="Sign-ups, first-deposit rate, GTV, monthly targets, and pace-based status for the selected territory."
          >
            {performanceMeta ? (
              <p className="text-xs text-muted-foreground">
                Period {performanceMeta.period.from.slice(0, 10)} –{" "}
                {performanceMeta.period.to.slice(0, 10)} · Month pace{" "}
                {performanceMeta.pacePct}% · Headline metric:{" "}
                {performanceMeta.headlineMetric}
              </p>
            ) : null}
            {performance.isError ? (
              <SectionError
                error={performance.error}
                onRetry={() => void performance.refetch()}
              />
            ) : (
              <CgaSortableTable
                data={performanceApiFilters ? performanceRows : []}
                columns={performanceColumns}
                isLoading={
                  territories.isLoading ||
                  (performanceApiFilters != null && performance.isLoading)
                }
                emptyMessage={
                  performanceApiFilters
                    ? "No performance rows for this territory."
                    : "Select a territory and apply filters to load performance."
                }
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
