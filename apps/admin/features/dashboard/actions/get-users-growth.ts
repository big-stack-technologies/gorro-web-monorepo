"use server"

import { get } from "@gorro/api/client"
import type { UserGrowthPoint, UsersGrowthApiEnvelope } from "@/features/dashboard/types"
import { endpoints } from "@/lib/endpoints"

export async function getUsersGrowthAction(): Promise<UserGrowthPoint[]> {
  const { data } = await get<UsersGrowthApiEnvelope>(endpoints.admin.usersGrowth)
  return data.data
}
