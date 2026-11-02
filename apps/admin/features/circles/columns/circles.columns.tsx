import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@gorro/ui/components/ui/badge"
import {
  CIRCLE_CURRENCY,
  CIRCLE_VISIBILITY_LABELS,
} from "@/features/circles/constants"
import type { CircleListItem } from "@/features/circles/types"
import { CircleProgress } from "@/features/circles/ui/circle-progress"
import { CircleRowActions } from "@/features/circles/ui/circle-row-actions"
import { CircleStatusBadge } from "@/features/circles/ui/circle-status-badge"
import {
  formatCurrencyAmount,
  formatDateTime,
  formatUtcDate,
} from "@gorro/ui/utils"

export const circlesColumns: ColumnDef<CircleListItem>[] = [
  {
    accessorKey: "name",
    header: "Circle",
    cell: ({ row }) => (
      <div className="min-w-44">
        <p className="font-medium">{row.original.name}</p>
        <p className="font-mono text-xs text-muted-foreground">
          {row.original.code}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <CircleStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "visibility",
    header: "Visibility",
    cell: ({ row }) => (
      <Badge variant="outline">
        {CIRCLE_VISIBILITY_LABELS[row.original.visibility]}
      </Badge>
    ),
  },
  {
    accessorKey: "ownerName",
    header: "Owner",
  },
  {
    id: "saved",
    header: "Saved / goal",
    cell: ({ row }) => (
      <div className="min-w-40">
        <p className="text-sm tabular-nums">
          {formatCurrencyAmount(row.original.savedNaira, CIRCLE_CURRENCY)}{" "}
          <span className="text-muted-foreground">
            of {formatCurrencyAmount(row.original.goalNaira, CIRCLE_CURRENCY)}
          </span>
        </p>
        <CircleProgress percentSaved={row.original.percentSaved} />
      </div>
    ),
  },
  {
    accessorKey: "memberCount",
    header: "Active members",
    cell: ({ row }) => row.original.memberCount.toLocaleString(),
  },
  {
    accessorKey: "fundedMemberCount",
    header: "Ever funded",
    cell: ({ row }) => row.original.fundedMemberCount.toLocaleString(),
  },
  {
    accessorKey: "maturityDate",
    header: "Matures",
    cell: ({ row }) => formatUtcDate(row.original.maturityDate),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <CircleRowActions circle={row.original} />,
  },
]
