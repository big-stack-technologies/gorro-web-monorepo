import type { DataTableFilterField } from "@gorro/ui/components/data-table"

import {
  CGA_PRODUCTS,
  CGA_TREND_INTERVALS,
  DEFAULT_TREND_INTERVAL,
} from "@/features/cgas/constants"

export const TRENDS_DEFAULT_FILTERS = {
  refInterval: DEFAULT_TREND_INTERVAL,
} as const
import type {
  CgaMetricsFilters,
  CgaPerformanceFilters,
  CgaTrendsFilters,
} from "@/features/cgas/types"

/** Referral metrics summary filter bar field keys. */
export const REFERRAL_FILTER_KEYS = [
  "refFrom",
  "refTo",
  "refEmail",
  "refPhone",
] as const

export const TRENDS_FILTER_KEYS = [...REFERRAL_FILTER_KEYS, "refInterval"] as const

export const PERFORMANCE_FILTER_KEYS = [
  "perfFrom",
  "perfTo",
  "perfProduct",
  "perfTerritory",
] as const

export const referralFilterFields: readonly DataTableFilterField[] = [
  {
    type: "date",
    param: "refFrom",
    label: "From",
    boundary: "startOfDay",
  },
  {
    type: "date",
    param: "refTo",
    label: "To",
    boundary: "endOfDay",
  },
  {
    type: "text",
    param: "refEmail",
    label: "Email",
    placeholder: "CGA email",
  },
  {
    type: "text",
    param: "refPhone",
    label: "Phone",
    placeholder: "+234…",
  },
]

export const trendsFilterFields: readonly DataTableFilterField[] = [
  ...referralFilterFields,
  {
    type: "select",
    param: "refInterval",
    label: "Interval",
    placeholder: "Monthly",
    clearable: false,
    options: CGA_TREND_INTERVALS.map((item) => ({
      value: item.value,
      label: item.label,
    })),
  },
]

export function performanceFilterFields(
  territories: readonly { id: string; name: string; code: string }[]
): readonly DataTableFilterField[] {
  return [
    {
      type: "date",
      param: "perfFrom",
      label: "From",
      boundary: "startOfDay",
    },
    {
      type: "date",
      param: "perfTo",
      label: "To",
      boundary: "endOfDay",
    },
    {
      type: "select",
      param: "perfProduct",
      label: "Product",
      emptyLabel: "All products",
      options: CGA_PRODUCTS.map((item) => ({
        value: item.value,
        label: item.label,
      })),
    },
    {
      type: "select",
      param: "perfTerritory",
      label: "Territory",
      clearable: false,
      options: territories.map((territory) => ({
        value: territory.id,
        label: `${territory.name} (${territory.code})`,
      })),
    },
  ]
}

export function referralFiltersFromActive(
  active: Record<string, string>
): CgaMetricsFilters {
  return {
    from: active.refFrom || undefined,
    to: active.refTo || undefined,
    email: active.refEmail || undefined,
    phone: active.refPhone || undefined,
  }
}

export function trendsFiltersFromActive(
  active: Record<string, string>
): CgaTrendsFilters {
  const interval = active.refInterval
  return {
    ...referralFiltersFromActive(active),
    interval:
      interval === "day" || interval === "week" || interval === "month"
        ? interval
        : DEFAULT_TREND_INTERVAL,
  }
}

export function performanceFiltersFromActive(
  active: Record<string, string>
): CgaPerformanceFilters | null {
  const territoryId = active.perfTerritory?.trim()
  if (!territoryId) return null
  const product = active.perfProduct?.trim()
  return {
    territoryId,
    from: active.perfFrom || undefined,
    to: active.perfTo || undefined,
    product:
      product === "ajo" ||
      product === "cluster" ||
      product === "circle" ||
      product === "savings"
        ? product
        : undefined,
  }
}
