"use server"

import {
  normalizeClusterMembers,
  type ClusterMembersApiResponse,
} from "@/features/clusters/actions/normalize-cluster-members"
import type { ClusterMembersList } from "@/features/clusters/types"
import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function listClusterMembersAction(
  id: string
): Promise<ClusterMembersList> {
  const { data } = await get<ClusterMembersApiResponse>(
    endpoints.admin.clusterMembersById(id)
  )
  return normalizeClusterMembers(data)
}
