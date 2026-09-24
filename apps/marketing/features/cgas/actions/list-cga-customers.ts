"use server"

import { get } from "@gorro/api/client"
import { buildPaginatedListQueryParams } from "@gorro/api/build-paginated-query-params"
import type {
  PaginatedListQueryParams,
  PaginatedListResponse,
} from "@gorro/api/types/paginated-list"

import { endpoints } from "@/lib/endpoints"

import type { CgaCustomer, CgaCustomersResponse } from "@/features/cgas/types"

export async function listCgaCustomersAction(
  userId: string,
  params: PaginatedListQueryParams
): Promise<PaginatedListResponse<CgaCustomer>> {
  try {
    const { data } = await get<CgaCustomersResponse>(
      endpoints.marketing.cgaCustomers(userId),
      { params: buildPaginatedListQueryParams(params) }
    )
    const totalPages = Math.max(1, Math.ceil(data.total / data.limit))
    return {
      data: data.customers,
      meta: {
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages,
        hasNextPage: data.page < totalPages,
        hasPreviousPage: data.page > 1,
      },
    }
  } catch (error) {
    console.error("Failed to load CGA customers:", error)
    throw error
  }
}
