"use server"

import { get } from "@gorro/api/client"

import { endpoints } from "@/lib/endpoints"

import type { CgaPlacement } from "@/features/cgas/types"

export async function listMarketingCgasAction(): Promise<CgaPlacement[]> {
  try {
    const { data } = await get<CgaPlacement[]>(endpoints.marketing.cgas)
    return data
  } catch (error) {
    console.error("Failed to load marketing CGAs:", error)
    throw error
  }
}
