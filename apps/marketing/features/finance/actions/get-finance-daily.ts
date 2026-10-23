"use server"

import { get } from "@gorro/api/client"

import { buildFinancePeriodParams } from "@/features/finance/actions/build-params"
import type {
  FinancePeriodFilters,
  FinanceDailyResponse,
} from "@/features/finance/types"
import { endpoints } from "@/lib/endpoints"

export async function getFinanceDailyAction(
  filters: FinancePeriodFilters = {}
): Promise<FinanceDailyResponse> {
  try {
    const { data } = await get<FinanceDailyResponse>(endpoints.finance.daily, {
      params: buildFinancePeriodParams(filters),
    })
    return data
  } catch (error) {
    console.error("Failed to load finance daily:", error)
    throw error
  }
}
