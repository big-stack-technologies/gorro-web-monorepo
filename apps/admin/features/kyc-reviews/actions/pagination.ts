import type { NinReviewListApiResponse } from "@/features/kyc-reviews/types"
import type { PaginatedListResponse } from "@gorro/api/types/paginated-list"

type ReviewListEnvelope<T> = {
  page: number
  limit: number
  total: number
  data: T[]
}

export function normalizeKycReviewPagination<T>(
  response: ReviewListEnvelope<T>
): PaginatedListResponse<T> {
  const limit = Math.max(response.limit, 1)
  const totalPages = Math.max(1, Math.ceil(response.total / limit))

  return {
    data: response.data,
    meta: {
      total: response.total,
      page: response.page,
      limit,
      totalPages,
      hasNextPage: response.page < totalPages,
      hasPreviousPage: response.page > 1,
    },
  }
}

export function normalizeNinReviewPagination(
  response: NinReviewListApiResponse
) {
  return normalizeKycReviewPagination(response)
}
