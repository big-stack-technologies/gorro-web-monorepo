import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@gorro/ui/components/ui/badge"
import {
  getSavingsAccountStatusLabel,
  getSavingsMetricsProductLabel,
  SAVINGS_CURRENCY,
} from "@/features/savings/constants"
import type { SavingsAccount } from "@/features/savings/types"
import { SavingsAccountRowActions } from "@/features/savings/ui/savings-account-row-actions"
import {
  emptyAsNa,
  formatCurrencyAmount,
  formatDateTime,
} from "@gorro/ui/utils"

function PersonCell({
  name,
  email,
  phone,
}: {
  name: string
  email?: string | null
  phone?: string | null
}) {
  return (
    <div className="min-w-0 space-y-0.5">
      <p className="truncate font-medium">{name}</p>
      <p className="truncate text-xs text-muted-foreground">
        {emptyAsNa(email ?? phone ?? null)}
      </p>
    </div>
  )
}

function formatPercent(value: number | undefined) {
  if (value == null || Number.isNaN(value)) return "—"
  return `${value}%`
}

export const savingsAccountsColumns: ColumnDef<SavingsAccount>[] = [
  {
    id: "user",
    header: "User",
    accessorFn: (row) => row.name,
    cell: ({ row }) => (
      <PersonCell
        name={row.original.name}
        email={row.original.email}
        phone={row.original.phone}
      />
    ),
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {getSavingsMetricsProductLabel(row.original.product)}
      </Badge>
    ),
  },
  {
    accessorKey: "principalSaved",
    header: "Principal",
    cell: ({ row }) =>
      formatCurrencyAmount(row.original.principalSaved, SAVINGS_CURRENCY),
  },
  {
    accessorKey: "currentBalance",
    header: "Balance",
    cell: ({ row }) =>
      formatCurrencyAmount(row.original.currentBalance, SAVINGS_CURRENCY),
  },
  {
    accessorKey: "interestRateApplied",
    header: "Rate",
    cell: ({ row }) => formatPercent(row.original.interestRateApplied),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline">
        {getSavingsAccountStatusLabel(row.original.status)}
      </Badge>
    ),
  },
  {
    accessorKey: "dateOpened",
    header: "Opened",
    cell: ({ row }) => formatDateTime(row.original.dateOpened),
  },
  {
    accessorKey: "maturityDate",
    header: "Maturity",
    cell: ({ row }) =>
      row.original.maturityDate
        ? formatDateTime(row.original.maturityDate)
        : "—",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <SavingsAccountRowActions account={row.original} />,
  },
]
