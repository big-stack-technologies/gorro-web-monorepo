import type {
  ClusterContributor,
  ClusterMember,
  ClusterMembersList,
  ClusterPendingInvite,
} from "@/features/clusters/types"

export type ClusterMembersApiResponse =
  | ClusterMember[]
  | {
      totalMembers?: number
      totalContributors?: number
      totalPendingInvites?: number
      items?: ClusterMember[]
      contributors?: ClusterContributor[]
      pendingInvites?: ClusterPendingInvite[]
    }

export function normalizeClusterMembers(
  data: ClusterMembersApiResponse
): ClusterMembersList {
  if (Array.isArray(data)) {
    return {
      totalMembers: data.length,
      totalContributors: 0,
      totalPendingInvites: 0,
      items: data,
      contributors: [],
      pendingInvites: [],
    }
  }

  const items = data.items ?? []
  const contributors = data.contributors ?? []
  const pendingInvites = data.pendingInvites ?? []

  return {
    totalMembers: data.totalMembers ?? items.length,
    totalContributors: data.totalContributors ?? contributors.length,
    totalPendingInvites: data.totalPendingInvites ?? pendingInvites.length,
    items,
    contributors,
    pendingInvites,
  }
}
