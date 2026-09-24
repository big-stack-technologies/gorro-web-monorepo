import type { AnalyticsApiEnvelope } from "@gorro/api/types/analytics-api"

export type TransactionStatus =
  | "PENDING"
  | "POSTING"
  | "POSTED"
  | "FAILED"
  | "PENDING_REVIEW"
  | "REVERSED"

export type TransactionType =
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "TRANSFER"
  | "BILL_PAYMENT"
  | "REVERSAL"
  | "INTEREST"
  | "ADJUSTMENT"
  | "FEE"

export type TransactionDirection = "INBOUND" | "OUTBOUND" | "INTERNAL"

export type Transaction = {
  id: string
  type: TransactionType
  status: TransactionStatus
  direction: TransactionDirection
  initiatorId: string
  amountMinorUnits: number
  currency: string
  referenceId: string
  idempotencyKey: string
  postedAt: string
  createdAt: string
  updatedAt: string
}

export type LedgerEntry = {
  id: string
  accountId: string
  transactionId: string
  debitAmount: number | null
  creditAmount: number | null
  description: string
  balanceAfter: number
  createdAt: string
}

/** `GET /admin/transactions/{id}` — extends list row with ledger lines and display names. */
export type TransactionDetail = Transaction & {
  ledgerEntries: LedgerEntry[]
  initiatorName: string
  recipientName: string
}

/** Snapshot from `GET /admin/analytics/transactions/summary`. */
export type TransactionsAnalyticsSummary = {
  totalTransactions: number
  totalValue: number
  currency: string
  byType: Partial<Record<string, number>>
  byStatus: Partial<Record<string, number>>
  byDirection: Partial<Record<string, number>>
  averageTransactionValue: number
}

/** One row in `recentFlags` from `GET /admin/analytics/aml-flags`. */
export type AmlRecentFlag = {
  transactionId: string
  initiatorId: string
  amount: number
  flagReason: string
  flaggedAt: string
  status: string
}

/** AML flag counts and recent items from `GET /admin/analytics/aml-flags`. */
export type AmlFlagsAnalytics = {
  totalFlagged: number
  pendingReview: number
  approved: number
  rejected: number
  recentFlags: AmlRecentFlag[]
}

export type AmlFlagsAnalyticsApiEnvelope = AnalyticsApiEnvelope<AmlFlagsAnalytics>
