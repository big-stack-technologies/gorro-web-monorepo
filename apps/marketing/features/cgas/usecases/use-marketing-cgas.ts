"use client"

import { useQuery } from "@tanstack/react-query"

import { listMarketingCgasAction } from "@/features/cgas/actions"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useMarketingCgas() {
  return useQuery({
    queryKey: QUERY_KEYS.cgas.list,
    queryFn: () => listMarketingCgasAction(),
  })
}
