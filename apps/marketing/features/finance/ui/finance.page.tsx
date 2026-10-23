"use client"

import * as React from "react"
import { DownloadIcon, Loader2Icon } from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTableFilterBar } from "@gorro/ui/components/data-table"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gorro/ui/components/ui/tabs"

import { useLocalFilters } from "@/features/cgas/hooks/use-local-filters"
import { exportFinanceDailyAction } from "@/features/finance/actions"
import {
  FINANCE_DEFAULT_FILTERS,
  FINANCE_FILTER_KEYS,
  financeFilterFields,
  financeFiltersFromActive,
} from "@/features/finance/filter-config"
import { CostsPanel } from "@/features/finance/ui/costs-panel"
import { DailyPanel } from "@/features/finance/ui/daily-panel"
import { LiquidityPanel } from "@/features/finance/ui/liquidity-panel"
import { RevenuePanel } from "@/features/finance/ui/revenue-panel"
import { useCsvDownload } from "@/features/marketing-export/usecases/use-csv-download"

export function FinancePage() {
  const periodFilters = useLocalFilters(
    FINANCE_FILTER_KEYS,
    FINANCE_DEFAULT_FILTERS
  )
  const filters = React.useMemo(
    () => financeFiltersFromActive(periodFilters.activeFilters),
    [periodFilters.activeFilters]
  )
  const { download, isPending } = useCsvDownload()

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="Finance"
        description="Operations view of liquidity, revenue and costs. Some parts of the finance picture are not instrumented yet — those are flagged where they appear."
      />

      <LiquidityPanel />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <DataTableFilterBar
            fields={financeFilterFields}
            activeFilters={periodFilters.activeFilters}
            setFilters={periodFilters.setFilters}
            clearFilters={periodFilters.clearFilters}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() =>
              void download(() => exportFinanceDailyAction(filters))
            }
          >
            {isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <DownloadIcon />
            )}
            Export daily CSV
          </Button>
        </div>

        <Tabs defaultValue="daily" className="flex flex-col gap-6">
          <TabsList>
            <TabsTrigger value="daily">Daily net</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-0">
            <DailyPanel filters={filters} />
          </TabsContent>
          <TabsContent value="revenue" className="mt-0">
            <RevenuePanel filters={filters} />
          </TabsContent>
          <TabsContent value="costs" className="mt-0">
            <CostsPanel filters={filters} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
