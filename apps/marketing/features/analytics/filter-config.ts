import type { DataTableFilterField } from "@gorro/ui/components/data-table"

import {
  ANALYTICS_PRODUCTS,
  DEFAULT_TRENDS_GRANULARITY,
  DEFAULT_TRENDS_METRIC,
  TRENDS_GRANULARITIES,
  TRENDS_METRICS,
} from "@/features/analytics/constants"
import { defaultAnalyticsPeriodIso } from "@/features/analytics/utils/default-period"
import type {
  AnalyticsPeriodFilters,
  MarketingProduct,
  MarketingTrendsFilters,
  MarketingTrendsGranularity,
  MarketingTrendsMetric,
} from "@/features/analytics/types"

const defaultPeriod = defaultAnalyticsPeriodIso()

export const PERIOD_FILTER_KEYS = ["anFrom", "anTo", "anProduct"] as const

export const TRENDS_FILTER_KEYS = [
  ...PERIOD_FILTER_KEYS,
  "anMetric",
  "anGranularity",
] as const

export const PERIOD_DEFAULT_FILTERS = {
  anFrom: defaultPeriod.from,
  anTo: defaultPeriod.to,
} as const

export const TRENDS_DEFAULT_FILTERS = {
  ...PERIOD_DEFAULT_FILTERS,
  anMetric: DEFAULT_TRENDS_METRIC,
  anGranularity: DEFAULT_TRENDS_GRANULARITY,
} as const

const productField: DataTableFilterField = {
  type: "select",
  param: "anProduct",
  label: "Product",
  emptyLabel: "All products",
  options: ANALYTICS_PRODUCTS.map((item) => ({
    value: item.value,
    label: item.label,
  })),
}

export const periodFilterFields: readonly DataTableFilterField[] = [
  {
    type: "date",
    param: "anFrom",
    label: "From",
    boundary: "startOfDay",
  },
  {
    type: "date",
    param: "anTo",
    label: "To",
    boundary: "endOfDay",
  },
  productField,
]

export const trendsFilterFields: readonly DataTableFilterField[] = [
  ...periodFilterFields,
  {
    type: "select",
    param: "anMetric",
    label: "Metric",
    clearable: false,
    options: TRENDS_METRICS.map((item) => ({
      value: item.value,
      label: item.label,
    })),
  },
  {
    type: "select",
    param: "anGranularity",
    label: "Granularity",
    clearable: false,
    options: TRENDS_GRANULARITIES.map((item) => ({
      value: item.value,
      label: item.label,
    })),
  },
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

function readMetric(value: string | undefined): MarketingTrendsMetric {
  const metric = value?.trim()
  if (
    metric === "signups" ||
    metric === "transactions" ||
    metric === "gtv" ||
    metric === "kyc_completed"
  ) {
    return metric
  }
  return DEFAULT_TRENDS_METRIC
}

function readGranularity(
  value: string | undefined
): MarketingTrendsGranularity {
  const granularity = value?.trim()
  if (
    granularity === "daily" ||
    granularity === "weekly" ||
    granularity === "monthly"
  ) {
    return granularity
  }
  return DEFAULT_TRENDS_GRANULARITY
}

export function periodFiltersFromActive(
  active: Record<string, string>
): AnalyticsPeriodFilters {
  return {
    from: active.anFrom || undefined,
    to: active.anTo || undefined,
    product: readProduct(active.anProduct),
  }
}

export function trendsFiltersFromActive(
  active: Record<string, string>
): MarketingTrendsFilters {
  return {
    ...periodFiltersFromActive(active),
    metric: readMetric(active.anMetric),
    granularity: readGranularity(active.anGranularity),
  }
}
