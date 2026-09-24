"use client"

import { useMemo, useState } from "react"
import { PencilIcon, UsersIcon } from "lucide-react"

import {
  DataTableRowActions,
  type DataTableRowActionGroup,
  type DataTableRowActionItem,
} from "@gorro/ui/components/data-table"
import type { MarketingCommunity } from "@/features/communities/types"

import { CommunityFormDialog } from "./community-form-dialog"
import { CommunityMembersDialog } from "./community-members-dialog"

type CommunityRowActionsProps = {
  community: MarketingCommunity
}

export function CommunityRowActions({ community }: CommunityRowActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [membersOpen, setMembersOpen] = useState(false)

  const groups = useMemo((): DataTableRowActionGroup[] => {
    const items: DataTableRowActionItem[] = [
      {
        id: "edit",
        label: "Edit details",
        icon: PencilIcon,
        onSelect: () => setEditOpen(true),
      },
      {
        id: "manage-members",
        label: "Manage members",
        icon: UsersIcon,
        onSelect: () => setMembersOpen(true),
      },
    ]

    return [{ id: "community-actions", items }]
  }, [])

  return (
    <>
      <DataTableRowActions
        subjectLabel={community.name}
        menuTitle={community.name}
        groups={groups}
      />
      <CommunityFormDialog
        community={community}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <CommunityMembersDialog
        community={community}
        open={membersOpen}
        onOpenChange={setMembersOpen}
      />
    </>
  )
}
