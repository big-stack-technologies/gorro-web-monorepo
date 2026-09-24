import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@gorro/ui/components/ui/badge"
import {
  AJO_CURRENCY,
  getAjoFrequencyLabel,
  getAjoGroupTypeLabel,
} from "@/features/ajo/constants"
import type { AjoGroupListItem } from "@/features/ajo/types"
import { AjoGroupRowActions } from "@/features/ajo/ui/ajo-group-row-actions"
import { AjoGroupStatusBadge } from "@/features/ajo/ui/ajo-group-status-badge"
import { formatCurrencyAmount, formatDateTime } from "@gorro/ui/utils"

export const ajoGroupsColumns: ColumnDef<AjoGroupListItem>[] = [
  {
    accessorKey: "name",
    header: "Group",
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline">{getAjoGroupTypeLabel(row.original.type)}</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <AjoGroupStatusBadge status={row.original.status} />,
  },
  {
    id: "organiser",
    header: "Organiser",
    cell: ({ row }) => (
      <div className="min-w-44">
        <p>{row.original.organiserName}</p>
        <p className="truncate text-xs text-muted-foreground">
          {row.original.organiserEmail}
        </p>
      </div>
    ),
  },
  {
    id: "contribution",
    header: "Contribution",
    cell: ({ row }) => (
      <div className="min-w-28">
        <p>
          {formatCurrencyAmount(
            row.original.contributionAmount,
            AJO_CURRENCY
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          {getAjoFrequencyLabel(row.original.frequency)}
        </p>
      </div>
    ),
  },
  {
    id: "slots",
    header: "Slots",
    cell: ({ row }) =>
      `${row.original.slotsFilled}/${row.original.slotsTotal}`,
  },
  {
    accessorKey: "membersCount",
    header: "Members",
    cell: ({ row }) => row.original.membersCount.toLocaleString(),
  },
  {
    accessorKey: "poolBalance",
    header: "Pool",
    cell: ({ row }) =>
      formatCurrencyAmount(row.original.poolBalance, AJO_CURRENCY),
  },
  {
    accessorKey: "currentCycleNumber",
    header: "Cycle",
    cell: ({ row }) => row.original.currentCycleNumber.toLocaleString(),
  },
  {
    accessorKey: "createdByAdmin",
    header: "Creator",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.createdByAdmin ? "Admin" : "User"}
      </Badge>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start",
    cell: ({ row }) => formatDateTime(row.original.startDate),
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
    cell: ({ row }) => <AjoGroupRowActions group={row.original} />,
  },
]
