"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { EyeIcon } from "lucide-react"

import {
  DataTableRowActions,
  type DataTableRowActionGroup,
} from "@gorro/ui/components/data-table"
import type { ClusterListItem } from "@/features/clusters/types"
import { routes } from "@/lib/routes"

export function ClusterRowActions({ cluster }: { cluster: ClusterListItem }) {
  const router = useRouter()
  const groups = useMemo(
    (): DataTableRowActionGroup[] => [
      {
        id: "view",
        items: [
          {
            id: "view-details",
            label: "View details",
            icon: EyeIcon,
            onSelect: () =>
              router.push(routes.protected.clusters.detail(cluster.id)),
          },
        ],
      },
    ],
    [cluster.id, router]
  )

  return (
    <DataTableRowActions
      subjectLabel={cluster.name}
      menuTitle={cluster.name}
      groups={groups}
    />
  )
}
