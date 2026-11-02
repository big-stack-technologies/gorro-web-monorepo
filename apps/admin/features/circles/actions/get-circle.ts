"use server"

import type { CircleDetail } from "@/features/circles/types"
import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function getCircleAction(id: string): Promise<CircleDetail> {
  const { data } = await get<CircleDetail>(endpoints.admin.circleById(id))
  return data
}
