"use client"

import { useQuery } from "@tanstack/react-query"

import { listCampaignsAction } from "@/features/campaigns/actions"
import type { CampaignListFilters } from "@/features/campaigns/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useCampaigns(filters: CampaignListFilters) {
  const filterKey: Record<string, string> = filters.territoryId
    ? { territoryId: filters.territoryId }
    : {}
  return useQuery({
    queryKey: QUERY_KEYS.campaigns.list(filterKey),
    queryFn: () => listCampaignsAction(filters),
  })
}
