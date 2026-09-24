"use server"

import { buildPaginatedListQueryParams } from "@gorro/api/build-paginated-query-params"
import { get } from "@gorro/api/client"
import { normalizeNinReviewPagination } from "@/features/kyc-reviews/actions/pagination"
import type {
  NinReview,
  NinReviewListApiResponse,
} from "@/features/kyc-reviews/types"
import { endpoints } from "@/lib/endpoints"
import type {
  PaginatedListQueryParams,
  PaginatedListResponse,
} from "@gorro/api/types/paginated-list"

export async function listNinReviewsAction(
  params: PaginatedListQueryParams
): Promise<PaginatedListResponse<NinReview>> {
  const { data } = await get<NinReviewListApiResponse>(
    endpoints.admin.kycNinReviews,
    {
      params: buildPaginatedListQueryParams(params),
    }
  )
  return normalizeNinReviewPagination(data)
}
