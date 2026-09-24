import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@gorro/ui/components/ui/badge"
import { CLUSTER_CURRENCY } from "@/features/clusters/constants"
import type { ClusterWithdrawal } from "@/features/clusters/types"
import { ClusterStatusBadge } from "@/features/clusters/ui/cluster-status-badge"
import { ClusterWithdrawalRowActions } from "@/features/clusters/ui/cluster-withdrawal-row-actions"
import { formatCurrencyAmount, formatDateTime } from "@gorro/ui/utils"

type ClusterWithdrawalsColumnsOptions = {
  showViewCluster?: boolean
}

export function getClusterWithdrawalsColumns(
  options: ClusterWithdrawalsColumnsOptions = {}
): ColumnDef<ClusterWithdrawal>[] {
  const { showViewCluster = false } = options

  return [
    {
      accessorKey: "clusterName",
      header: "Cluster",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.clusterName}</span>
      ),
    },
    {
      accessorKey: "requestedByName",
      header: "Requested by",
      cell: ({ row }) => (
        <div className="min-w-40">
          <p>{row.original.requestedByName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {row.original.requestedByEmail}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "amountNaira",
      header: "Amount",
      cell: ({ row }) =>
        formatCurrencyAmount(row.original.amountNaira, CLUSTER_CURRENCY),
    },
    {
      id: "recipient",
      header: "Recipient",
      cell: ({ row }) => (
        <div className="min-w-44">
          <p>{row.original.recipientName}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {row.original.bankName} · {row.original.recipientAccount}
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
      id: "approvals",
      header: "Approvals",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.approvalCount} / {row.original.requiredApprovals}
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
      cell: ({ row }) => (
        <ClusterWithdrawalRowActions
          withdrawal={row.original}
          showViewCluster={showViewCluster}
        />
      ),
    },
  ]
}

/** Global withdrawal queue — includes link to cluster detail. */
export const clusterWithdrawalsColumns = getClusterWithdrawalsColumns({
  showViewCluster: true,
})

/** Withdrawals tab on a cluster detail page — user is already on that cluster. */
export const clusterDetailWithdrawalsColumns = getClusterWithdrawalsColumns({
  showViewCluster: false,
})
