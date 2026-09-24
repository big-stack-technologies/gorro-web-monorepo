"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getUsersByTierAction } from "@/features/users/actions"
import type { UserKycTierBreakdown } from "@/features/users/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useUsersByTier(): UseQueryResult<UserKycTierBreakdown[], Error> {
  return useQuery({
    queryKey: QUERY_KEYS.users.byTier,
    queryFn: () => getUsersByTierAction(),
  })
}
