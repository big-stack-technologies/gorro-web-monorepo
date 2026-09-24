"use server"

import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { SavingsFixedRateBand } from "@/features/savings/types"

export async function listFixedRateBandsAction(): Promise<
  SavingsFixedRateBand[]
> {
  const { data } = await get<SavingsFixedRateBand[]>(
    endpoints.admin.savingsFixedRateBands
  )
  return data
}
