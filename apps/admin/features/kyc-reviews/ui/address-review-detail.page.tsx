"use client"

import { useRef } from "react"
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
import { formatAddressReviewStatus } from "@/features/kyc-reviews/constants"
import type {
  AddressReviewAddress,
  AddressReviewProfile,
} from "@/features/kyc-reviews/types"
import { AddressReviewDecisionActions } from "@/features/kyc-reviews/ui/address-review-decision-actions"
import { AddressReviewDocument } from "@/features/kyc-reviews/ui/address-review-document"
import { NinReviewPhoto } from "@/features/kyc-reviews/ui/nin-review-photo"
import {
  computeWaitingHours,
  NinReviewSlaBadge,
} from "@/features/kyc-reviews/ui/nin-review-sla-badge"
import { useGetAddressReview } from "@/features/kyc-reviews/usecases"
import { routes } from "@/lib/routes"
import { emptyAsNa, formatDateTime } from "@gorro/ui/utils"

type AddressReviewDetailPageProps = {
  reviewId: string
}

function profileName(profile: AddressReviewProfile) {
  const name = [profile.firstName, profile.middleName, profile.lastName]
    .filter((part) => part && part.trim().length > 0)
    .join(" ")
  return name || "This customer"
}

function AddressLines({ address }: { address: AddressReviewAddress | null }) {
  if (!address) {
    return <p className="text-sm text-muted-foreground">No address entered.</p>
  }

  const locality = [address.city, address.state].filter(Boolean).join(", ")

  return (
    <div className="space-y-1 text-sm">
      <p className="font-medium">{address.addressLine || "—"}</p>
      {locality ? <p>{locality}</p> : null}
      {address.lga ? <p className="text-muted-foreground">{address.lga}</p> : null}
    </div>
  )
}

export function AddressReviewDetailPage({
  reviewId,
}: AddressReviewDetailPageProps) {
  const {
    data: review,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAddressReview(reviewId)

  const waitingHours = review ? computeWaitingHours(review.submittedAt) : 0
  const customerName = review ? profileName(review.profile) : "This customer"
  const reloadedPassport = useRef(false)

  return (
    <div className="flex flex-col gap-6 px-4 pb-8 lg:px-6">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit gap-1.5 px-0" asChild>
          <Link href={routes.protected.kycAddressReviews.base}>
            <ArrowLeftIcon />
            Back to address reviews
          </Link>
        </Button>
        <AdminPageHeader
          title="Address review"
          description="Check that the name on the bill matches the account and the address matches what was entered."
        />
      </div>

      {isLoading && !review ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-[70vh] w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      ) : null}

      {isError ? (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center gap-2 text-sm text-destructive">
            <CircleAlertIcon className="size-4" />
            {error instanceof Error
              ? error.message
              : "Could not load address review details."}
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
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {formatAddressReviewStatus(review.status)}
            </Badge>
            <NinReviewSlaBadge waitingHours={waitingHours} />
            <Badge variant={review.attemptNumber > 1 ? "destructive" : "secondary"}>
              {review.attemptNumber > 1
                ? `Resubmission · attempt ${review.attemptNumber}`
                : "Attempt 1"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Submitted {formatDateTime(review.submittedAt)}
            </span>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-border p-4">
              <h2 className="mb-3 text-sm font-semibold">Bill</h2>
              <AddressReviewDocument
                url={review.documentUrl}
                onReload={() => {
                  void refetch()
                }}
                isReloading={isFetching}
              />
            </section>

            <div className="space-y-4">
              <section className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-2">
                    <h2 className="text-sm font-semibold">Account</h2>
                    <p className="text-base font-medium">{customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {emptyAsNa(review.profile.email)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {emptyAsNa(review.profile.phone)}
                    </p>
                    <Badge variant="outline">
                      Tier {review.profile.kycTier}
                    </Badge>
                  </div>
                  <div className="shrink-0">
                    <NinReviewPhoto
                      src={review.profile.passportPhotoUrl}
                      alt={`${customerName} passport photo`}
                      onError={() => {
                        if (reloadedPassport.current) return
                        reloadedPassport.current = true
                        void refetch()
                      }}
                    />
                    <p className="mt-1 max-w-40 text-center text-[11px] text-muted-foreground">
                      For the name, not face matching.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-border p-4">
                <h2 className="mb-2 text-sm font-semibold">Claimed address</h2>
                <AddressLines address={review.claimedAddress} />
              </section>

              {review.attemptNumber > 1 ? (
                <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
                  This is attempt {review.attemptNumber}. A previous submission
                  was rejected.
                </p>
              ) : null}
            </div>
          </div>

          <AddressReviewDecisionActions
            review={review}
            customerName={customerName}
          />
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
