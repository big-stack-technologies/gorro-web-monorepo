"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { rejectClusterWithdrawalAction } from "@/features/clusters/actions"
import type { RejectClusterWithdrawalPayload } from "@/features/clusters/schema"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useRejectClusterWithdrawal(
  clusterId: string,
  requestId: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: RejectClusterWithdrawalPayload) =>
      unwrapActionResult(
        await rejectClusterWithdrawalAction(clusterId, requestId, payload)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.clusters.withdrawals.all,
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.clusters.detail(clusterId),
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.clusters.analytics.all,
      })
      toast.success("Withdrawal rejected")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Reject cluster withdrawal error:", error)
    },
  })
}
