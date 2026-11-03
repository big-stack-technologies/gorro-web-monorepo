"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"

import { formatDateParam } from "@gorro/api/format-date-param"
import type { MarketingExportReport } from "@/features/marketing-export/constants"
import { endpoints } from "@/lib/endpoints"
import {
  fetchCsvFile,
  type CsvFile,
} from "@gorro/api/csv-file"

export type MarketingReportExportFilters = {
  from?: string
  to?: string
  product?: string
}

export async function exportMarketingReportAction(
  report: MarketingExportReport,
  filters: MarketingReportExportFilters = {}
): Promise<ActionResult<CsvFile>> {
  try {
    const params: Record<string, string> = {}
    if (filters.from) params.from = formatDateParam(filters.from)
    if (filters.to) params.to = formatDateParam(filters.to)
    if (filters.product) params.product = filters.product

    const file = await fetchCsvFile(
      endpoints.marketing.exportReport(report),
      params
    )
    return { success: true, data: file }
  } catch (error) {
    console.error("Export marketing report failed:", error)
    return actionFailure(error, "Could not export report")
  }
}
