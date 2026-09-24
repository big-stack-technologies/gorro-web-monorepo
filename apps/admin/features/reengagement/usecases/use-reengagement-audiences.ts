"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getReengagementAudiencesAction } from "@/features/reengagement/actions"
import type {
  ReengagementAudiencesQuery,
  ReengagementAudiencesResponse,
} from "@/features/reengagement/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useReengagementAudiences(
  query: ReengagementAudiencesQuery = {},
  enabled = true
): UseQueryResult<ReengagementAudiencesResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.reengagement.audiences(query),
    queryFn: () => getReengagementAudiencesAction(query),
    enabled,
  })
}
