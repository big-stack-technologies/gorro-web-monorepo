"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { rejectNinReviewAction } from "@/features/kyc-reviews/actions"
import type { RejectNinReviewPayload } from "@/features/kyc-reviews/types"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { unwrapActionResult } from "@gorro/api/action-result"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useRejectNinReview(reviewId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: RejectNinReviewPayload) =>
      unwrapActionResult(await rejectNinReviewAction(reviewId, payload)),
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
      console.error("Reject NIN review error:", error)
      // The API rejects an already-decided record with a 400; refetch so the
      // screen stops offering actions that can no longer succeed.
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.kycReviews.ninDetail(reviewId),
      })
    },
  })
}
