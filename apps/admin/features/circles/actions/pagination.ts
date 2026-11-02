import type { CircleApiPaginatedResponse } from "@/features/circles/types"
import type { PaginatedListResponse } from "@gorro/api/types/paginated-list"

export function normalizeCirclePagination<T>(
  response: CircleApiPaginatedResponse<T>
): PaginatedListResponse<T> {
  const { page, limit, total, totalPages } = response.meta

  return {
    data: response.data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}
