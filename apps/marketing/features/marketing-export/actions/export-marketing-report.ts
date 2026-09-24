"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"

import { formatDateParam } from "@/features/analytics/actions/build-params"
import type { MarketingExportReport } from "@/features/marketing-export/constants"
import { endpoints } from "@/lib/endpoints"
import {
  fetchMarketingCsv,
  type MarketingCsvFile,
} from "@/lib/fetch-marketing-csv"

export type MarketingReportExportFilters = {
  from?: string
  to?: string
  product?: string
}

export async function exportMarketingReportAction(
  report: MarketingExportReport,
  filters: MarketingReportExportFilters = {}
): Promise<ActionResult<MarketingCsvFile>> {
  try {
    const params: Record<string, string> = {}
    if (filters.from) params.from = formatDateParam(filters.from)
    if (filters.to) params.to = formatDateParam(filters.to)
    if (filters.product) params.product = filters.product

    const file = await fetchMarketingCsv(
      endpoints.marketing.exportReport(report),
      params
    )
    return { success: true, data: file }
  } catch (error) {
    console.error("Export marketing report failed:", error)
    return actionFailure(error, "Could not export report")
  }
}
