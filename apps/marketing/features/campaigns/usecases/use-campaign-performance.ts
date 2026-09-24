"use client"

import { useQuery } from "@tanstack/react-query"

import { getCampaignPerformanceAction } from "@/features/campaigns/actions"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useCampaignPerformance(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.campaigns.performance(id),
    queryFn: () => getCampaignPerformanceAction(id),
  })
}
