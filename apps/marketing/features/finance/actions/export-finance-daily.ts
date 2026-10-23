"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"

import { buildFinancePeriodParams } from "@/features/finance/actions/build-params"
import type { FinancePeriodFilters } from "@/features/finance/types"
import { endpoints } from "@/lib/endpoints"
import {
  fetchMarketingCsv,
  type MarketingCsvFile,
} from "@/lib/fetch-marketing-csv"

/**
 * Passes the CSV bytes through untouched — the file ends with the
 * partial-position caveat row, which parsing would lose.
 */
export async function exportFinanceDailyAction(
  filters: FinancePeriodFilters = {}
): Promise<ActionResult<MarketingCsvFile>> {
  try {
    const file = await fetchMarketingCsv(
      endpoints.finance.export,
      buildFinancePeriodParams(filters)
    )
    return { success: true, data: file }
  } catch (error) {
    console.error("Export finance daily failed:", error)
    return actionFailure(error, "Could not export finance report")
  }
}
