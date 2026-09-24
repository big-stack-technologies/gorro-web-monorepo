"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { removeClusterMemberAction } from "@/features/clusters/actions"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useRemoveClusterMember(clusterId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) =>
      unwrapActionResult(
        await removeClusterMemberAction(clusterId, userId)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.clusters.members(clusterId),
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.clusters.detail(clusterId),
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clusters.list })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.clusters.analytics.overview,
      })
      toast.success("Member removed")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Remove cluster member error:", error)
    },
  })
}
