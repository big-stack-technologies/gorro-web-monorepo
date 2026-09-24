"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { EyeIcon } from "lucide-react"

import {
  DataTableRowActions,
  type DataTableRowActionGroup,
} from "@gorro/ui/components/data-table"
import type { AddressReview } from "@/features/kyc-reviews/types"
import { routes } from "@/lib/routes"

type AddressReviewRowActionsProps = {
  review: AddressReview
}

export function AddressReviewRowActions({
  review,
}: AddressReviewRowActionsProps) {
  const router = useRouter()

  const groups = useMemo((): DataTableRowActionGroup[] => {
    return [
      {
        id: "view",
        items: [
          {
            id: "view-details",
            label: "Review",
            icon: EyeIcon,
            onSelect: () =>
              router.push(routes.protected.kycAddressReviews.detail(review.id)),
          },
        ],
      },
    ]
  }, [review.id, router])

  return (
    <DataTableRowActions
      subjectLabel={review.user?.name ?? review.id}
      menuTitle={review.user?.name ?? "Address review"}
      groups={groups}
    />
  )
}
