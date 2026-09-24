"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getUsersAnalyticsSummaryAction } from "@/features/users/actions"
import type { UsersAnalyticsSummary } from "@/features/users/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useUsersAnalyticsSummary(): UseQueryResult<
  UsersAnalyticsSummary,
  Error
> {
  return useQuery({
    queryKey: QUERY_KEYS.users.analyticsSummary,
    queryFn: () => getUsersAnalyticsSummaryAction(),
  })
}
