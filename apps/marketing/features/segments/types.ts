export type MarketingSegmentKey =
  | "no-kyc"
  | "kyc-no-deposit"
  | "emptied-and-gone"
  | "money-still-in"
  | "ajo-stalled"

export type SegmentThresholdOptions = {
  minDaysSinceSignup: string
  inactiveDays: string
  nearZeroBalance: string
}

export type MarketingSegmentSummary = {
  key: MarketingSegmentKey
  label: string
  description: string
  count: number
  totalBalance?: number
}

export type MarketingSegmentsListResponse = {
  segments: MarketingSegmentSummary[]
  totalUsers: number
}

export type SegmentAjoGroup = {
  name: string
  status: string
}

export type MarketingSegmentUser = {
  userId: string
  name: string
  phoneNumber: string
  email: string
  kycTier: string | null
  joinedAt: string
  lastTransactionAt: string | null
  balance: number
  ajoGroup?: SegmentAjoGroup | null
}

export type MarketingSegmentUsersResponse = {
  key: MarketingSegmentKey
  label: string
  description: string
  appliedOptions: SegmentThresholdOptions
  page: number
  limit: number
  total: number
  users: MarketingSegmentUser[]
}
