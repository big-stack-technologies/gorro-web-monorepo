"use server"

import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { SavingsWhtConfig } from "@/features/savings/types"

export async function getWhtConfigAction(): Promise<SavingsWhtConfig> {
  const { data } = await get<SavingsWhtConfig>(endpoints.admin.savingsWht)
  return data
}
