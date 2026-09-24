"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"

import { endpoints } from "@/lib/endpoints"
import {
  fetchMarketingCsv,
  type MarketingCsvFile,
} from "@/lib/fetch-marketing-csv"

import type {
  MarketingSegmentKey,
  SegmentThresholdOptions,
} from "@/features/segments/types"

export async function exportSegmentCsvAction(
  segment: MarketingSegmentKey,
  options: SegmentThresholdOptions
): Promise<ActionResult<MarketingCsvFile>> {
  try {
    const file = await fetchMarketingCsv(
      endpoints.marketing.segmentExport(segment),
      {
        minDaysSinceSignup: options.minDaysSinceSignup,
        inactiveDays: options.inactiveDays,
        nearZeroBalance: options.nearZeroBalance,
      }
    )
    return { success: true, data: file }
  } catch (error) {
    console.error("Export segment CSV failed:", error)
    return actionFailure(error, "Could not export segment")
  }
}
