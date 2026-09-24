"use client"

import { useMemo, useState } from "react"
import { BanIcon, PencilIcon } from "lucide-react"

import {
  DataTableRowActions,
  type DataTableRowActionGroup,
  type DataTableRowActionItem,
} from "@gorro/ui/components/data-table"
import type { MarketingTerritory } from "@/features/cgas/types"

import { DeactivateTerritoryDialog } from "./deactivate-territory-dialog"
import { TerritoryFormDialog } from "./territory-form-dialog"

type TerritoryRowActionsProps = {
  territory: MarketingTerritory
}

export function TerritoryRowActions({ territory }: TerritoryRowActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deactivateOpen, setDeactivateOpen] = useState(false)

  const groups = useMemo((): DataTableRowActionGroup[] => {
    const items: DataTableRowActionItem[] = [
      {
        id: "edit",
        label: "Rename or change code",
        icon: PencilIcon,
        onSelect: () => setEditOpen(true),
      },
    ]

    if (territory.isActive) {
      items.push({
        id: "deactivate",
        label: "Deactivate",
        icon: BanIcon,
        variant: "destructive",
        onSelect: () => setDeactivateOpen(true),
      })
    }

    return [{ id: "territory-actions", items }]
  }, [territory.isActive])

  return (
    <>
      <DataTableRowActions
        subjectLabel={territory.name}
        menuTitle={territory.name}
        groups={groups}
      />
      <TerritoryFormDialog
        territory={territory}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      {territory.isActive ? (
        <DeactivateTerritoryDialog
          territory={territory}
          open={deactivateOpen}
          onOpenChange={setDeactivateOpen}
        />
      ) : null}
    </>
  )
}
