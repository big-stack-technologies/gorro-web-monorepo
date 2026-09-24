export type MarketingTrend = "up" | "down" | "flat"

export type MarketingPeriod = {
  from: string
  to: string
  comparedWith?: {
    from: string
    to: string
  }
}

export type MarketingMetric = {
  key: string
  target: number | null
  actual: number
  achievementPct: number | null
  previous: number
  trend: MarketingTrend
}

/** `GET /admin/marketing/summary` */
export type MarketingSummary = {
  period: MarketingPeriod
  metrics: MarketingMetric[]
}

export type MarketingFunnelStage = {
  key: string
  count: number | null
  conversionPct: number | null
  previousCount: number | null
  changePct: number | null
}

export type MarketingFunnel = {
  cohortSize: number
  biggestDropOff: {
    from: string
    to: string
    lostPct: number
  }
  stages: MarketingFunnelStage[]
}

/** Counts on the management report. The dormancy endpoint nests these under `states`; this one does not. */
export type MarketingRetention = {
  neverActivated: number
  active: number
  dormant: number
  dormancyRate: number
}

export type MarketingCgaHighlight = {
  name: string
  gtv: number
  signups: number
}

export type MarketingPeople = {
  best: MarketingCgaHighlight
  weakest: MarketingCgaHighlight
  cgaCount: number
}

export type MarketingAlertSubject = {
  type: string
  id?: string
  name?: string
}

export type MarketingAlert = {
  code: string
  severity: string
  subject: MarketingAlertSubject
  message: string
  value: number
  threshold: number
}

export type MarketingManagementAlerts = {
  count: number
  items: MarketingAlert[]
}

/** `GET /admin/marketing/summary/management` */
export type MarketingManagementSummary = {
  period: MarketingPeriod
  generatedAt: string
  headline: MarketingMetric[]
  funnel: MarketingFunnel
  retention: MarketingRetention
  people: MarketingPeople
  alerts: MarketingManagementAlerts
}

/** `GET /admin/marketing/alerts` */
export type MarketingAlerts = {
  period: MarketingPeriod
  pacePct: number
  alertCount: number
  alerts: MarketingAlert[]
  notBuilt: {
    rule: string
    reason: string
  }[]
}
