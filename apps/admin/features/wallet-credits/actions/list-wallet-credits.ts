"use server"

import { buildPaginatedListQueryParams } from "@gorro/api/build-paginated-query-params"
import { get } from "@gorro/api/client"
import type {
  PaginatedListQueryParams,
  PaginatedListResponse,
} from "@gorro/api/types/paginated-list"
import type { WalletCreditListItem } from "@/features/wallet-credits/types"
import { endpoints } from "@/lib/endpoints"

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

function formatDateParam(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  if (DATE_ONLY.test(trimmed)) return trimmed

  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) return trimmed

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, "0")
  const day = String(parsed.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

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
