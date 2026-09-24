"use client"

import { useQuery } from "@tanstack/react-query"

import { getClusterAction } from "@/features/clusters/actions"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useCluster(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.clusters.detail(id),
    queryFn: () => getClusterAction(id),
  })
}
