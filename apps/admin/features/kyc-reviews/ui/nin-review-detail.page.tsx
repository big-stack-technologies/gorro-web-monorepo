"use client"

import Link from "next/link"
import {
  ArrowLeftIcon,
  CircleAlertIcon,
  Loader2Icon,
  RefreshCwIcon,
} from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import { formatNinReviewStatus } from "@/features/kyc-reviews/constants"
import { NinReviewAutoMatchPanel } from "@/features/kyc-reviews/ui/nin-review-auto-match-panel"
import {
  NinReviewCompare,
  NinReviewSummaryStrip,
} from "@/features/kyc-reviews/ui/nin-review-compare"
import { NinReviewDecisionActions } from "@/features/kyc-reviews/ui/nin-review-decision-actions"
import {
  computeWaitingHours,
  NinReviewSlaBadge,
} from "@/features/kyc-reviews/ui/nin-review-sla-badge"
import { useGetNinReview } from "@/features/kyc-reviews/usecases"
import { routes } from "@/lib/routes"

type NinReviewDetailPageProps = {
  reviewId: string
}

export function NinReviewDetailPage({ reviewId }: NinReviewDetailPageProps) {
  const {
    data: review,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetNinReview(reviewId)

  const waitingHours = review
    ? computeWaitingHours(review.submittedAt)
    : 0

  return (
    <div className="flex flex-col gap-6 px-4 pb-8 lg:px-6">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit gap-1.5 px-0" asChild>
          <Link href={routes.protected.kycNinReviews.base}>
            <ArrowLeftIcon />
            Back to NIN reviews
          </Link>
        </Button>
        <AdminPageHeader
          title="NIN review details"
          description="Compare profile, BVN, and NIN registry data before approving or rejecting."
        />
        <p className="font-mono text-xs text-muted-foreground break-all">
          {reviewId}
        </p>
      </div>

      {isLoading && !review ? (
        <div className="space-y-4">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : null}

      {isError ? (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center gap-2 text-sm text-destructive">
            <CircleAlertIcon className="size-4" />
            {error instanceof Error
              ? error.message
              : "Could not load NIN review details."}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCwIcon data-icon="inline-start" />
            Retry
          </Button>
        </div>
      ) : null}

      {review ? (
        <div
          className={
            isFetching && !isLoading ? "space-y-6 opacity-80" : "space-y-6"
          }
        >
          <NinReviewSummaryStrip
            nin={review.nin}
            submittedAt={review.submittedAt}
            profile={review.profile}
            waitingHours={waitingHours}
            statusBadge={
              <Badge variant="outline">
                {formatNinReviewStatus(review.status)}
              </Badge>
            }
            slaBadge={<NinReviewSlaBadge waitingHours={waitingHours} />}
          />

          <NinReviewCompare
            profile={review.profile}
            bvnRecord={review.bvnRecord}
            ninRegistry={review.ninRegistry}
            vendorError={review.vendorError}
          />

          <NinReviewAutoMatchPanel
            autoMatch={review.autoMatch}
            vendorError={review.vendorError}
          />

          <NinReviewDecisionActions review={review} />
        </div>
      ) : null}

      {isFetching && review ? (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2Icon className="size-3.5 animate-spin" />
          Refreshing…
        </p>
      ) : null}
    </div>
  )
}
