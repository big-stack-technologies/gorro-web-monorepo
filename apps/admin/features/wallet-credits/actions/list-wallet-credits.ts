"use server"

import { buildPaginatedListQueryParams } from "@gorro/api/build-paginated-query-params"
import { get } from "@gorro/api/client"
import { formatDateParam } from "@gorro/api/format-date-param"
import type {
  PaginatedListQueryParams,
  PaginatedListResponse,
} from "@gorro/api/types/paginated-list"
import type { WalletCreditListItem } from "@/features/wallet-credits/types"
import { endpoints } from "@/lib/endpoints"

export async function listWalletCreditsAction(
  params: PaginatedListQueryParams
): Promise<PaginatedListResponse<WalletCreditListItem>> {
  try {
    const { fromDate, toDate, ...rest } = params
    const apiParams: PaginatedListQueryParams = { ...rest }

    if (typeof fromDate === "string" && fromDate.trim()) {
      apiParams.fromDate = formatDateParam(fromDate)
    }
    if (typeof toDate === "string" && toDate.trim()) {
      apiParams.toDate = formatDateParam(toDate)
    }

    const { data } = await get<PaginatedListResponse<WalletCreditListItem>>(
      endpoints.admin.walletCredits,
      { params: buildPaginatedListQueryParams(apiParams) }
    )
    return data
  } catch (error) {
    console.error("Failed to list wallet credits:", error)
    throw error
  }
}
