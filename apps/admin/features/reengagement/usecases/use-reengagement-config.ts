"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getReengagementConfigAction } from "@/features/reengagement/actions"
import type { ReengagementConfig } from "@/features/reengagement/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useReengagementConfig(): UseQueryResult<
  ReengagementConfig,
  Error
> {
  return useQuery({
    queryKey: QUERY_KEYS.reengagement.config,
    queryFn: () => getReengagementConfigAction(),
  })
}
