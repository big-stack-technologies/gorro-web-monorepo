import type {
  ClusterContributorStatus,
  ClusterInviteRole,
  ClusterMemberRole,
  ClusterMemberStatus,
  ClusterStatus,
  ClusterWithdrawalStatus,
} from "@/features/clusters/types"
import { formatSnakeCaseWords } from "@gorro/ui/utils"

export const CLUSTER_CURRENCY = "NGN"

export const CLUSTER_STATUS_OPTIONS: readonly {
  value: ClusterStatus
  label: string
}[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "CLOSING", label: "Closing" },
  { value: "CLOSED", label: "Closed" },
]

export const CLUSTER_WITHDRAWAL_STATUS_OPTIONS: readonly {
  value: ClusterWithdrawalStatus
  label: string
}[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
  { value: "FAILED", label: "Failed" },
]

export const CLUSTER_MEMBER_ROLE_LABELS: Record<ClusterMemberRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
}

export const CLUSTER_MEMBER_STATUS_LABELS: Record<ClusterMemberStatus, string> =
  {
    ACTIVE: "Active",
    PENDING_REMOVAL: "Pending removal",
    PENDING_JOIN: "Pending join",
    REMOVED: "Removed",
  }

export const CLUSTER_CONTRIBUTOR_STATUS_LABELS: Record<
  ClusterContributorStatus,
  string
> = {
  PENDING: "Pending",
  LINKED: "Linked",
  REVOKED: "Removed",
}

export const CLUSTER_INVITE_ROLE_LABELS: Record<ClusterInviteRole, string> = {
  CONTRIBUTOR: "Contributor",
  MEMBER: "Member",
  ADMIN: "Admin",
}

export function formatContributorStatus(status: string) {
  if (status in CLUSTER_CONTRIBUTOR_STATUS_LABELS) {
    return CLUSTER_CONTRIBUTOR_STATUS_LABELS[status as ClusterContributorStatus]
  }
  return formatSnakeCaseWords(status)
}

export function formatInviteRole(role: string) {
  if (role in CLUSTER_INVITE_ROLE_LABELS) {
    return CLUSTER_INVITE_ROLE_LABELS[role as ClusterInviteRole]
  }
  return formatSnakeCaseWords(role)
}
