import type {
  NinReview,
  NinReviewListApiResponse,
} from "@/features/kyc-reviews/types"
import type { PaginatedListResponse } from "@gorro/api/types/paginated-list"

export function normalizeNinReviewPagination(
  response: NinReviewListApiResponse
): PaginatedListResponse<NinReview> {
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
