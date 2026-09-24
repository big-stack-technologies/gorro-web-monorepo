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
import { useApproveNinReview } from "@/features/kyc-reviews/usecases"

type NinReviewApproveDialogProps = {
  reviewId: string
  nin: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NinReviewApproveDialog({
  reviewId,
  nin,
  open,
  onOpenChange,
}: NinReviewApproveDialogProps) {
  const approveMutation = useApproveNinReview(reviewId)

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve NIN review?</AlertDialogTitle>
          <AlertDialogDescription>
            This will upgrade the user to Tier 2 and notify them. NIN{" "}
            <span className="font-medium text-foreground">{nin}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={approveMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={approveMutation.isPending}
            onClick={(e) => {
              e.preventDefault()
              approveMutation.mutate(undefined, {
                onSuccess: () => onOpenChange(false),
              })
            }}
          >
            {approveMutation.isPending ? (
              <Loader2Icon className="animate-spin" data-icon="inline-start" />
            ) : null}
            Approve
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
