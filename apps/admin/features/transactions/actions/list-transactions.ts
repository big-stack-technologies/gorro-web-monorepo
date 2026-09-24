"use server"

import { buildPaginatedListQueryParams } from "@gorro/api/build-paginated-query-params"
import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { Transaction } from "@/features/transactions/types"
import type {
  PaginatedListQueryParams,
  PaginatedListResponse,
} from "@gorro/api/types/paginated-list"

/** UI collects major units; API expects minor units (×100). */
function majorAmountFilterToMinor(
  value: string | number | undefined
): number | undefined {
  if (value === undefined) return undefined
  if (typeof value === "string" && value.trim() === "") return undefined
  const n = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(n)) return undefined
  return Math.round(n * 100)
}

export async function listTransactionsAction(
  params: PaginatedListQueryParams
): Promise<PaginatedListResponse<Transaction>> {
  const { minAmount, maxAmount, ...rest } = params
  const apiParams: PaginatedListQueryParams = { ...rest }

  const minMinor = majorAmountFilterToMinor(minAmount)
  const maxMinor = majorAmountFilterToMinor(maxAmount)
  if (minMinor !== undefined) apiParams.minAmount = minMinor
  if (maxMinor !== undefined) apiParams.maxAmount = maxMinor

  const { data } = await get<PaginatedListResponse<Transaction>>(
    endpoints.admin.transactions,
    {
      params: buildPaginatedListQueryParams(apiParams),
    }
  )
  return data
}
