"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { formatNgn } from "@gorro/ui/utils"

import { SortHeader } from "@/features/cgas/columns/column-utils"
import type { FieldReportComparisonRow } from "@/features/cgas/types"

function countCell(value: number) {
  return value.toLocaleString()
}

function varianceCount(value: number) {
  const formatted = value.toLocaleString()
  return value > 0 ? `+${formatted}` : formatted
}

function varianceMoney(value: number) {
  const formatted = formatNgn(value)
  return value > 0 ? `+${formatted}` : formatted
}

export const fieldReportComparisonColumns: ColumnDef<FieldReportComparisonRow>[] =
  [
    {
      accessorKey: "name",
      header: ({ column }) => <SortHeader label="CGA" column={column} />,
      cell: ({ row }) => row.original.name || "—",
    },
    {
      accessorKey: "reportedRegistrations",
      header: ({ column }) => (
        <SortHeader label="Signups reported" column={column} />
      ),
      cell: ({ row }) => countCell(row.original.reportedRegistrations),
    },
    {
      accessorKey: "actualSignups",
      header: ({ column }) => (
        <SortHeader label="Signups measured" column={column} />
      ),
      cell: ({ row }) => countCell(row.original.actualSignups),
    },
    {
      accessorKey: "variance",
      header: ({ column }) => (
        <SortHeader label="Signups variance" column={column} />
      ),
      cell: ({ row }) => varianceCount(row.original.variance),
    },
    {
      accessorKey: "reportedKyc",
      header: ({ column }) => (
        <SortHeader label="KYCs reported" column={column} />
      ),
      cell: ({ row }) => countCell(row.original.reportedKyc),
    },
    {
      accessorKey: "actualKyc",
      header: ({ column }) => (
        <SortHeader label="KYCs measured" column={column} />
      ),
      cell: ({ row }) => countCell(row.original.actualKyc),
    },
    {
      accessorKey: "kycVariance",
      header: ({ column }) => (
        <SortHeader label="KYCs variance" column={column} />
      ),
      cell: ({ row }) => varianceCount(row.original.kycVariance),
    },
    {
      accessorKey: "reportedFirstDeposits",
      header: ({ column }) => (
        <SortHeader label="First deposits reported" column={column} />
      ),
      cell: ({ row }) => countCell(row.original.reportedFirstDeposits),
    },
    {
      accessorKey: "actualFirstDeposits",
      header: ({ column }) => (
        <SortHeader label="First deposits measured" column={column} />
      ),
      cell: ({ row }) => countCell(row.original.actualFirstDeposits),
    },
    {
      accessorKey: "firstDepositVariance",
      header: ({ column }) => (
        <SortHeader label="First deposits variance" column={column} />
      ),
      cell: ({ row }) => varianceCount(row.original.firstDepositVariance),
    },
    {
      accessorKey: "reportedDepositValue",
      header: ({ column }) => (
        <SortHeader label="Deposit value reported" column={column} />
      ),
      cell: ({ row }) => formatNgn(row.original.reportedDepositValue),
    },
    {
      accessorKey: "actualDepositValue",
      header: ({ column }) => (
        <SortHeader label="Deposit value measured" column={column} />
      ),
      cell: ({ row }) => formatNgn(row.original.actualDepositValue),
    },
    {
      accessorKey: "depositValueVariance",
      header: ({ column }) => (
        <SortHeader label="Deposit value variance" column={column} />
      ),
      cell: ({ row }) => varianceMoney(row.original.depositValueVariance),
    },
    {
      accessorKey: "daysReported",
      header: ({ column }) => (
        <SortHeader label="Days reported" column={column} />
      ),
      cell: ({ row }) => countCell(row.original.daysReported),
    },
    {
      accessorKey: "reportingCompliancePct",
      header: ({ column }) => (
        <SortHeader label="Reporting %" column={column} />
      ),
      cell: ({ row }) => `${row.original.reportingCompliancePct}%`,
    },
  ]
