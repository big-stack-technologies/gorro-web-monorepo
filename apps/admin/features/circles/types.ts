/**
 * Circle admin API. Every money field here is already in NAIRA (not kobo) —
 * render as-is and never divide by 100.
 */

export type CircleStatus = "ACTIVE" | "COMPLETED" | "CANCELLED"

export type CircleVisibility = "PUBLIC" | "PRIVATE"

export type CircleMemberRole = "OWNER" | "MEMBER"

export type CircleMemberStatus = "PENDING_JOIN" | "ACTIVE" | "DECLINED" | "LEFT"

export type CircleListItem = {
  id: string
  name: string
  code: string
  visibility: CircleVisibility
  status: CircleStatus
  ownerName: string
  goalNaira: number
  savedNaira: number
  /** Can exceed 100 — the goal is motivational and does not cap contributions. */
  percentSaved: number
  /** Counts `ACTIVE` members only. */
  memberCount: number
  /** Counts everyone who ever funded, including members who later left. */
  fundedMemberCount: number
  startDate: string
  maturityDate: string
  createdAt: string
}

export type CircleMember = {
  userId: string
  name: string
  email: string
  phoneNumber: string
  role: CircleMemberRole
  status: CircleMemberStatus
  /** Null for a pending request that has not joined yet. */
  joinedAt: string | null
  funded: boolean
  principalNaira: number
  accruedInterestNaira: number
}

export type CircleDetail = {
  circle: CircleListItem
  members: CircleMember[]
}

export type CircleApiPaginatedResponse<T> = {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type CirclesOverview = {
  circlesByStatus: {
    active: number
    completed: number
    cancelled: number
    total: number
  }
  circlesByVisibility: {
    public: number
    private: number
  }
  /** Memberships, not people — one customer can sit in several circles. */
  members: {
    active: number
    left: number
    declined: number
    pendingJoin: number
    total: number
  }
  distinctCustomers: number
  fundedMembers: number
  totalAumNaira: number
  totalAccruedInterestNaira: number
}

export type CircleFunnelTotals = {
  created: number
  /** Every membership ever taken out, including those that are now `LEFT`. */
  joined: number
  funded: number
  left: number
  /** A fraction, not a percentage: 0.1176 is 11.76%. */
  joinToFundRate: number
}

export type CircleFunnelByCircle = {
  circleId: string
  name: string
  joined: number
  active: number
  left: number
  funded: number
  principalNaira: number
}

export type CircleFunnel = {
  from: string
  to: string
  totals: CircleFunnelTotals
  byCircle: CircleFunnelByCircle[]
}

export type CircleFunnelParams = {
  from?: string
  to?: string
}

export type CircleGrowthGroup = "day" | "week" | "month"

export type CircleGrowthBucket = {
  /** `YYYY-MM-DD` (day), ISO week like `2026-W44` (week), or `YYYY-MM` (month). */
  period: string
  circlesCreated: number
  joins: number
  firstContributions: number
}

export type CircleGrowth = {
  from: string
  to: string
  groupBy: CircleGrowthGroup
  /** Empty buckets are omitted by the API — zero-fill before charting. */
  series: CircleGrowthBucket[]
}

export type CircleGrowthParams = {
  from?: string
  to?: string
  groupBy?: CircleGrowthGroup
}
