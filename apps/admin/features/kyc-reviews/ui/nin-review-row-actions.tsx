"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BanIcon,
  CheckCircleIcon,
  EyeIcon,
} from "lucide-react"

import {
  DataTableRowActions,
  type DataTableRowActionGroup,
} from "@gorro/ui/components/data-table"
import { canDecideNinReview } from "@/features/auth/access"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import type { NinReview } from "@/features/kyc-reviews/types"
import { NinReviewApproveDialog } from "@/features/kyc-reviews/ui/nin-review-approve-dialog"
import { NinReviewRejectDialog } from "@/features/kyc-reviews/ui/nin-review-reject-dialog"
import { routes } from "@/lib/routes"

type NinReviewRowActionsProps = {
  review: NinReview
}

export function NinReviewRowActions({ review }: NinReviewRowActionsProps) {
  const router = useRouter()
  const { data: profile } = useGetProfile()
  const canDecide = canDecideNinReview(profile?.roles)
  const isPending = review.reviewedAt == null

  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)

  const groups = useMemo((): DataTableRowActionGroup[] => {
    const viewGroup: DataTableRowActionGroup = {
      id: "view",
      items: [
        {
          id: "view-details",
          label: "View details",
          icon: EyeIcon,
          onSelect: () =>
            router.push(routes.protected.kycNinReviews.detail(review.id)),
        },
      ],
    }

    if (!canDecide || !isPending) {
      return [viewGroup]
    }

    const actions: DataTableRowActionGroup = {
      id: "actions",
      items: [
        {
          id: "approve",
          label: "Approve",
          icon: CheckCircleIcon,
          onSelect: () => setConfirmApproveOpen(true),
        },
        {
          id: "reject",
          label: "Reject",
          icon: BanIcon,
          variant: "destructive",
          onSelect: () => setRejectOpen(true),
        },
      ],
    }

    return [viewGroup, actions]
  }, [canDecide, isPending, review.id, router])

  return (
    <>
      <DataTableRowActions
        subjectLabel={review.nin}
        menuTitle={review.user?.name ?? review.nin}
        groups={groups}
      />

      <NinReviewApproveDialog
        reviewId={review.id}
        nin={review.nin}
        open={confirmApproveOpen}
        onOpenChange={setConfirmApproveOpen}
      />

      <NinReviewRejectDialog
        reviewId={review.id}
        nin={review.nin}
        open={rejectOpen}
        onOpenChange={setRejectOpen}
      />
    </>
  )
}
