"use server"

import { get } from "@gorro/api/client"

import type { MarketingTerritory } from "@/features/cgas/types"
import type { OrgListOptions } from "@/features/org/types"
import { endpoints } from "@/lib/endpoints"

export async function listOrgTerritoriesAction(
  options: OrgListOptions = {}
): Promise<MarketingTerritory[]> {
  try {
    const params: Record<string, string> = {}
    if (options.includeInactive) {
      params.includeInactive = "true"
    }
    const { data } = await get<MarketingTerritory[]>(
      endpoints.marketing.territories,
      { params }
    )
    return data
  } catch (error) {
    console.error("Failed to load org territories:", error)
    throw error
  }
}
