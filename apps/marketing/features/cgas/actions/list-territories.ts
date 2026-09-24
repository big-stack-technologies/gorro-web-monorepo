"use server"

import { get } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type { MarketingTerritory } from "@/features/cgas/types"

export async function listTerritoriesAction(): Promise<MarketingTerritory[]> {
  try {
    const { data } = await get<MarketingTerritory[]>(
      endpoints.marketing.territories
    )
    return data
  } catch (error) {
    console.error("Failed to load territories:", error)
    throw error
  }
}
