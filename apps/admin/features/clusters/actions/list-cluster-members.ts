"use server"

import type { ClusterMember } from "@/features/clusters/types"
import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function listClusterMembersAction(
  id: string
): Promise<ClusterMember[]> {
  const { data } = await get<ClusterMember[]>(
    endpoints.admin.clusterMembersById(id)
  )
  return data
}
