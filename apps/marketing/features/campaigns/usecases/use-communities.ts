"use client"

import { useQuery } from "@tanstack/react-query"

import { listCommunitiesAction } from "@/features/communities/actions/list-communities"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useCommunities() {
  return useQuery({
    queryKey: QUERY_KEYS.campaigns.communities,
    queryFn: () => listCommunitiesAction(),
  })
}
