"use client"

import { useQuery } from "@tanstack/react-query"

import { getNinReviewAction } from "@/features/kyc-reviews/actions"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useGetNinReview(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.kycReviews.ninDetail(id),
    queryFn: () => getNinReviewAction(id),
  })
}
