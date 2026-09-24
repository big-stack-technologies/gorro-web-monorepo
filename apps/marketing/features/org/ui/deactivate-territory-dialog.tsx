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
import type { MarketingTerritory } from "@/features/cgas/types"
import { usePatchTerritory } from "@/features/org/usecases"

type DeactivateTerritoryDialogProps = {
  territory: MarketingTerritory | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeactivateTerritoryDialog({
  territory,
  open,
  onOpenChange,
}: DeactivateTerritoryDialogProps) {
  const patchTerritory = usePatchTerritory()

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && !patchTerritory.isPending) onOpenChange(false)
  }

  function handleDeactivate(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (!territory) return

    patchTerritory.mutate(
      { id: territory.id, payload: { isActive: false } },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate territory?</AlertDialogTitle>
          <AlertDialogDescription>
            {territory?.name
              ? `${territory.name} will be marked inactive. Existing assignments stay until changed.`
              : "This territory will be marked inactive. Existing assignments stay until changed."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={patchTerritory.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!territory || patchTerritory.isPending}
            onClick={handleDeactivate}
          >
            {patchTerritory.isPending ? (
              <Loader2Icon data-icon="inline-start" className="animate-spin" />
            ) : null}
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
