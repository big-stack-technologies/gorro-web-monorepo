"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getUsersGrowthAction } from "@/features/dashboard/actions"
import type { UserGrowthPoint } from "@/features/dashboard/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useUsersGrowth(): UseQueryResult<UserGrowthPoint[], Error> {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.usersGrowth,
    queryFn: () => getUsersGrowthAction(),
  })
}
