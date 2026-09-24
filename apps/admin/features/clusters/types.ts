export type ClusterStatus = "ACTIVE" | "CLOSING" | "CLOSED"

export type ClusterMemberRole = "OWNER" | "ADMIN" | "MEMBER"

export type ClusterMemberStatus =
  | "ACTIVE"
  | "PENDING_REMOVAL"
  | "PENDING_JOIN"
  | "REMOVED"

export type ClusterWithdrawalStatus =
  | "PENDING"
  | "APPROVED"
  | "PROCESSING"
  | "COMPLETED"
  | "REJECTED"
  | "FAILED"

export type ClusterListItem = {
  id: string
  name: string
  code: string
  status: ClusterStatus
  memberCount: number
  balanceNaira: number
  ownerName: string
  ownerEmail: string
  isInterestEnabled: boolean
  createdAt: string
}

export type ClusterMember = {
  id: string
  userId: string
  fullName: string
  email: string
  phoneNumber: string
  role: ClusterMemberRole
  status: ClusterMemberStatus
  joinedAt: string
}

export type ClusterDetail = ClusterListItem & {
  description: string | null
  imageUrl: string | null
  requiredApprovals: number
  accruedInterestNaira: number
  withdrawalCount: number
  interestForfeited: boolean
  closureRequestedAt: string | null
  closureFinalAt: string | null
  members: ClusterMember[]
}

export type ClusterWithdrawal = {
  id: string
  clusterId: string
  clusterName: string
  requestedByName: string
  requestedByEmail: string
  amountNaira: number
  recipientName: string
  recipientAccount: string
  bankName: string
  status: ClusterWithdrawalStatus
  approvalCount: number
  requiredApprovals: number
  narration: string
  createdAt: string
}

export type ClusterApiPaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export type ClustersOverview = {
  clustersByStatus: {
    active: number
    closing: number
    closed: number
    total: number
  }
  totalAumNaira: number
  totalMembers: number
}

export type TopClusterByBalance = {
  rank: number
  clusterId: string
  clusterName: string
  clusterCode: string
  balanceNaira: number
  memberCount: number
  ownerName: string
}

export type TopClusterByActivity = {
  rank: number
  clusterId: string
  clusterName: string
  clusterCode: string
  transactionCount: number
  totalVolumeNaira: number
  memberCount: number
}

export type WithdrawalVolumeGroup = "day" | "week" | "month"

export type WithdrawalVolumeBucket = {
  period: string
  count: number
  totalNaira: number
}

export type WithdrawalVolume = {
  from: string
  to: string
  groupBy: WithdrawalVolumeGroup
  buckets: WithdrawalVolumeBucket[]
  totalCount: number
  totalNaira: number
}

export type TopActivityParams = {
  limit?: number
  from?: string
  to?: string
}

export type WithdrawalVolumeParams = {
  from?: string
  to?: string
  groupBy?: WithdrawalVolumeGroup
}
