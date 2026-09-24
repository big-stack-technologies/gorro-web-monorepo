"use server"

import type {
  ClusterApiPaginatedResponse,
  ClusterWithdrawal,
} from "@/features/clusters/types"
import { buildPaginatedListQueryParams } from "@gorro/api/build-paginated-query-params"
import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type {
  PaginatedListQueryParams,
  PaginatedListResponse,
} from "@gorro/api/types/paginated-list"

import { normalizeClusterPagination } from "./pagination"

export async function listAllClusterWithdrawalsAction(
  params: PaginatedListQueryParams
): Promise<PaginatedListResponse<ClusterWithdrawal>> {
  const { data } = await get<ClusterApiPaginatedResponse<ClusterWithdrawal>>(
    endpoints.admin.clusterWithdrawals,
    { params: buildPaginatedListQueryParams(params) }
  )
  return normalizeClusterPagination(data)
}

export async function listClusterWithdrawalsAction(
  clusterId: string,
  params: PaginatedListQueryParams
): Promise<PaginatedListResponse<ClusterWithdrawal>> {
  const { data } = await get<ClusterApiPaginatedResponse<ClusterWithdrawal>>(
    endpoints.admin.clusterWithdrawalsById(clusterId),
    { params: buildPaginatedListQueryParams(params) }
  )
  return normalizeClusterPagination(data)
}
