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
import { useRetriggerReferralBonuses } from "@/features/referrals/usecases"

type RetriggerReferralBonusesDialogProps = {
  userId: string
  userName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RetriggerReferralBonusesDialog({
  userId,
  userName,
  open,
  onOpenChange,
}: RetriggerReferralBonusesDialogProps) {
  const retriggerMutation = useRetriggerReferralBonuses(userId)

  const handleConfirm = () => {
    retriggerMutation.mutate(undefined, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Retrigger unpaid bonuses?</AlertDialogTitle>
          <AlertDialogDescription>
            This will retrigger unpaid referral bonuses for{" "}
            <span className="font-medium text-foreground">{userName}</span>.
            Only unpaid bonuses will be processed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={retriggerMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={retriggerMutation.isPending}
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
          >
            {retriggerMutation.isPending ? (
              <Loader2Icon className="animate-spin" data-icon="inline-start" />
            ) : null}
            Retrigger
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
