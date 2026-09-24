"use server"

import { get } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type {
  MarketingSegmentsListResponse,
  SegmentThresholdOptions,
} from "@/features/segments/types"

export async function listSegmentsAction(
  options: Partial<SegmentThresholdOptions> = {}
): Promise<MarketingSegmentsListResponse> {
  try {
    const params: Record<string, string> = {}
    if (options.minDaysSinceSignup) {
      params.minDaysSinceSignup = options.minDaysSinceSignup
    }
    if (options.inactiveDays) params.inactiveDays = options.inactiveDays
    if (options.nearZeroBalance) {
      params.nearZeroBalance = options.nearZeroBalance
    }

    const { data } = await get<MarketingSegmentsListResponse>(
      endpoints.marketing.segments,
      { params }
    )
    return data
  } catch (error) {
    console.error("Failed to load marketing segments:", error)
    throw error
  }
}
