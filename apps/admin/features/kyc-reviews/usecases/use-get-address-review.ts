"use client"

import { useQuery } from "@tanstack/react-query"

import { getAddressReviewAction } from "@/features/kyc-reviews/actions"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useGetAddressReview(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.kycReviews.addressDetail(id),
    queryFn: () => getAddressReviewAction(id),
  })
}
