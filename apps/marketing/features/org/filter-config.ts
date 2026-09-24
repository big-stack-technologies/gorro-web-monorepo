import type { DataTableFilterField } from "@gorro/ui/components/data-table"

import { ANALYTICS_PRODUCTS } from "@/features/analytics/constants"
import { defaultAnalyticsPeriodIso } from "@/features/analytics/utils/default-period"
import type { AnalyticsPeriodFilters, MarketingProduct } from "@/features/analytics/types"

const defaultPeriod = defaultAnalyticsPeriodIso()

export const TERRITORY_PERF_FILTER_KEYS = ["trFrom", "trTo", "trProduct"] as const
export const TEAM_LEAD_PERF_FILTER_KEYS = ["tlFrom", "tlTo", "tlProduct"] as const

export const TERRITORY_PERF_DEFAULT_FILTERS = {
  trFrom: defaultPeriod.from,
  trTo: defaultPeriod.to,
} as const

export const TEAM_LEAD_PERF_DEFAULT_FILTERS = {
  tlFrom: defaultPeriod.from,
  tlTo: defaultPeriod.to,
} as const

const productField = (param: string): DataTableFilterField => ({
  type: "select",
  param,
  label: "Product",
  emptyLabel: "All products",
  options: ANALYTICS_PRODUCTS.map((item) => ({
    value: item.value,
    label: item.label,
  })),
})

export const territoryPerformanceFilterFields: readonly DataTableFilterField[] =
  [
    {
      type: "date",
      param: "trFrom",
      label: "From",
      boundary: "startOfDay",
    },
    {
      type: "date",
      param: "trTo",
      label: "To",
      boundary: "endOfDay",
    },
    productField("trProduct"),
  ]

export const teamLeadPerformanceFilterFields: readonly DataTableFilterField[] =
  [
    {
      type: "date",
      param: "tlFrom",
      label: "From",
      boundary: "startOfDay",
    },
    {
      type: "date",
      param: "tlTo",
      label: "To",
      boundary: "endOfDay",
    },
    productField("tlProduct"),
  ]

function readProduct(value: string | undefined): MarketingProduct | undefined {
  const product = value?.trim()
  if (
    product === "ajo" ||
    product === "cluster" ||
    product === "circle" ||
    product === "savings"
  ) {
    return product
  }
  return undefined
}

export function territoryPerformanceFiltersFromActive(
  active: Record<string, string>
): AnalyticsPeriodFilters {
  return {
    from: active.trFrom || undefined,
    to: active.trTo || undefined,
    product: readProduct(active.trProduct),
  }
}

export function teamLeadPerformanceFiltersFromActive(
  active: Record<string, string>
): AnalyticsPeriodFilters {
  return {
    from: active.tlFrom || undefined,
    to: active.tlTo || undefined,
    product: readProduct(active.tlProduct),
  }
}
