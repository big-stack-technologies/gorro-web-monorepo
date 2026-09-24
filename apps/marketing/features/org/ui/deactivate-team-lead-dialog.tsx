"use client"

import type { MouseEvent } from "react"
import { Loader2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@gorro/ui/components/ui/alert-dialog"
import type { MarketingTeamLead } from "@/features/cgas/types"
import { usePatchTeamLead } from "@/features/org/usecases"

type DeactivateTeamLeadDialogProps = {
  teamLead: MarketingTeamLead | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeactivateTeamLeadDialog({
  teamLead,
  open,
  onOpenChange,
}: DeactivateTeamLeadDialogProps) {
  const patchTeamLead = usePatchTeamLead()

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && !patchTeamLead.isPending) onOpenChange(false)
  }

  function handleDeactivate(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (!teamLead) return

    patchTeamLead.mutate(
      { id: teamLead.id, payload: { isActive: false } },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate team lead?</AlertDialogTitle>
          <AlertDialogDescription>
            {teamLead?.name
              ? `${teamLead.name} will be marked inactive. CGAs keep their assignment until you change it.`
              : "This team lead will be marked inactive. CGAs keep their assignment until you change it."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={patchTeamLead.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!teamLead || patchTeamLead.isPending}
            onClick={handleDeactivate}
          >
            {patchTeamLead.isPending ? (
              <Loader2Icon data-icon="inline-start" className="animate-spin" />
            ) : null}
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
