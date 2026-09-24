"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { BanIcon, EyeIcon } from "lucide-react"

import {
  DataTableRowActions,
  type DataTableRowActionGroup,
} from "@gorro/ui/components/data-table"
import type { ClusterWithdrawal } from "@/features/clusters/types"
import { routes } from "@/lib/routes"

import { RejectClusterWithdrawalDialog } from "./reject-cluster-withdrawal-dialog"

export function ClusterWithdrawalRowActions({
  withdrawal,
  showViewCluster = false,
}: {
  withdrawal: ClusterWithdrawal
  showViewCluster?: boolean
}) {
  const router = useRouter()
  const [rejectOpen, setRejectOpen] = useState(false)
  const rejectDisabled =
    withdrawal.status === "COMPLETED" || withdrawal.status === "REJECTED"

  const groups = useMemo((): DataTableRowActionGroup[] => {
    const viewGroup: DataTableRowActionGroup | null = showViewCluster
      ? {
          id: "view",
          items: [
            {
              id: "view-cluster",
              label: "View cluster",
              icon: EyeIcon,
              onSelect: () =>
                router.push(
                  routes.protected.clusters.detail(withdrawal.clusterId)
                ),
            },
          ],
        }
      : null

    return [
      ...(viewGroup ? [viewGroup] : []),
      {
        id: "moderate",
        items: [
          {
            id: "reject",
            label: "Force reject",
            icon: BanIcon,
            variant: "destructive",
            disabled: rejectDisabled,
            onSelect: () => setRejectOpen(true),
          },
        ],
      },
    ]
  }, [rejectDisabled, router, showViewCluster, withdrawal.clusterId])

  return (
    <>
      <DataTableRowActions
        subjectLabel={withdrawal.id}
        menuTitle={withdrawal.clusterName}
        groups={groups}
      />
      <RejectClusterWithdrawalDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        withdrawal={withdrawal}
      />
    </>
  )
}
