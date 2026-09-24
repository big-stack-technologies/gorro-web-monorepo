"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { approveNinReviewAction } from "@/features/kyc-reviews/actions"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { unwrapActionResult } from "@gorro/api/action-result"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useApproveNinReview(reviewId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () =>
      unwrapActionResult(await approveNinReviewAction(reviewId)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.kycReviews.ninList,
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.kycReviews.ninDetail(reviewId),
      })
      toast.success(data.message)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Approve NIN review error:", error)
      // The API rejects an already-decided record with a 400; refetch so the
      // screen stops offering actions that can no longer succeed.
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.kycReviews.ninDetail(reviewId),
      })
    },
  })
}
