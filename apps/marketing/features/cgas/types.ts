export type MarketingNamedRef = {
  id: string
  name: string
}

export type MarketingTerritoryRef = {
  id: string
  name: string
  code: string
}

export type CgaMetricsSummaryItem = {
  userId: string
  name: string
  email: string
  phone: string
  referralCode: string
  cgaSince: string | null
  totalReferrals: number
  newReferralsInRange: number
  bonusEarnedInRange: number
  customerSavingsOpenedInRange: number
  bookValue: number
}

export type CgaMetricsSummaryResponse = {
  from: string
  to: string
  count: number
  data: CgaMetricsSummaryItem[]
}

export type CgaMetricsTrendPoint = {
  period: string
  newReferrals: number
  bonusPaid: number
}

export type CgaMetricsTrendsResponse = {
  interval: "day" | "week" | "month"
  from: string
  to: string
  series: CgaMetricsTrendPoint[]
}

export type CgaPlacement = {
  userId: string
  name: string
  cgaSince: string | null
  teamLead: MarketingNamedRef | null
  territory: MarketingTerritoryRef | null
  customersAttributed: number
}

export type CgaPerformanceStatus = "ON_TRACK" | "AT_RISK" | "NO_TARGET" | string

export type CgaPerformanceRow = {
  userId: string
  name: string
  teamLead: MarketingNamedRef | null
  territory: MarketingTerritoryRef | null
  signups: number
  kycCompleted: number
  firstDeposits: number
  firstDepositRate: number
  productAdoption: number
  clustersCreated: number
  transactions: number
  gtv: number
  activeCustomers: number
  dormantCustomers: number
  totalCustomers: number
  fieldActivity: number | null
  target: number | null
  achievementPct: number | null
  status: CgaPerformanceStatus
}

export type CgaPerformanceResponse = {
  period: {
    from: string
    to: string
  }
  pacePct: number
  headlineMetric: string
  cgas: CgaPerformanceRow[]
}

/** Identity for target / assignment dialogs. */
export type CgaActionSubject = {
  userId: string
  name: string
  teamLead?: MarketingNamedRef | null
  territory?: MarketingTerritoryRef | null
}

export type CgaCustomer = {
  userId: string
  name: string
  joinedAt: string
  kycCompleted: boolean
  hasDeposited: boolean
  lastTransactionAt: string | null
  state: "active" | "dormant" | "never_activated" | string
}

export type CgaCustomersResponse = {
  page: number
  limit: number
  total: number
  customers: CgaCustomer[]
}

export type CgaTargetPayload = {
  metric: string
  periodMonth: string
  targetValue: number
}

export type CgaTargetResponse = {
  cgaUserId: string
  metric: string
  periodMonth: string
  targetValue: number
}

export type CgaAssignmentPayload = {
  teamLeadId: string | null
  territoryId: string | null
}

export type MarketingTerritory = {
  id: string
  name: string
  code: string
  isActive: boolean
}

export type MarketingTeamLeadUser = {
  id: string
  name: string
}

export type MarketingTeamLead = {
  id: string
  name: string
  isActive: boolean
  user: MarketingTeamLeadUser | null
  territory: MarketingTerritoryRef | null
  cgaCount: number
}

export type CgaMetricsFilters = {
  from?: string
  to?: string
  email?: string
  phone?: string
}

export type CgaTrendsFilters = CgaMetricsFilters & {
  interval?: "day" | "week" | "month"
}

export type CgaPerformanceFilters = {
  from?: string
  to?: string
  territoryId: string
  product?: "ajo" | "cluster" | "circle" | "savings"
}
