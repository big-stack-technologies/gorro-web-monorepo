"use client"

import { useQuery } from "@tanstack/react-query"

import { listClusterMembersAction } from "@/features/clusters/actions"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useClusterMembers(clusterId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.clusters.members(clusterId),
    queryFn: () => listClusterMembersAction(clusterId),
  })
}
