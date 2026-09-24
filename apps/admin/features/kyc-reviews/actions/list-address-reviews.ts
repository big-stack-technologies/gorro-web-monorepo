"use server"

import { buildPaginatedListQueryParams } from "@gorro/api/build-paginated-query-params"
import { get } from "@gorro/api/client"
import { normalizeKycReviewPagination } from "@/features/kyc-reviews/actions/pagination"
import type {
  AddressReview,
  AddressReviewListApiResponse,
} from "@/features/kyc-reviews/types"
import { endpoints } from "@/lib/endpoints"
import type {
  PaginatedListQueryParams,
  PaginatedListResponse,
} from "@gorro/api/types/paginated-list"

export async function listAddressReviewsAction(
  params: PaginatedListQueryParams
): Promise<PaginatedListResponse<AddressReview>> {
  const { data } = await get<AddressReviewListApiResponse>(
    endpoints.admin.kycAddressReviews,
    {
      params: buildPaginatedListQueryParams(params),
    }
  )
  return normalizeKycReviewPagination(data)
}
