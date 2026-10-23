"use server"

import { get } from "@gorro/api/client"

import { buildFinancePeriodParams } from "@/features/finance/actions/build-params"
import type {
  FinancePeriodFilters,
  FinanceRevenueResponse,
} from "@/features/finance/types"
import { endpoints } from "@/lib/endpoints"

export async function getFinanceRevenueAction(
  filters: FinancePeriodFilters = {}
): Promise<FinanceRevenueResponse> {
  try {
    const { data } = await get<FinanceRevenueResponse>(endpoints.finance.revenue, {
      params: buildFinancePeriodParams(filters),
    })
    return data
  } catch (error) {
    console.error("Failed to load finance revenue:", error)
    throw error
  }
}
