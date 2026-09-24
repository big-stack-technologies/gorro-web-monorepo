"use client"

import { useState } from "react"
import { CheckCircleIcon, XCircleIcon } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"
import { canDecideAddressReview } from "@/features/auth/access"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { ADDRESS_REVIEW_PENDING_STATUS } from "@/features/kyc-reviews/constants"
import type { AddressReviewDetail } from "@/features/kyc-reviews/types"
import { AddressReviewApproveDialog } from "@/features/kyc-reviews/ui/address-review-approve-dialog"
import { AddressReviewRejectDialog } from "@/features/kyc-reviews/ui/address-review-reject-dialog"
import { formatDateTime } from "@gorro/ui/utils"

type AddressReviewDecisionActionsProps = {
  review: AddressReviewDetail
  customerName: string
}

export function AddressReviewDecisionActions({
  review,
  customerName,
}: AddressReviewDecisionActionsProps) {
  const { data: profile } = useGetProfile()
  const canDecide = canDecideAddressReview(profile?.roles)
  const isPending = review.status === ADDRESS_REVIEW_PENDING_STATUS

  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)

  const hasDecision =
    review.review.reviewedAt != null ||
    review.review.reviewedBy != null ||
    review.review.reviewNote != null

  if (!isPending) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <h3 className="text-sm font-semibold">Decision</h3>
        {hasDecision ? (
          <dl className="mt-3 space-y-2 text-sm">
            <div className="grid grid-cols-[minmax(0,8rem)_1fr] gap-x-3">
              <dt className="text-muted-foreground">Reviewed by</dt>
              <dd className="font-medium">
                {review.review.reviewedBy ?? "—"}
              </dd>
            </div>
            <div className="grid grid-cols-[minmax(0,8rem)_1fr] gap-x-3">
              <dt className="text-muted-foreground">Reviewed at</dt>
              <dd className="font-medium">
                {review.review.reviewedAt
                  ? formatDateTime(review.review.reviewedAt)
                  : "—"}
              </dd>
            </div>
            <div className="grid grid-cols-[minmax(0,8rem)_1fr] gap-x-3">
              <dt className="text-muted-foreground">Reason</dt>
              <dd className="min-w-0 font-medium wrap-break-word">
                {review.review.reviewNote ?? "—"}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            This review has already been decided.
          </p>
        )}
      </div>
    )
  }

  if (!canDecide) {
    return (
      <p className="rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        Only support agents and super admins can approve or reject address
        reviews. You can review the document in read-only mode.
      </p>
    )
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setApproveOpen(true)}>
          <CheckCircleIcon data-icon="inline-start" />
          Approve
        </Button>
        <Button variant="destructive" onClick={() => setRejectOpen(true)}>
          <XCircleIcon data-icon="inline-start" />
          Reject
        </Button>
      </div>

      <AddressReviewApproveDialog
        reviewId={review.id}
        customerName={customerName}
        open={approveOpen}
        onOpenChange={setApproveOpen}
      />

      <AddressReviewRejectDialog
        reviewId={review.id}
        customerName={customerName}
        open={rejectOpen}
        onOpenChange={setRejectOpen}
      />
    </>
  )
}
