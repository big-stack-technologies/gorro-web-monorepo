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
import { useRunReengagementCampaigns } from "@/features/reengagement/usecases"

type RunReengagementDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RunReengagementDialog({
  open,
  onOpenChange,
}: RunReengagementDialogProps) {
  const mutation = useRunReengagementCampaigns()

  const handleConfirm = () => {
    mutation.mutate(undefined, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Run re-engagement campaigns now?</AlertDialogTitle>
          <AlertDialogDescription>
            This triggers the same logic as the daily worker. Users already
            nudged today are skipped, and campaign toggles and caps still apply.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={mutation.isPending}
            onClick={(event) => {
              event.preventDefault()
              handleConfirm()
            }}
          >
            {mutation.isPending ? (
              <Loader2Icon className="animate-spin" data-icon="inline-start" />
            ) : null}
            Run campaigns
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
