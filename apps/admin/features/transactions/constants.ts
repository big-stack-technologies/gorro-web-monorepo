import type { TransactionDirection, TransactionStatus, TransactionType } from "./types"

const STATUS_LABELS: Record<TransactionStatus, string> = {
  PENDING: "Pending",
  POSTING: "Posting",
  POSTED: "Posted",
  FAILED: "Failed",
  PENDING_REVIEW: "Pending review",
  REVERSED: "Reversed",
}

const TYPE_LABELS: Record<TransactionType, string> = {
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
  TRANSFER: "Transfer",
  BILL_PAYMENT: "Bill payment",
  REVERSAL: "Reversal",
  INTEREST: "Interest",
  ADJUSTMENT: "Adjustment",
  FEE: "Fee",
}

const DIRECTION_LABELS: Record<TransactionDirection, string> = {
  INBOUND: "Inbound",
  OUTBOUND: "Outbound",
  INTERNAL: "Internal",
}

export const TRANSACTION_STATUSES: readonly TransactionStatus[] = [
  "PENDING",
  "POSTING",
  "POSTED",
  "FAILED",
  "PENDING_REVIEW",
  "REVERSED",
] as const

export const TRANSACTION_TYPES: readonly TransactionType[] = [
  "DEPOSIT",
  "WITHDRAWAL",
  "TRANSFER",
  "BILL_PAYMENT",
  "REVERSAL",
  "INTEREST",
  "ADJUSTMENT",
  "FEE",
] as const

export const TRANSACTION_DIRECTIONS: readonly TransactionDirection[] = [
  "INBOUND",
  "OUTBOUND",
  "INTERNAL",
] as const

export const TRANSACTION_STATUS_FILTER_OPTIONS = TRANSACTION_STATUSES.map(
  (value) => ({
    value,
    label: STATUS_LABELS[value],
  })
)

export const TRANSACTION_TYPE_FILTER_OPTIONS = TRANSACTION_TYPES.map(
  (value) => ({
    value,
    label: TYPE_LABELS[value],
  })
)

export const TRANSACTION_DIRECTION_FILTER_OPTIONS = TRANSACTION_DIRECTIONS.map(
  (value) => ({
    value,
    label: DIRECTION_LABELS[value],
  })
)
