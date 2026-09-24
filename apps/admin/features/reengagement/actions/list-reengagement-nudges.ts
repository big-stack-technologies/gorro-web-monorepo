"use server"

import { buildPaginatedListQueryParams } from "@gorro/api/build-paginated-query-params"
import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import { normalizeReengagementPagination } from "@/features/reengagement/actions/pagination"
import type {
  ReengagementApiPaginatedResponse,
  ReengagementNudge,
} from "@/features/reengagement/types"
import type {
  PaginatedListQueryParams,
  PaginatedListResponse,
} from "@gorro/api/types/paginated-list"

export async function listReengagementNudgesAction(
  params: PaginatedListQueryParams
): Promise<PaginatedListResponse<ReengagementNudge>> {
  const { data } = await get<ReengagementApiPaginatedResponse<ReengagementNudge>>(
    endpoints.admin.reengagementNudges,
    { params: buildPaginatedListQueryParams(params) }
  )

  return normalizeReengagementPagination(data)
}
