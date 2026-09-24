"use client"

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
import { useCloseAjoGroup } from "@/features/ajo/usecases"

type CloseAjoGroupDialogProps = {
  groupId: string
  groupName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CloseAjoGroupDialog({
  groupId,
  groupName,
  open,
  onOpenChange,
}: CloseAjoGroupDialogProps) {
  const closeMutation = useCloseAjoGroup(groupId)

  const handleConfirm = () => {
    closeMutation.mutate(undefined, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close this Ajo group?</AlertDialogTitle>
          <AlertDialogDescription>
            This will close or cancel{" "}
            <span className="font-medium text-foreground">{groupName}</span> and
            hide it from users. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={closeMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={closeMutation.isPending}
            onClick={(event) => {
              event.preventDefault()
              handleConfirm()
            }}
          >
            {closeMutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
                Closing…
              </>
            ) : (
              "Close group"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
