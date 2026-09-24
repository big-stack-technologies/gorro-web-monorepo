"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { rejectAddressReviewAction } from "@/features/kyc-reviews/actions"
import type { RejectAddressReviewPayload } from "@/features/kyc-reviews/types"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { unwrapActionResult } from "@gorro/api/action-result"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useRejectAddressReview(reviewId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: RejectAddressReviewPayload) =>
      unwrapActionResult(await rejectAddressReviewAction(reviewId, payload)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.kycReviews.addressList,
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.kycReviews.addressDetail(reviewId),
      })
      toast.success(data.message)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Reject address review error:", error)
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.kycReviews.addressDetail(reviewId),
      })
    },
  })
}
