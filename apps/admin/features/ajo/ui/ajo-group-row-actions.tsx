"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { EyeIcon } from "lucide-react"

import {
  DataTableRowActions,
  type DataTableRowActionGroup,
} from "@gorro/ui/components/data-table"
import type { AjoGroupListItem } from "@/features/ajo/types"
import { routes } from "@/lib/routes"

export function AjoGroupRowActions({ group }: { group: AjoGroupListItem }) {
  const router = useRouter()
  const groups = useMemo(
    (): DataTableRowActionGroup[] => [
      {
        id: "view",
        items: [
          {
            id: "view-details",
            label: "View group",
            icon: EyeIcon,
            onSelect: () =>
              router.push(routes.protected.ajo.groupDetail(group.id)),
          },
        ],
      },
    ],
    [group.id, router]
  )

  return (
    <DataTableRowActions
      subjectLabel={group.name}
      menuTitle={group.name}
      groups={groups}
    />
  )
}
