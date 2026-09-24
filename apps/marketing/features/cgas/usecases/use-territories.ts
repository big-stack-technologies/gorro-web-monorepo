"use client"

import { useQuery } from "@tanstack/react-query"

import { listTerritoriesAction } from "@/features/cgas/actions"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useTerritories() {
  return useQuery({
    queryKey: QUERY_KEYS.cgas.territories,
    queryFn: () => listTerritoriesAction(),
  })
}
