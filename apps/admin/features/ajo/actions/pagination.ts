import type { AjoGroupsApiResponse } from "@/features/ajo/types"
import type { PaginatedListResponse } from "@gorro/api/types/paginated-list"

export function normalizeAjoPagination<T>(
  response: AjoGroupsApiResponse & { data: T[] }
): PaginatedListResponse<T> {
  const totalPages = Math.ceil(response.total / Math.max(response.limit, 1))

  return {
    data: response.data,
    meta: {
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages,
      hasNextPage: response.hasMore ?? response.page < totalPages,
      hasPreviousPage: response.page > 1,
    },
  }
}
