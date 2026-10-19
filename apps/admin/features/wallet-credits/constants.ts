import type {
  WalletCreditCategory,
  WalletCreditProvider,
  WalletCreditTargetType,
} from "@/features/wallet-credits/types"

export const WALLET_CREDIT_TARGET_TYPES: readonly WalletCreditTargetType[] = [
  "USER_WALLET",
  "AJO_WALLET",
  "CLUSTER",
  "SAVINGS_PLAN",
]

export const WALLET_CREDIT_CATEGORIES: readonly WalletCreditCategory[] = [
  "MISSED_DEPOSIT",
  "REFUND_COMPENSATION",
  "PROMO_BONUS",
]

export const WALLET_CREDIT_PROVIDERS: readonly WalletCreditProvider[] = [
  "FINCRA",
  "FLUTTERWAVE",
]

export const WALLET_CREDIT_CATEGORY_LABELS: Record<
  WalletCreditCategory,
  string
> = {
  MISSED_DEPOSIT: "Missed deposit",
  REFUND_COMPENSATION: "Refund / compensation",
  PROMO_BONUS: "Promo bonus",
}

/** Shorter label for confirm summary (spec example). */
export const WALLET_CREDIT_CATEGORY_CONFIRM_LABELS: Record<
  WalletCreditCategory,
  string
> = {
  MISSED_DEPOSIT: "Missed deposit",
  REFUND_COMPENSATION: "Refund/Compensation",
  PROMO_BONUS: "Promo bonus",
}

export const WALLET_CREDIT_CATEGORY_FUNDING: Record<
  WalletCreditCategory,
  string
> = {
  MISSED_DEPOSIT: "Bank Deposits Received",
  REFUND_COMPENSATION: "Operational expense",
  PROMO_BONUS: "Operational expense",
}

export const WALLET_CREDIT_CATEGORY_HINTS: Record<
  WalletCreditCategory,
  string
> = {
  MISSED_DEPOSIT:
    "The customer paid by bank transfer, but it never reached their wallet.",
  REFUND_COMPENSATION:
    "Refund a failed bill payment, or compensate for a service issue.",
  PROMO_BONUS: "A campaign reward or bonus.",
}

export const WALLET_CREDIT_DEFAULT_NARRATION: Record<
  WalletCreditCategory,
  string
> = {
  MISSED_DEPOSIT: "Bank transfer deposit",
  REFUND_COMPENSATION: "Refund from Gorro",
  PROMO_BONUS: "Bonus from Gorro",
}

export const WALLET_CREDIT_TARGET_TYPE_LABELS: Record<
  WalletCreditTargetType,
  string
> = {
  USER_WALLET: "Main wallet",
  AJO_WALLET: "Ajo wallet",
  CLUSTER: "Cluster",
  SAVINGS_PLAN: "Savings plan",
}

export const WALLET_CREDIT_PROVIDER_LABELS: Record<
  WalletCreditProvider,
  string
> = {
  FINCRA: "Fincra",
  FLUTTERWAVE: "Flutterwave",
}

export const WALLET_CREDIT_STATUS_LABELS: Record<string, string> = {
  POSTED: "Posted",
  REVERSED: "Reversed",
}

export const WALLET_ACCOUNT_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  FROZEN: "Frozen",
  ARCHIVED: "Archived",
}

export const REASON_MIN_LENGTH = 5
export const REASON_MAX_LENGTH = 500
export const NARRATION_MAX_LENGTH = 140
export const PROVIDER_REFERENCE_MIN_LENGTH = 6
export const PROVIDER_REFERENCE_MAX_LENGTH = 100
export const REFERENCE_MAX_LENGTH = 100
