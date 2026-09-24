"use server"

import { get } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type { MarketingManagementSummary } from "@/features/overview/types"

export async function getManagementSummaryAction(): Promise<MarketingManagementSummary> {
  try {
    const { data } = await get<MarketingManagementSummary>(
      endpoints.marketing.managementSummary
    )
    return data
  } catch (error) {
    console.error("Failed to load management summary:", error)
    throw error
  }
}
