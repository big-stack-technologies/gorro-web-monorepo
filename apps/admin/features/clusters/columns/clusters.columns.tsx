import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@gorro/ui/components/ui/badge"
import { CLUSTER_CURRENCY } from "@/features/clusters/constants"
import type { ClusterListItem } from "@/features/clusters/types"
import { ClusterRowActions } from "@/features/clusters/ui/cluster-row-actions"
import { ClusterStatusBadge } from "@/features/clusters/ui/cluster-status-badge"
import { formatCurrencyAmount, formatDateTime } from "@gorro/ui/utils"

export const clustersColumns: ColumnDef<ClusterListItem>[] = [
  {
    accessorKey: "name",
    header: "Cluster",
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
    cell: ({ row }) => <ClusterStatusBadge status={row.original.status} />,
  },
  {
    id: "owner",
    header: "Owner",
    cell: ({ row }) => (
      <div className="min-w-44">
        <p>{row.original.ownerName}</p>
        <p className="truncate text-xs text-muted-foreground">
          {row.original.ownerEmail}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "memberCount",
    header: "Members",
    cell: ({ row }) => row.original.memberCount.toLocaleString(),
  },
  {
    accessorKey: "balanceNaira",
    header: "Balance",
    cell: ({ row }) =>
      formatCurrencyAmount(row.original.balanceNaira, CLUSTER_CURRENCY),
  },
  {
    accessorKey: "isInterestEnabled",
    header: "Interest",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.isInterestEnabled ? "Enabled" : "Disabled"}
      </Badge>
    ),
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
    cell: ({ row }) => <ClusterRowActions cluster={row.original} />,
  },
]
