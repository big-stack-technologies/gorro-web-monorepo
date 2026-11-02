"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { EyeIcon } from "lucide-react"

import {
  DataTableRowActions,
  type DataTableRowActionGroup,
} from "@gorro/ui/components/data-table"
import type { CircleListItem } from "@/features/circles/types"
import { routes } from "@/lib/routes"

export function CircleRowActions({ circle }: { circle: CircleListItem }) {
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
              router.push(routes.protected.circles.detail(circle.id)),
          },
        ],
      },
    ],
    [circle.id, router]
  )

  return (
    <DataTableRowActions
      subjectLabel={circle.name}
      menuTitle={circle.name}
      groups={groups}
    />
  )
}
