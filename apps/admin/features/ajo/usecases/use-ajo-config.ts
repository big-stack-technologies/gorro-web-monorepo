"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"

import { getAjoConfigAction } from "@/features/ajo/actions"
import type { AjoConfig } from "@/features/ajo/types"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useAjoConfig(): UseQueryResult<AjoConfig, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.ajo.config,
    queryFn: () => getAjoConfigAction(),
  })
}
