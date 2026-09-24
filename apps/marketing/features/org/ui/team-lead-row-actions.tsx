"use client"

import { useMemo, useState } from "react"
import { BanIcon, PencilIcon } from "lucide-react"

import {
  DataTableRowActions,
  type DataTableRowActionGroup,
  type DataTableRowActionItem,
} from "@gorro/ui/components/data-table"
import type { MarketingTeamLead } from "@/features/cgas/types"

import { DeactivateTeamLeadDialog } from "./deactivate-team-lead-dialog"
import { TeamLeadFormDialog } from "./team-lead-form-dialog"

type TeamLeadRowActionsProps = {
  teamLead: MarketingTeamLead
}

export function TeamLeadRowActions({ teamLead }: TeamLeadRowActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deactivateOpen, setDeactivateOpen] = useState(false)

  const groups = useMemo((): DataTableRowActionGroup[] => {
    const items: DataTableRowActionItem[] = [
      {
        id: "edit",
        label: "Edit",
        icon: PencilIcon,
        onSelect: () => setEditOpen(true),
      },
    ]

    if (teamLead.isActive) {
      items.push({
        id: "deactivate",
        label: "Deactivate",
        icon: BanIcon,
        variant: "destructive",
        onSelect: () => setDeactivateOpen(true),
      })
    }

    return [{ id: "team-lead-actions", items }]
  }, [teamLead.isActive])

  return (
    <>
      <DataTableRowActions
        subjectLabel={teamLead.name}
        menuTitle={teamLead.name}
        groups={groups}
      />
      <TeamLeadFormDialog
        teamLead={teamLead}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      {teamLead.isActive ? (
        <DeactivateTeamLeadDialog
          teamLead={teamLead}
          open={deactivateOpen}
          onOpenChange={setDeactivateOpen}
        />
      ) : null}
    </>
  )
}
