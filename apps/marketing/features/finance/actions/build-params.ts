import { formatDateParam } from "@/features/analytics/actions/build-params"
import type { FinancePeriodFilters } from "@/features/finance/types"

export function buildFinancePeriodParams(filters: FinancePeriodFilters) {
  const params: Record<string, string> = {}
  if (filters.from) params.from = formatDateParam(filters.from)
  if (filters.to) params.to = formatDateParam(filters.to)
  return params
}
