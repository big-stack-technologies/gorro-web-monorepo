"use server"

import { buildPaginatedListQueryParams } from "@gorro/api/build-paginated-query-params"
import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type {
  AjoGroupListItem,
  AjoGroupsApiResponse,
} from "@/features/ajo/types"
import type {
  PaginatedListQueryParams,
  PaginatedListResponse,
} from "@gorro/api/types/paginated-list"

import { normalizeAjoPagination } from "./pagination"

export async function listAjoGroupsAction(
  params: PaginatedListQueryParams
): Promise<PaginatedListResponse<AjoGroupListItem>> {
  const { data } = await get<AjoGroupsApiResponse>(
    endpoints.admin.ajoGroups,
    { params: buildPaginatedListQueryParams(params) }
  )

  return normalizeAjoPagination(data)
}
