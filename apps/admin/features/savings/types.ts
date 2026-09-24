export type SavingsProductType = "FIXED" | "TARGET" | "VAULT"

export type SavingsMetricsProduct =
  | "SMART_WALLET"
  | "FIXED"
  | "TARGET"
  | "VAULT"

export type SavingsAccountStatus =
  | "ACTIVE"
  | "PENDING_WITHDRAWAL"
  | "COMPLETED"
  | "WITHDRAWN"

export type SavingsRateConfig = {
  id: string
  productType: SavingsProductType
  tier1RateBps: number
  tier2RateBps: number
  tierThresholdMinorUnits: number
  tier1RatePercent: number
  tier2RatePercent: number
  tierThresholdNaira: number
  isEnabled?: boolean
  updatedAt: string
}

export type SavingsFixedRateBand = {
  id: string
  minDays: number
  maxDays: number
  rateBps: number
  ratePercent: number
  updatedAt: string
}

export type SavingsWhtConfig = {
  id: string
  whtRateBps: number
  whtRatePercent: number
  isEnabled: boolean
  updatedAt: string
}

export type SavingsMetricsProductRow = {
  product: SavingsMetricsProduct
  activeAccounts: number
  totalAum: number
  uniqueUsers: number
  avgBalancePerUser: number
  newAccountsThisWeek: number
  newAccountsThisMonth: number
}

export type SavingsMaturityBucket = {
  count: number
  amount: number
}

export type SavingsMetricsSummary = {
  generatedAt: string
  filter: {
    product: string
    from: string | null
    to: string | null
  }
  blended: {
    totalAum: number
    activeAccounts: number
    savingUsers: number
  }
  byProduct: SavingsMetricsProductRow[]
  maturityPipeline: {
    next7Days: SavingsMaturityBucket
    next30Days: SavingsMaturityBucket
    next90Days: SavingsMaturityBucket
  }
  earlyWithdrawals: {
    count: number
    volume: number
    ratePercent: number
  }
  twoTierMix: {
    thresholdNaira: number
    belowThresholdAum: number
    aboveThresholdAum: number
    percentBelow: number
    percentAbove: number
  }
  cohortsBySignupMonth: Array<{
    month: string
    users: number
    aum: number
  }>
}

export type SavingsMetricsSummaryParams = {
  product?: string
  from?: string
  to?: string
}

export type SavingsAccount = {
  userId: string
  name: string
  phone?: string | null
  email?: string | null
  kycTier: number
  product: SavingsMetricsProduct
  accountId: string
  principalSaved: number
  currentBalance: number
  interestRateApplied: number
  dateOpened: string
  maturityDate: string | null
  status: SavingsAccountStatus
  accrualRate?: number
  yieldToDate?: number
  lockInDurationDays?: number
  earlyWithdrawalPenaltyPercent?: number
  targetAmount?: number
  targetDate?: string | null
  progressPercent?: number
  autoSaveFrequency?: string
  upfrontInterestAmount?: number
  dateInterestPaid?: string | null
  principalLocked?: number
  statedRatePercent?: number
  effectiveYieldPercent?: number
}

export type SavingsAccountsApiResponse = {
  page: number
  limit: number
  total: number
  data: SavingsAccount[]
}

export type UpdateSavingsRatePayload = {
  tier1RateBps?: number
  tier2RateBps?: number
  tierThresholdMinorUnits?: number
  isEnabled?: boolean
}

export type UpdateFixedRateBandPayload = {
  rateBps?: number
  minDays?: number
  maxDays?: number
}

export type UpdateWhtConfigPayload = {
  whtRateBps?: number
  isEnabled?: boolean
}
