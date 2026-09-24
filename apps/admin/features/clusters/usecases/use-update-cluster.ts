"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateClusterAction } from "@/features/clusters/actions"
import type { UpdateClusterPayload } from "@/features/clusters/schema"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useUpdateCluster(clusterId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateClusterPayload) =>
      unwrapActionResult(await updateClusterAction(clusterId, payload)),
    onSuccess: (cluster) => {
      queryClient.setQueryData(QUERY_KEYS.clusters.detail(clusterId), cluster)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clusters.list })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.clusters.analytics.all,
      })
      toast.success("Cluster updated")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Update cluster error:", error)
    },
  })
}
