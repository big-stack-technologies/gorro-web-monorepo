import type { FinancePeriodFilters } from "@/features/finance/types"

export function filtersKey(filters: FinancePeriodFilters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value != null && value !== "")
  ) as Record<string, string>
}
