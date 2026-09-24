"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getReferralStatsAction } from "@/features/referrals/actions"
import type { ReferralStats } from "@/features/referrals/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useReferralStats(): UseQueryResult<ReferralStats, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.referrals.stats,
    queryFn: () => getReferralStatsAction(),
  })
}
