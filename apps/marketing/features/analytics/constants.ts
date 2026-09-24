import { CGA_PRODUCTS } from "@/features/cgas/constants"

import type {
  MarketingTrendsGranularity,
  MarketingTrendsMetric,
} from "./types"

export const ANALYTICS_PRODUCTS = CGA_PRODUCTS

export const DEFAULT_TRENDS_METRIC: MarketingTrendsMetric = "signups"

export const DEFAULT_TRENDS_GRANULARITY: MarketingTrendsGranularity = "weekly"

export const TRENDS_METRICS: {
  value: MarketingTrendsMetric
  label: string
}[] = [
  { value: "signups", label: "Sign-ups" },
  { value: "transactions", label: "Transactions" },
  { value: "gtv", label: "GTV" },
  { value: "kyc_completed", label: "KYC completed" },
]

export const TRENDS_GRANULARITIES: {
  value: MarketingTrendsGranularity
  label: string
}[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
]

export const DAILY_GRANULARITY_MAX_DAYS = 92

export const WIN_BACK_CORRELATION_NOTE =
  "transactedAfter counts customers who transacted within the win-back window after a nudge. Correlation only — not proof the message caused it."
