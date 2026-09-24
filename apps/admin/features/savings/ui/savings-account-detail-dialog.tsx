"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@gorro/ui/components/ui/dialog"
import { Separator } from "@gorro/ui/components/ui/separator"
import {
  getSavingsAccountStatusLabel,
  getSavingsMetricsProductLabel,
  SAVINGS_CURRENCY,
} from "@/features/savings/constants"
import type { SavingsAccount } from "@/features/savings/types"
import { formatCurrencyAmount, formatDateTime } from "@gorro/ui/utils"

type DetailRow = {
  label: string
  value: string
}

function DetailGrid({ rows }: { rows: DetailRow[] }) {
  if (rows.length === 0) return null
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="space-y-0.5">
          <dt className="text-xs text-muted-foreground">{row.label}</dt>
          <dd className="text-sm font-medium tabular-nums">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function formatOptionalCurrency(value: number | undefined) {
  if (value == null || Number.isNaN(value)) return "—"
  return formatCurrencyAmount(value, SAVINGS_CURRENCY)
}

function formatOptionalPercent(value: number | undefined) {
  if (value == null || Number.isNaN(value)) return "—"
  return `${value}%`
}

type SavingsAccountDetailDialogProps = {
  account: SavingsAccount
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SavingsAccountDetailDialog({
  account,
  open,
  onOpenChange,
}: SavingsAccountDetailDialogProps) {
  const coreRows: DetailRow[] = [
    { label: "Account ID", value: account.accountId },
    { label: "User ID", value: account.userId },
    { label: "Product", value: getSavingsMetricsProductLabel(account.product) },
    { label: "Status", value: getSavingsAccountStatusLabel(account.status) },
    { label: "KYC tier", value: String(account.kycTier) },
    {
      label: "Principal",
      value: formatCurrencyAmount(account.principalSaved, SAVINGS_CURRENCY),
    },
    {
      label: "Current balance",
      value: formatCurrencyAmount(account.currentBalance, SAVINGS_CURRENCY),
    },
    {
      label: "Interest rate",
      value: formatOptionalPercent(account.interestRateApplied),
    },
    { label: "Opened", value: formatDateTime(account.dateOpened) },
    {
      label: "Maturity",
      value: account.maturityDate
        ? formatDateTime(account.maturityDate)
        : "—",
    },
  ]

  const productRows: DetailRow[] = []

  if (account.accrualRate != null) {
    productRows.push({
      label: "Accrual rate",
      value: formatOptionalPercent(account.accrualRate),
    })
  }
  if (account.yieldToDate != null) {
    productRows.push({
      label: "Yield to date",
      value: formatOptionalCurrency(account.yieldToDate),
    })
  }
  if (account.lockInDurationDays != null) {
    productRows.push({
      label: "Lock-in duration",
      value: `${account.lockInDurationDays} days`,
    })
  }
  if (account.earlyWithdrawalPenaltyPercent != null) {
    productRows.push({
      label: "Early withdrawal penalty",
      value: formatOptionalPercent(account.earlyWithdrawalPenaltyPercent),
    })
  }
  if (account.targetAmount != null) {
    productRows.push({
      label: "Target amount",
      value: formatOptionalCurrency(account.targetAmount),
    })
  }
  if (account.targetDate) {
    productRows.push({
      label: "Target date",
      value: formatDateTime(account.targetDate),
    })
  }
  if (account.progressPercent != null) {
    productRows.push({
      label: "Progress",
      value: formatOptionalPercent(account.progressPercent),
    })
  }
  if (account.autoSaveFrequency) {
    productRows.push({
      label: "Auto-save frequency",
      value: account.autoSaveFrequency,
    })
  }
  if (account.upfrontInterestAmount != null) {
    productRows.push({
      label: "Upfront interest",
      value: formatOptionalCurrency(account.upfrontInterestAmount),
    })
  }
  if (account.dateInterestPaid) {
    productRows.push({
      label: "Interest paid on",
      value: formatDateTime(account.dateInterestPaid),
    })
  }
  if (account.principalLocked != null) {
    productRows.push({
      label: "Principal locked",
      value: formatOptionalCurrency(account.principalLocked),
    })
  }
  if (account.statedRatePercent != null) {
    productRows.push({
      label: "Stated rate",
      value: formatOptionalPercent(account.statedRatePercent),
    })
  }
  if (account.effectiveYieldPercent != null) {
    productRows.push({
      label: "Effective yield",
      value: formatOptionalPercent(account.effectiveYieldPercent),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Savings account</DialogTitle>
          <DialogDescription className="truncate">
            {account.name}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[min(70vh,520px)] space-y-4 overflow-y-auto px-4 py-4">
          <DetailGrid rows={coreRows} />
          {productRows.length > 0 ? (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Product details
                </p>
                <DetailGrid rows={productRows} />
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
