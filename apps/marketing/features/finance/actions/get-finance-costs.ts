"use server"

import { get } from "@gorro/api/client"

import { buildFinancePeriodParams } from "@/features/finance/actions/build-params"
import type {
  FinancePeriodFilters,
  FinanceCostsResponse,
} from "@/features/finance/types"
import { endpoints } from "@/lib/endpoints"

export async function getFinanceCostsAction(
  filters: FinancePeriodFilters = {}
): Promise<FinanceCostsResponse> {
  try {
    const { data } = await get<FinanceCostsResponse>(endpoints.finance.costs, {
      params: buildFinancePeriodParams(filters),
    })
    return data
  } catch (error) {
    console.error("Failed to load finance costs:", error)
    throw error
  }
}
