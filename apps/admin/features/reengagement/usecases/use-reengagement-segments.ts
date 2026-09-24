"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getReengagementSegmentsAction } from "@/features/reengagement/actions"
import type { ReengagementSegmentsResponse } from "@/features/reengagement/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useReengagementSegments(): UseQueryResult<
  ReengagementSegmentsResponse,
  Error
> {
  return useQuery({
    queryKey: QUERY_KEYS.reengagement.segments,
    queryFn: () => getReengagementSegmentsAction(),
  })
}
