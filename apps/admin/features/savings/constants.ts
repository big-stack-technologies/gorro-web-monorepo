import type {
  SavingsAccountStatus,
  SavingsMetricsProduct,
  SavingsProductType,
} from "@/features/savings/types"

export const SAVINGS_CURRENCY = "NGN"

export const SAVINGS_PRODUCT_TYPES = ["FIXED", "TARGET", "VAULT"] as const

export const SAVINGS_METRICS_PRODUCTS = [
  "SMART_WALLET",
  "FIXED",
  "TARGET",
  "VAULT",
] as const

export const SAVINGS_ACCOUNT_STATUSES = [
  "ACTIVE",
  "PENDING_WITHDRAWAL",
  "COMPLETED",
  "WITHDRAWN",
] as const

export const SAVINGS_KYC_TIERS = [0, 1, 2, 3] as const

const SAVINGS_METRICS_PRODUCT_LABELS: Record<SavingsMetricsProduct, string> = {
  SMART_WALLET: "Smart Wallet",
  FIXED: "Fixed",
  TARGET: "Target",
  VAULT: "Vault",
}

const SAVINGS_PRODUCT_TYPE_LABELS: Record<SavingsProductType, string> = {
  FIXED: "Fixed",
  TARGET: "Target",
  VAULT: "Vault",
}

const SAVINGS_ACCOUNT_STATUS_LABELS: Record<SavingsAccountStatus, string> = {
  ACTIVE: "Active",
  PENDING_WITHDRAWAL: "Pending withdrawal",
  COMPLETED: "Completed",
  WITHDRAWN: "Withdrawn",
}

export function getSavingsMetricsProductLabel(product: SavingsMetricsProduct) {
  return SAVINGS_METRICS_PRODUCT_LABELS[product] ?? product
}

export function getSavingsProductTypeLabel(product: SavingsProductType) {
  return SAVINGS_PRODUCT_TYPE_LABELS[product] ?? product
}

export function getSavingsAccountStatusLabel(status: SavingsAccountStatus) {
  return SAVINGS_ACCOUNT_STATUS_LABELS[status] ?? status
}

export const SAVINGS_METRICS_PRODUCT_FILTER_OPTIONS =
  SAVINGS_METRICS_PRODUCTS.map((value) => ({
    label: getSavingsMetricsProductLabel(value),
    value,
  }))

export const SAVINGS_OVERVIEW_PRODUCT_FILTER_OPTIONS = [
  { label: "All products", value: "" },
  ...SAVINGS_METRICS_PRODUCT_FILTER_OPTIONS,
]

export const SAVINGS_ACCOUNT_STATUS_FILTER_OPTIONS =
  SAVINGS_ACCOUNT_STATUSES.map((value) => ({
    label: getSavingsAccountStatusLabel(value),
    value,
  }))

export const SAVINGS_KYC_TIER_FILTER_OPTIONS = SAVINGS_KYC_TIERS.map(
  (value) => ({
    label: `Tier ${value}`,
    value: String(value),
  })
)

export function bpsToPercent(bps: number) {
  return bps / 100
}

export function percentToBps(percent: number) {
  return Math.round(percent * 100)
}

export function nairaToMinorUnits(naira: number) {
  return Math.round(naira * 100)
}
