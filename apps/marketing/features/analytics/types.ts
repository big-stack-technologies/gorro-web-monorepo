import type {
  MarketingFunnel,
  MarketingFunnelStage,
  MarketingPeriod,
  MarketingRetention,
} from "@/features/overview/types"

export type MarketingProduct =
  | "ajo"
  | "cluster"
  | "circle"
  | "savings"

export type AnalyticsPeriodFilters = {
  from?: string
  to?: string
  product?: MarketingProduct
}

export type MarketingTrendsMetric =
  | "signups"
  | "transactions"
  | "gtv"
  | "kyc_completed"

export type MarketingTrendsGranularity = "daily" | "weekly" | "monthly"

export type MarketingTrendsFilters = AnalyticsPeriodFilters & {
  metric: MarketingTrendsMetric
  granularity: MarketingTrendsGranularity
}

/** `GET /admin/marketing/funnel` */
export type MarketingFunnelResponse = {
  period: MarketingPeriod
  cohortSize: number
  stages: MarketingFunnelStage[]
  biggestDropOff: MarketingFunnel["biggestDropOff"]
}

export type MarketingDormancyDefinition = {
  dormantAfterDays: number
  winBackWindowDays: number
  note: string
}

export type MarketingDormancyByCgaRow = {
  cgaUserId: string
  name: string
  neverActivated: number
  active: number
  dormant: number
  dormancyRate: number
}

export type MarketingDormancyByProductRow = {
  product: string
  neverActivated: number
  active: number
  dormant: number
  dormancyRate: number
}

export type MarketingWinBackRow = {
  campaign: string
  nudged: number
  transactedAfter: number
  ratePct: number
}

/** `GET /admin/marketing/dormancy` */
export type MarketingDormancyResponse = {
  definition: MarketingDormancyDefinition
  states: MarketingRetention
  dormancyRate: number
  byCga: MarketingDormancyByCgaRow[]
  byProduct: MarketingDormancyByProductRow[]
  winBack: MarketingWinBackRow[]
}

export type MarketingTrendsPoint = {
  bucket: string
  value: number
}

/** `GET /admin/marketing/trends` */
export type MarketingTrendsResponse = {
  metric: MarketingTrendsMetric
  granularity: MarketingTrendsGranularity
  period: MarketingPeriod
  points: MarketingTrendsPoint[]
}
