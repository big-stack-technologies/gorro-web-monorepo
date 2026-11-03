import type { DataTableFilterField } from "@gorro/ui/components/data-table"

import { DEFAULT_FINANCE_RANGE_DAYS } from "@/features/finance/constants"
import type { FinancePeriodFilters } from "@/features/finance/types"

function defaultFinancePeriodIso() {
  const now = new Date()
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - DEFAULT_FINANCE_RANGE_DAYS
  )
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  )
  return {
    from: start.toISOString(),
    to: end.toISOString(),
  }
}

const defaultPeriod = defaultFinancePeriodIso()

export const FINANCE_FILTER_KEYS = ["finFrom", "finTo"] as const

export const FINANCE_DEFAULT_FILTERS = {
  finFrom: defaultPeriod.from,
  finTo: defaultPeriod.to,
} as const

export const financeFilterFields: readonly DataTableFilterField[] = [
  {
    type: "date",
    param: "finFrom",
    label: "From",
    boundary: "startOfDay",
  },
  {
    type: "date",
    param: "finTo",
    label: "To",
    boundary: "endOfDay",
  },
]

export function financeFiltersFromActive(
  active: Record<string, string>
): FinancePeriodFilters {
  return {
    from: active.finFrom || undefined,
    to: active.finTo || undefined,
  }
}
