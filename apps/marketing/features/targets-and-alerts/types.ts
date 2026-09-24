export type MarketingTarget = {
  metric: string
  periodMonth: string
  targetValue: number
}

export type MarketingTargetPayload = {
  metric: string
  periodMonth: string
  targetValue: number
}

export type MarketingAlertRule = {
  code: string
  label: string
  severity: string
  unit: string
  threshold: number
  isDefault: boolean
  enabled: boolean
}

export type UpdateMarketingAlertRulePayload = {
  threshold?: number
  enabled?: boolean
}
