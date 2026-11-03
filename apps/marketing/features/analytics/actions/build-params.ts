import { formatDateParam } from "@gorro/api/format-date-param"
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
