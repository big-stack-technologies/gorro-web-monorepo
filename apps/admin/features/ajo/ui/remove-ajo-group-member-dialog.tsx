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
import { getAjoMemberRemovalWarnings } from "@/features/ajo/member-removal"
import type { AjoGroupMember } from "@/features/ajo/types"
import { useRemoveAjoGroupMember } from "@/features/ajo/usecases"

type RemoveAjoGroupMemberDialogProps = {
  groupId: string
  member: AjoGroupMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RemoveAjoGroupMemberDialog({
  groupId,
  member,
  open,
  onOpenChange,
}: RemoveAjoGroupMemberDialogProps) {
  const removeMutation = useRemoveAjoGroupMember(groupId)
  const warnings = member ? getAjoMemberRemovalWarnings(member) : []

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && !removeMutation.isPending) onOpenChange(false)
  }

  function handleRemove(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (!member) return

    removeMutation.mutate(member.memberId, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove member from Ajo group?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">
                  {member?.name ?? "This member"}
                </span>{" "}
                will be removed from the group. This affects rotation order and
                contribution tracking and cannot be undone from here.
              </p>
              {warnings.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-amber-700 dark:text-amber-400">
                  {warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              ) : null}
            </div>
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
