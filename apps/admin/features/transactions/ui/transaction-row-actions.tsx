"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BanIcon,
  CheckCircleIcon,
  EyeIcon,
  RotateCcwIcon,
} from "lucide-react"

import {
  DataTableRowActions,
  type DataTableRowActionGroup,
} from "@gorro/ui/components/data-table"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { USER_ROLE } from "@/features/users/constants"
import type { Transaction } from "@/features/transactions/types"
import { routes } from "@/lib/routes"
import {
  useApproveTransaction,
  useRejectTransaction,
  useReverseTransaction,
} from "@/features/transactions/usecases"

import { TransactionReasonDialog } from "./transaction-reason-dialog"

type TransactionRowActionsProps = {
  transaction: Transaction
}

export function TransactionRowActions({ transaction }: TransactionRowActionsProps) {
  const router = useRouter()
  const { data: profile } = useGetProfile()
  const isSuperAdmin =
    profile?.roles?.includes(USER_ROLE.super_admin) === true
  const [reasonKind, setReasonKind] = useState<
    "reverse" | "approve" | "reject" | null
  >(null)

  const reverseMutation = useReverseTransaction(transaction.id)
  const approveMutation = useApproveTransaction(transaction.id)
  const rejectMutation = useRejectTransaction(transaction.id)

  const amlPending = transaction.status === "PENDING_REVIEW"
  const canReverse =
    isSuperAdmin && transaction.status !== "REVERSED"

  const reasonPending =
    reasonKind === "reverse"
      ? reverseMutation.isPending
      : reasonKind === "approve"
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
            router.push(routes.protected.transactions.detail(transaction.id)),
        },
      ],
    }

    const actions: DataTableRowActionGroup = {
      id: "actions",
      items: [
        ...(canReverse
          ? [
            {
              id: "reverse",
              label: "Reverse",
              icon: RotateCcwIcon,
              variant: "destructive" as const,
              onSelect: () => setReasonKind("reverse"),
            },
          ]
          : []),
        {
          id: "approve",
          label: "Approve (AML)",
          icon: CheckCircleIcon,
          disabled: !amlPending,
          onSelect: () => setReasonKind("approve"),
        },
        {
          id: "reject",
          label: "Reject",
          icon: BanIcon,
          variant: "destructive" as const,
          disabled: !amlPending,
          onSelect: () => setReasonKind("reject"),
        },
      ],
    }

    return [viewGroup, actions]
  }, [amlPending, canReverse, router, transaction.id])

  const handleReasonSubmit = (values: { reason: string }) => {
    const onSuccess = () => setReasonKind(null)
    if (reasonKind === "reverse") {
      reverseMutation.mutate(values, { onSuccess })
    } else if (reasonKind === "approve") {
      approveMutation.mutate(values, { onSuccess })
    } else if (reasonKind === "reject") {
      rejectMutation.mutate(values, { onSuccess })
    }
  }

  return (
    <>
      <DataTableRowActions
        subjectLabel={transaction.id}
        menuTitle={transaction.id}
        groups={groups}
      />
      {reasonKind != null ? (
        <TransactionReasonDialog
          kind={reasonKind}
          transactionLabel={transaction.id}
          open
          onOpenChange={(open) => {
            if (!open) setReasonKind(null)
          }}
          isPending={reasonPending}
          onSubmit={handleReasonSubmit}
        />
      ) : null}
    </>
  )
}
