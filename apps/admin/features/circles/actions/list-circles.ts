"use server"

import { buildPaginatedListQueryParams } from "@gorro/api/build-paginated-query-params"
import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type {
  CircleApiPaginatedResponse,
  CircleListItem,
} from "@/features/circles/types"
import type {
  PaginatedListQueryParams,
  PaginatedListResponse,
} from "@gorro/api/types/paginated-list"

import { normalizeCirclePagination } from "./pagination"

export async function listCirclesAction(
  params: PaginatedListQueryParams
): Promise<PaginatedListResponse<CircleListItem>> {
  const { data } = await get<CircleApiPaginatedResponse<CircleListItem>>(
    endpoints.admin.circles,
    { params: buildPaginatedListQueryParams(params) }
  )

  return normalizeCirclePagination(data)
}
