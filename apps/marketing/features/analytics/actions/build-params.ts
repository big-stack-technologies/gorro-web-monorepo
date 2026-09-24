import type {
  AnalyticsPeriodFilters,
  MarketingProduct,
  MarketingTrendsFilters,
} from "@/features/analytics/types"

const PRODUCTS = new Set<MarketingProduct>([
  "ajo",
  "cluster",
  "circle",
  "savings",
])

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/** API query dates as `YYYY-MM-DD` (filters may store ISO from the date picker). */
export function formatDateParam(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  if (DATE_ONLY.test(trimmed)) return trimmed

  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) return trimmed

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, "0")
  const day = String(parsed.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function buildPeriodParams(filters: AnalyticsPeriodFilters) {
  const params: Record<string, string> = {}
  if (filters.from) params.from = formatDateParam(filters.from)
  if (filters.to) params.to = formatDateParam(filters.to)
  if (filters.product && PRODUCTS.has(filters.product)) {
    params.product = filters.product
  }
  return params
}

export function buildTrendsParams(filters: MarketingTrendsFilters) {
  return {
    ...buildPeriodParams(filters),
    metric: filters.metric,
    granularity: filters.granularity,
  }
}
