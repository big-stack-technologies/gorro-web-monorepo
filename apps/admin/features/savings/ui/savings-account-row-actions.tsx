"use client"

import { useMemo, useState } from "react"
import { EyeIcon } from "lucide-react"

import {
  DataTableRowActions,
  type DataTableRowActionGroup,
} from "@gorro/ui/components/data-table"
import type { SavingsAccount } from "@/features/savings/types"
import { SavingsAccountDetailDialog } from "@/features/savings/ui/savings-account-detail-dialog"

type SavingsAccountRowActionsProps = {
  account: SavingsAccount
}

export function SavingsAccountRowActions({
  account,
}: SavingsAccountRowActionsProps) {
  const [detailOpen, setDetailOpen] = useState(false)

  const groups = useMemo((): DataTableRowActionGroup[] => {
    return [
      {
        id: "view",
        items: [
          {
            id: "view-details",
            label: "View details",
            icon: EyeIcon,
            onSelect: () => setDetailOpen(true),
          },
        ],
      },
    ]
  }, [])

  return (
    <>
      <DataTableRowActions
        groups={groups}
        subjectLabel={account.name}
      />
      <SavingsAccountDetailDialog
        account={account}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  )
}
