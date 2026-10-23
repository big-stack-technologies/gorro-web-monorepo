"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { formatUtcDate } from "@gorro/ui/utils"

import { SortHeader } from "@/features/cgas/columns/column-utils"
import { formatKobo } from "@/features/finance/format"
import type { FinanceDailyRow } from "@/features/finance/types"

function koboColumn(
  key: keyof FinanceDailyRow,
  label: string
): ColumnDef<FinanceDailyRow> {
  return {
    accessorKey: key,
    header: ({ column }) => <SortHeader label={label} column={column} />,
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatKobo(Number(row.original[key]))}
      </span>
    ),
  }
}

export const financeDailyColumns: ColumnDef<FinanceDailyRow>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => <SortHeader label="Date" column={column} />,
    cell: ({ row }) => formatUtcDate(row.original.date),
  },
  koboColumn("feeRevenueMinorUnits", "Fee revenue"),
  koboColumn("productFeeRevenueMinorUnits", "Product fees"),
  koboColumn("totalRevenueMinorUnits", "Total revenue"),
  koboColumn("processorCostMinorUnits", "Processor cost"),
  koboColumn("interestPaidMinorUnits", "Interest paid"),
  koboColumn("totalCostMinorUnits", "Total cost"),
  koboColumn("netMinorUnits", "Net (partial)"),
  koboColumn("cumulativeNetMinorUnits", "Running net (partial)"),
]
