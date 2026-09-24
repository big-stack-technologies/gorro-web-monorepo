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
import { useApproveAddressReview } from "@/features/kyc-reviews/usecases"

type AddressReviewApproveDialogProps = {
  reviewId: string
  customerName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddressReviewApproveDialog({
  reviewId,
  customerName,
  open,
  onOpenChange,
}: AddressReviewApproveDialogProps) {
  const approveMutation = useApproveAddressReview(reviewId)

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve address review?</AlertDialogTitle>
          <AlertDialogDescription>
            This grants Tier 3 immediately and notifies{" "}
            <span className="font-medium text-foreground">{customerName}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={approveMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={approveMutation.isPending}
            onClick={(event) => {
              event.preventDefault()
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
