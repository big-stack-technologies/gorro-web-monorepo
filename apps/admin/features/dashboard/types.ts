import type { TransactionsAnalyticsSummary } from "@/features/transactions/types"
import type { AnalyticsApiEnvelope } from "@gorro/api/types/analytics-api"

export type DashboardPeriod = "today" | "week" | "month"

export type DashboardUsersSummary = {
  totalUsers: number
  activeUsers: number
  verifiedUsers: number
  unverifiedUsers: number
  newUsersThisMonth: number
}

/** Same shape as {@link TransactionsAnalyticsSummary} (nested in dashboard payload). */
export type DashboardTransactionsSummary = TransactionsAnalyticsSummary

export type DashboardAmlSummary = {
  totalFlagged: number
  pendingReview: number
  approved: number
  rejected: number
  recentFlags: unknown[]
}

export type DashboardRevenueSummary = {
  totalFees: number
  currency: string
  feesByType: Record<string, number>
  monthlyFees: Record<string, number>
}

export type DashboardSummary = {
  period: DashboardPeriod
  users: DashboardUsersSummary
  transactions: DashboardTransactionsSummary
  aml: DashboardAmlSummary
  revenue: DashboardRevenueSummary
  lastUpdated: string
}

/** Envelope returned by `GET /admin/analytics/dashboard`. */
export type DashboardApiEnvelope = AnalyticsApiEnvelope<DashboardSummary>

/** One day in the user growth series from `GET /admin/analytics/users/growth`. */
export type UserGrowthPoint = {
  date: string
  newUsers: number
  cumulativeUsers: number
}

/** Envelope returned by `GET /admin/analytics/users/growth`. */
export type UsersGrowthApiEnvelope = AnalyticsApiEnvelope<UserGrowthPoint[]>

/** One day in the transaction volume series from `GET /admin/analytics/transactions/volume`. */
export type TransactionVolumePoint = {
  date: string
  count: number
  value: number
  successCount: number
  failureCount: number
}

/** Envelope returned by `GET /admin/analytics/transactions/volume`. */
export type TransactionsVolumeApiEnvelope =
  AnalyticsApiEnvelope<TransactionVolumePoint[]>
