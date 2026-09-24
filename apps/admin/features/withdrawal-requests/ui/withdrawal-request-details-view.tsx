"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import {
  CircleAlertIcon,
  Loader2Icon,
  RefreshCwIcon,
  WalletIcon,
} from "lucide-react"

import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import { Separator } from "@gorro/ui/components/ui/separator"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
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
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { isModeratorOrAbove } from "@/features/users/constants"
import {
  WITHDRAWAL_REQUEST_CURRENCY,
  WITHDRAWAL_REQUEST_PENDING_STATUS,
} from "@/features/withdrawal-requests/constants"
import type { WithdrawalRequest } from "@/features/withdrawal-requests/types"
import {
  useApproveWithdrawalRequest,
  useGetWithdrawalRequest,
  useRejectWithdrawalRequest,
} from "@/features/withdrawal-requests/usecases"
import { UserWalletBalanceDialog } from "@/features/withdrawal-requests/ui/user-wallet-balance-dialog"
import { emptyAsNa, formatCurrencyAmount, formatDateTime } from "@gorro/ui/utils"

function formatWithdrawalUserName(fullName: string) {
  const trimmed = fullName.trim()
  if (!trimmed || /\bundefined\b/.test(trimmed)) return "—"
  return trimmed
}

function DetailField({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="grid grid-cols-[minmax(0,10rem)_1fr] gap-x-3 gap-y-1 text-sm sm:grid-cols-[12rem_1fr]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 font-medium wrap-break-word">{value}</dd>
    </div>
  )
}

export type WithdrawalRequestDetailsViewProps = {
  withdrawalRequestId: string
  fallbackRow?: WithdrawalRequest
}

export function WithdrawalRequestDetailsView({
  withdrawalRequestId,
  fallbackRow,
}: WithdrawalRequestDetailsViewProps) {
  const { data: profile } = useGetProfile()
  const canModerate = isModeratorOrAbove(profile?.roles)

  const {
    data: detail,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetWithdrawalRequest(withdrawalRequestId)

  const merged = detail ?? fallbackRow ?? null
  const isPending = merged?.status === WITHDRAWAL_REQUEST_PENDING_STATUS
  const showModerationActions = canModerate && isPending

  const [confirmKind, setConfirmKind] = useState<"approve" | "reject" | null>(
    null
  )
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false)

  const approveMutation = useApproveWithdrawalRequest(withdrawalRequestId)
  const rejectMutation = useRejectWithdrawalRequest(withdrawalRequestId)

  const actionPending =
    confirmKind === "approve"
      ? approveMutation.isPending
      : rejectMutation.isPending

  const showFieldSkeleton = !merged && !isError
  const loadingExtras = (isLoading || isFetching) && !detail

  const handleConfirm = () => {
    const onSuccess = () => setConfirmKind(null)
    if (confirmKind === "approve") {
      approveMutation.mutate(undefined, { onSuccess })
    } else if (confirmKind === "reject") {
      rejectMutation.mutate(undefined, { onSuccess })
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
      {isError ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/25 bg-destructive/[0.07] p-4 shadow-sm ring-1 ring-inset ring-destructive/10"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex gap-3">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive"
                aria-hidden
              >
                <CircleAlertIcon className="size-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Couldn&apos;t load withdrawal request
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {error instanceof Error
                    ? error.message
                    : "Something went wrong. Try again."}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5 sm:min-w-22"
              onClick={() => refetch()}
            >
              <RefreshCwIcon />
              Retry
            </Button>
          </div>
        </div>
      ) : null}

      {showModerationActions ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => setConfirmKind("approve")}
            disabled={actionPending}
          >
            Approve
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={() => setConfirmKind("reject")}
            disabled={actionPending}
          >
            Reject
          </Button>
        </div>
      ) : null}

      {merged?.userInfo?.id ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium">Requesting user</p>
            <p className="truncate text-sm text-muted-foreground">
              {formatWithdrawalUserName(merged.userInfo.fullName)}
            </p>
            <p className="font-mono text-xs text-muted-foreground break-all">
              {merged.userInfo.id}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setBalanceDialogOpen(true)}
          >
            <WalletIcon data-icon="inline-start" />
            Check user balance
          </Button>
        </div>
      ) : null}

      <dl className="grid gap-4 rounded-xl border bg-card p-4 shadow-sm sm:p-6">
        <DetailField
          label="Status"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-28" />
            ) : merged?.status ? (
              <Badge variant="outline">{merged.status}</Badge>
            ) : (
              "—"
            )
          }
        />
        <DetailField
          label="Provider"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              (merged?.provider ?? "—")
            )
          }
        />
        <DetailField
          label="Amount"
          value={
            showFieldSkeleton || merged?.amount == null ? (
              <Skeleton className="h-4 w-28" />
            ) : (
              formatCurrencyAmount(merged.amount, WITHDRAWAL_REQUEST_CURRENCY)
            )
          }
        />
        <DetailField
          label="Fee"
          value={
            showFieldSkeleton || merged?.fee == null ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              formatCurrencyAmount(merged.fee, WITHDRAWAL_REQUEST_CURRENCY)
            )
          }
        />
        <DetailField
          label="Total debit"
          value={
            showFieldSkeleton || merged?.totalDebit == null ? (
              <Skeleton className="h-4 w-28" />
            ) : (
              formatCurrencyAmount(
                merged.totalDebit,
                WITHDRAWAL_REQUEST_CURRENCY
              )
            )
          }
        />
        <DetailField
          label="Recipient"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              merged?.recipientName ?? "—"
            )
          }
        />
        <DetailField
          label="Recipient account"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              merged?.recipientAccount ?? "—"
            )
          }
        />
        <DetailField
          label="Bank"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-32" />
            ) : merged?.bankName ? (
              `${merged.bankName} (${merged.bankCode})`
            ) : (
              "—"
            )
          }
        />
        <DetailField
          label="Reference"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-full max-w-md" />
            ) : (
              <span className="font-mono text-xs break-all">
                {merged?.reference ?? "—"}
              </span>
            )
          }
        />
        <DetailField
          label="Client reference"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-full max-w-md" />
            ) : (
              <span className="font-mono text-xs break-all">
                {merged?.clientReference ?? "—"}
              </span>
            )
          }
        />
        <DetailField
          label="Narration"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-full max-w-md" />
            ) : (
              (merged?.narration ?? "—")
            )
          }
        />
        <Separator />
        <DetailField
          label="Created"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-40" />
            ) : merged?.createdAt == null ||
              emptyAsNa(merged.createdAt) === "N/A" ? (
              "N/A"
            ) : (
              formatDateTime(merged.createdAt)
            )
          }
        />
        <DetailField
          label="Updated"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-40" />
            ) : merged?.updatedAt == null ||
              emptyAsNa(merged.updatedAt) === "N/A" ? (
              "N/A"
            ) : (
              formatDateTime(merged.updatedAt)
            )
          }
        />
        <DetailField
          label="Approved at"
          value={
            loadingExtras ? (
              <Skeleton className="h-4 w-40" />
            ) : merged?.approvedAt == null ||
              emptyAsNa(merged.approvedAt) === "N/A" ? (
              "N/A"
            ) : (
              formatDateTime(merged.approvedAt)
            )
          }
        />
        <DetailField
          label="Rejected at"
          value={
            loadingExtras ? (
              <Skeleton className="h-4 w-40" />
            ) : merged?.rejectedAt == null ||
              emptyAsNa(merged.rejectedAt) === "N/A" ? (
              "N/A"
            ) : (
              formatDateTime(merged.rejectedAt)
            )
          }
        />
        <DetailField
          label="Rejection reason"
          value={
            loadingExtras ? (
              <Skeleton className="h-4 w-full max-w-md" />
            ) : (
              (merged?.rejectionReason ?? "—")
            )
          }
        />
        <DetailField
          label="Failure reason"
          value={
            loadingExtras ? (
              <Skeleton className="h-4 w-full max-w-md" />
            ) : (
              (merged?.failureReason ?? "—")
            )
          }
        />
      </dl>

      {confirmKind != null ? (
        <AlertDialog
          open
          onOpenChange={(open) => {
            if (!open) setConfirmKind(null)
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmKind === "approve"
                  ? "Approve withdrawal request?"
                  : "Reject withdrawal request?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmKind === "approve"
                  ? "This will approve the pending withdrawal and proceed with processing."
                  : "This will reject the pending withdrawal request."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={actionPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={actionPending}
                className={
                  confirmKind === "reject"
                    ? "bg-destructive text-white hover:bg-destructive/90"
                    : undefined
                }
                onClick={(e) => {
                  e.preventDefault()
                  handleConfirm()
                }}
              >
                {actionPending ? (
                  <Loader2Icon
                    className="animate-spin"
                    data-icon="inline-start"
                  />
                ) : null}
                {confirmKind === "approve" ? "Approve" : "Reject"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}

      {merged?.userInfo?.id ? (
        <UserWalletBalanceDialog
          userId={merged.userInfo.id}
          userName={formatWithdrawalUserName(merged.userInfo.fullName)}
          open={balanceDialogOpen}
          onOpenChange={setBalanceDialogOpen}
        />
      ) : null}
    </div>
  )
}
