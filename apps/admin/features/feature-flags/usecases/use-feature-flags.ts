"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { listFeatureFlagsAction } from "@/features/feature-flags/actions"
import type { FeatureFlag } from "@/features/feature-flags/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useFeatureFlags(): UseQueryResult<FeatureFlag[], Error> {
  return useQuery({
    queryKey: QUERY_KEYS.featureFlags.list,
    queryFn: () => listFeatureFlagsAction(),
  })
}
