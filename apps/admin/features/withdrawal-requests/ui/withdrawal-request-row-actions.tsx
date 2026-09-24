"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BanIcon,
  CheckCircleIcon,
  EyeIcon,
  Loader2Icon,
} from "lucide-react"

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
import {
  DataTableRowActions,
  type DataTableRowActionGroup,
} from "@gorro/ui/components/data-table"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { isModeratorOrAbove } from "@/features/users/constants"
import {
  WITHDRAWAL_REQUEST_PENDING_STATUS,
} from "@/features/withdrawal-requests/constants"
import type { WithdrawalRequest } from "@/features/withdrawal-requests/types"
import {
  useApproveWithdrawalRequest,
  useRejectWithdrawalRequest,
} from "@/features/withdrawal-requests/usecases"
import { routes } from "@/lib/routes"

type WithdrawalRequestRowActionsProps = {
  withdrawalRequest: WithdrawalRequest
}

export function WithdrawalRequestRowActions({
  withdrawalRequest,
}: WithdrawalRequestRowActionsProps) {
  const router = useRouter()
  const { data: profile } = useGetProfile()
  const canModerate = isModeratorOrAbove(profile?.roles)
  const isPending =
    withdrawalRequest.status === WITHDRAWAL_REQUEST_PENDING_STATUS

  const [confirmKind, setConfirmKind] = useState<"approve" | "reject" | null>(
    null
  )

  const approveMutation = useApproveWithdrawalRequest(withdrawalRequest.id)
  const rejectMutation = useRejectWithdrawalRequest(withdrawalRequest.id)

  const pending =
    confirmKind === "approve"
      ? approveMutation.isPending
      : rejectMutation.isPending

  const groups = useMemo((): DataTableRowActionGroup[] => {
    const viewGroup: DataTableRowActionGroup = {
      id: "view",
      items: [
        {
          id: "view-details",
          label: "View details",
          icon: EyeIcon,
          onSelect: () =>
            router.push(
              routes.protected.withdrawalRequests.detail(withdrawalRequest.id)
            ),
        },
      ],
    }

    if (!canModerate || !isPending) {
      return [viewGroup]
    }

    const actions: DataTableRowActionGroup = {
      id: "actions",
      items: [
        {
          id: "approve",
          label: "Approve",
          icon: CheckCircleIcon,
          onSelect: () => setConfirmKind("approve"),
        },
        {
          id: "reject",
          label: "Reject",
          icon: BanIcon,
          variant: "destructive",
          onSelect: () => setConfirmKind("reject"),
        },
      ],
    }

    return [viewGroup, actions]
  }, [canModerate, isPending, router, withdrawalRequest.id])

  const handleConfirm = () => {
    const onSuccess = () => setConfirmKind(null)
    if (confirmKind === "approve") {
      approveMutation.mutate(undefined, { onSuccess })
    } else if (confirmKind === "reject") {
      rejectMutation.mutate(undefined, { onSuccess })
    }
  }

  return (
    <>
      <DataTableRowActions
        subjectLabel={withdrawalRequest.reference}
        menuTitle={withdrawalRequest.reference}
        groups={groups}
      />
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
                  : "This will reject the pending withdrawal request. This action cannot be undone from here."}
                {" "}
                Reference:{" "}
                <span className="font-medium text-foreground">
                  {withdrawalRequest.reference}
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={pending}
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
                {pending ? (
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
    </>
  )
}
