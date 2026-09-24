"use client"

import { useQuery } from "@tanstack/react-query"

import { listCommunitiesAction } from "@/features/communities/actions"
import type { CommunityListFilters } from "@/features/communities/types"
import { QUERY_KEYS } from "@/lib/query-keys"

function filtersKey(filters: CommunityListFilters): Record<string, string> {
  const key: Record<string, string> = {}
  if (filters.type) key.type = filters.type
  if (filters.territoryId) key.territoryId = filters.territoryId
  if (filters.cgaUserId) key.cgaUserId = filters.cgaUserId
  return key
}

export function useCommunitiesList(filters: CommunityListFilters) {
  const filterKey = filtersKey(filters)
  return useQuery({
    queryKey: QUERY_KEYS.communities.list(filterKey),
    queryFn: () => listCommunitiesAction(filters),
  })
}
