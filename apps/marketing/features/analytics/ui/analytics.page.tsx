"use client"

import * as React from "react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTableFilterBar } from "@gorro/ui/components/data-table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gorro/ui/components/ui/tabs"

import {
  PERIOD_DEFAULT_FILTERS,
  PERIOD_FILTER_KEYS,
  periodFilterFields,
  periodFiltersFromActive,
  TRENDS_DEFAULT_FILTERS,
  TRENDS_FILTER_KEYS,
  trendsFilterFields,
  trendsFiltersFromActive,
} from "@/features/analytics/filter-config"
import { DormancyPanel } from "@/features/analytics/ui/dormancy-panel"
import { FunnelPanel } from "@/features/analytics/ui/funnel-panel"
import { TrendsPanel } from "@/features/analytics/ui/trends-panel"
import {
  useMarketingDormancy,
  useMarketingFunnel,
} from "@/features/analytics/usecases"
import { useLocalFilters } from "@/features/cgas/hooks/use-local-filters"

export function AnalyticsPage() {
  const periodFilters = useLocalFilters(
    PERIOD_FILTER_KEYS,
    PERIOD_DEFAULT_FILTERS
  )
  const trendsFiltersState = useLocalFilters(
    TRENDS_FILTER_KEYS,
    TRENDS_DEFAULT_FILTERS
  )

  const periodQuery = React.useMemo(
    () => periodFiltersFromActive(periodFilters.activeFilters),
    [periodFilters.activeFilters]
  )

  const trendsQuery = React.useMemo(
    () => trendsFiltersFromActive(trendsFiltersState.activeFilters),
    [trendsFiltersState.activeFilters]
  )

  const funnel = useMarketingFunnel(periodQuery)
  const dormancy = useMarketingDormancy()

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="Funnel, retention & trends"
        description="Cohort sign-up drop-off, dormancy states, and metric trends for the Head of Marketing."
      />

      <Tabs defaultValue="funnel" className="flex flex-col gap-6">
        <TabsList>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="dormancy">Dormancy</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="mt-0 flex flex-col gap-6">
          <DataTableFilterBar
            fields={periodFilterFields}
            activeFilters={periodFilters.activeFilters}
            setFilters={periodFilters.setFilters}
            clearFilters={periodFilters.clearFilters}
          />
          <FunnelPanel
            data={funnel.data ?? null}
            isLoading={funnel.isLoading}
            error={funnel.error}
            onRetry={() => {
              void funnel.refetch()
            }}
          />
        </TabsContent>

        <TabsContent value="dormancy" className="mt-0 flex flex-col gap-6">
          <DormancyPanel
            data={dormancy.data ?? null}
            isLoading={dormancy.isLoading}
            error={dormancy.error}
            onRetry={() => {
              void dormancy.refetch()
            }}
          />
        </TabsContent>

        <TabsContent value="trends" className="mt-0 flex flex-col gap-6">
          <DataTableFilterBar
            fields={trendsFilterFields}
            activeFilters={trendsFiltersState.activeFilters}
            setFilters={trendsFiltersState.setFilters}
            clearFilters={trendsFiltersState.clearFilters}
          />
          <TrendsPanel filters={trendsQuery} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
