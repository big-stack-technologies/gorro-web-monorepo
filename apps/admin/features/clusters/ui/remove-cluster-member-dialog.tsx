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
import type { ClusterMember } from "@/features/clusters/types"
import { useRemoveClusterMember } from "@/features/clusters/usecases"

type RemoveClusterMemberDialogProps = {
  clusterId: string
  member: ClusterMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RemoveClusterMemberDialog({
  clusterId,
  member,
  open,
  onOpenChange,
}: RemoveClusterMemberDialogProps) {
  const removeMutation = useRemoveClusterMember(clusterId)

  function handleOpenChange(open: boolean) {
    if (!open && !removeMutation.isPending) onOpenChange(false)
  }

  function handleRemove(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (!member) return

    removeMutation.mutate(member.userId, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove cluster member?</AlertDialogTitle>
          <AlertDialogDescription>
            {member?.fullName} will be removed immediately without the normal
            cluster approval process.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={removeMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!member || removeMutation.isPending}
            onClick={handleRemove}
          >
            {removeMutation.isPending ? (
              <Loader2Icon data-icon="inline-start" className="animate-spin" />
            ) : null}
            Remove member
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
