"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getUserReferralDetailsAction } from "@/features/referrals/actions"
import type { UserReferralDetails } from "@/features/referrals/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useUserReferralDetails(
  userId: string
): UseQueryResult<UserReferralDetails, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.referrals.detail(userId),
    queryFn: () => getUserReferralDetailsAction(userId),
    enabled: userId.length > 0,
  })
}
