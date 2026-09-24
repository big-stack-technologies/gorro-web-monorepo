"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { formatUtcDate } from "@gorro/ui/utils"

import { metricLabel, formatMetricValue } from "@/features/overview/format"
import type { MarketingTarget } from "@/features/targets-and-alerts/types"

export const targetHistoryColumns: ColumnDef<MarketingTarget>[] = [
  {
    accessorKey: "periodMonth",
    header: "Month",
    cell: ({ row }) => formatUtcDate(row.original.periodMonth),
  },
  {
    accessorKey: "metric",
    header: "Metric",
    cell: ({ row }) => metricLabel(row.original.metric),
  },
  {
    accessorKey: "targetValue",
    header: "Target",
    cell: ({ row }) =>
      formatMetricValue(row.original.metric, row.original.targetValue),
  },
]
