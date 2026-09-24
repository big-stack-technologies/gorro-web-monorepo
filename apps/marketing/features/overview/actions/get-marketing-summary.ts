"use server"

import { get } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type { MarketingSummary } from "@/features/overview/types"

export async function getMarketingSummaryAction(): Promise<MarketingSummary> {
  try {
    const { data } = await get<MarketingSummary>(endpoints.marketing.summary)
    return data
  } catch (error) {
    console.error("Failed to load marketing summary:", error)
    throw error
  }
}
