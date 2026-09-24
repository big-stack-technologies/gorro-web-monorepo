"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@gorro/ui/components/ui/badge"
import { formatNgn, formatSnakeCaseWords } from "@gorro/ui/utils"

import { SortHeader } from "@/features/cgas/columns/column-utils"
import { CGA_STATUS_LABELS } from "@/features/cgas/constants"
import type { TeamLeadPerformanceRow } from "@/features/org/types"

const highlightClass = "font-semibold text-primary tabular-nums"

function statusVariant(status: string) {
  if (status === "ON_TRACK") return "success" as const
  if (status === "AT_RISK") return "destructive" as const
  return "secondary" as const
}

export const teamLeadPerformanceColumns: ColumnDef<TeamLeadPerformanceRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortHeader label="Team lead" column={column} />,
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{row.original.name}</span>
        {row.original.territory ? (
          <span className="text-xs text-muted-foreground">
            {row.original.territory.name}
          </span>
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "cgaCount",
    header: ({ column }) => <SortHeader label="CGAs" column={column} />,
    cell: ({ row }) => row.original.cgaCount.toLocaleString(),
  },
  {
    accessorKey: "cgasWithoutTarget",
    header: ({ column }) => (
      <SortHeader label="CGAs without target" column={column} />
    ),
    cell: ({ row }) => row.original.cgasWithoutTarget.toLocaleString(),
  },
  {
    accessorKey: "avgCgaAchievementPct",
    header: ({ column }) => (
      <SortHeader label="Avg CGA achievement %" column={column} />
    ),
    cell: ({ row }) =>
      row.original.avgCgaAchievementPct == null ? (
        <span className="text-muted-foreground">No target</span>
      ) : (
        <span className={highlightClass}>
          {row.original.avgCgaAchievementPct}%
        </span>
      ),
  },
  {
    accessorKey: "cgasAtOrAbove80Pct",
    header: ({ column }) => (
      <SortHeader label="CGAs ≥80% of target" column={column} />
    ),
    cell: ({ row }) =>
      row.original.cgasAtOrAbove80Pct == null ? (
        <span className="text-muted-foreground">—</span>
      ) : (
        <span className={highlightClass}>
          {row.original.cgasAtOrAbove80Pct}%
        </span>
      ),
  },
  {
    accessorKey: "signups",
    header: ({ column }) => <SortHeader label="Sign-ups" column={column} />,
    cell: ({ row }) => row.original.signups.toLocaleString(),
  },
  {
    accessorKey: "gtv",
    header: ({ column }) => <SortHeader label="GTV" column={column} />,
    cell: ({ row }) => formatNgn(row.original.gtv),
  },
  {
    accessorKey: "achievementPct",
    header: ({ column }) => (
      <SortHeader label="Team achievement %" column={column} />
    ),
    cell: ({ row }) =>
      row.original.achievementPct == null ? (
        <span className="text-muted-foreground">No target</span>
      ) : (
        `${row.original.achievementPct}%`
      ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant={statusVariant(status)}>
          {CGA_STATUS_LABELS[status] ?? formatSnakeCaseWords(status)}
        </Badge>
      )
    },
  },
]
