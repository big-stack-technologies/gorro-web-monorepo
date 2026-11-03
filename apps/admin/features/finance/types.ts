/**
 * `/admin/finance/*` response shapes. Every `...MinorUnits` / `minorUnits`
 * field is kobo — divide by 100 for naira.
 */

export type FinancePeriodFilters = {
  /** `YYYY-MM-DD` (or ISO from the date picker); defaults to 30 days before `to`. */
  from?: string
  /** `YYYY-MM-DD`, inclusive; defaults to today. */
  to?: string
}

export type FinanceDailyRow = {
  date: string
  feeRevenueMinorUnits: number
  productFeeRevenueMinorUnits: number
  totalRevenueMinorUnits: number
  processorCostMinorUnits: number
  interestPaidMinorUnits: number
  totalCostMinorUnits: number
  netMinorUnits: number
  cumulativeNetMinorUnits: number
}

/** `GET /admin/finance/daily` — `days` only contains days with activity. */
export type FinanceDailyResponse = {
  from: string
  to: string
  days: FinanceDailyRow[]
  totals: {
    totalRevenueMinorUnits: number
    totalCostMinorUnits: number
    netMinorUnits: number
  }
  partial: boolean
  partialReason?: string | null
}

export type FinanceProductFee = {
  account: string
  minorUnits: number
}

export type FinancePendingFees = {
  status: string
  count: number
  minorUnits: number
}

/** `GET /admin/finance/revenue` */
export type FinanceRevenueResponse = {
  from: string
  to: string
  walletAndTransferFees: {
    minorUnits: number
    count: number
    note?: string | null
  }
  productFees: FinanceProductFee[]
  totalRealisedMinorUnits: number
  /** Charged but not settled — never part of revenue. */
  pending: FinancePendingFees[]
  pendingNote?: string | null
  /** `null` until the Ekondo float spread is instrumented. */
  floatSpread: number | null
  floatSpreadNote?: string | null
}

export type FinanceProcessorCost = {
  rail: string
  minorUnits: number
  count: number
}

export type FinanceKycCheckVolume = {
  type: string
  status: string
  checks: number
}

/** `GET /admin/finance/costs` */
export type FinanceCostsResponse = {
  from: string
  to: string
  processors: FinanceProcessorCost[]
  processorNote?: string | null
  interestPaidMinorUnits: number
  identityVerification: {
    checks: number
    successful: number
    minorUnits: number
  }
  identityVerificationNote?: string | null
  /** Volume only — no naira figure on purpose. */
  kycChecks: FinanceKycCheckVolume[]
  kycChecksNote?: string | null
  totalCostMinorUnits: number
  totalCostNote?: string | null
}

/** `GET /admin/finance/liquidity` — point-in-time, no date params. */
export type FinanceLiquidityResponse = {
  excludingAccruedInterestMinorUnits: number
  includingAccruedInterestMinorUnits: number
  accruedInterestMinorUnits: number
  breakdown: {
    accruedSavingsMinorUnits: number
    accruedSmartWalletMinorUnits: number
  }
  /** `null` means not tracked — never ₦0. */
  fundsInTransit: number | null
  fundsInTransitNote?: string | null
  /** `null` means no reconciliation exists — never a tick. */
  reconciliation: unknown
  reconciliationNote?: string | null
}
