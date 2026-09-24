"use server"

import { buildPaginatedListQueryParams } from "@gorro/api/build-paginated-query-params"
import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { ReferralPair } from "@/features/referrals/types"
import type {
  PaginatedListQueryParams,
  PaginatedListResponse,
} from "@gorro/api/types/paginated-list"

export async function listReferralsAction(
  params: PaginatedListQueryParams
): Promise<PaginatedListResponse<ReferralPair>> {
  const { data } = await get<PaginatedListResponse<ReferralPair>>(
    endpoints.admin.referrals,
    {
      params: buildPaginatedListQueryParams(params),
    }
  )
  return data
}
