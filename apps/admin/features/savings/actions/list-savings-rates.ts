"use server"

import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { SavingsRateConfig } from "@/features/savings/types"

export async function listSavingsRatesAction(): Promise<SavingsRateConfig[]> {
  const { data } = await get<SavingsRateConfig[]>(endpoints.admin.savingsRates)
  return data
}
