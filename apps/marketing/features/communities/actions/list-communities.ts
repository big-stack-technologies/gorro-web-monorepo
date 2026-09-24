"use server"

import { get } from "@gorro/api/client"

import type {
  CommunityListFilters,
  MarketingCommunityListItem,
} from "@/features/communities/types"
import { endpoints } from "@/lib/endpoints"

export async function listCommunitiesAction(
  filters: CommunityListFilters = {}
): Promise<MarketingCommunityListItem[]> {
  try {
    const params: Record<string, string> = {}
    if (filters.type) params.type = filters.type
    if (filters.territoryId) params.territoryId = filters.territoryId
    if (filters.cgaUserId) params.cgaUserId = filters.cgaUserId

    const { data } = await get<MarketingCommunityListItem[]>(
      endpoints.marketing.communities,
      Object.keys(params).length > 0 ? { params } : undefined
    )
    return data
  } catch (error) {
    console.error("Failed to load communities:", error)
    throw error
  }
}
