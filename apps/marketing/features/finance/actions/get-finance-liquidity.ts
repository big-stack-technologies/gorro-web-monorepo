"use server"

import { get } from "@gorro/api/client"

import type { FinanceLiquidityResponse } from "@/features/finance/types"
import { endpoints } from "@/lib/endpoints"

export async function getFinanceLiquidityAction(): Promise<FinanceLiquidityResponse> {
  try {
    const { data } = await get<FinanceLiquidityResponse>(
      endpoints.finance.liquidity
    )
    return data
  } catch (error) {
    console.error("Failed to load finance liquidity:", error)
    throw error
  }
}
