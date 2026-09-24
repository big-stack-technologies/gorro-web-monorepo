import type { ClusterApiPaginatedResponse } from "@/features/clusters/types"
import type { PaginatedListResponse } from "@gorro/api/types/paginated-list"

export function normalizeClusterPagination<T>(
  response: ClusterApiPaginatedResponse<T>
): PaginatedListResponse<T> {
  const totalPages = Math.ceil(response.total / Math.max(response.limit, 1))

  return {
    data: response.data,
    meta: {
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages,
      hasNextPage: response.hasMore,
      hasPreviousPage: response.page > 1,
    },
  }
}
