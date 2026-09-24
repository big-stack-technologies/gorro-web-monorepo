"use server"

import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { AjoConfig } from "@/features/ajo/types"

export async function getAjoConfigAction(): Promise<AjoConfig> {
  const { data } = await get<AjoConfig>(endpoints.admin.ajoConfig)
  return data
}
