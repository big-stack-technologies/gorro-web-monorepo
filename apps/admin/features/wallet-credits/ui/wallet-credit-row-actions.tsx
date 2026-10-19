"use client"

import * as React from "react"
import { Undo2Icon } from "lucide-react"

import {
  DataTableRowActions,
  type DataTableRowActionGroup,
} from "@gorro/ui/components/data-table"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import type { TransactionReasonFormValues } from "@/features/transactions/schema"
import { WalletCreditReverseDialog } from "@/features/wallet-credits/ui/wallet-credit-reverse-dialog"
import { USER_ROLE } from "@/features/users/constants"
import type { WalletCreditListItem } from "@/features/wallet-credits/types"
import { useCreditableWallets, useReverseWalletCredit } from "@/features/wallet-credits/usecases"
import { formatNgn } from "@gorro/ui/utils"

type WalletCreditRowActionsProps = {
  credit: WalletCreditListItem
}

export function WalletCreditRowActions({ credit }: WalletCreditRowActionsProps) {
  const { data: profile } = useGetProfile()
  const isSuperAdmin =
    profile?.roles?.includes(USER_ROLE.super_admin) === true

  const [reverseOpen, setReverseOpen] = React.useState(false)
  const reverseMutation = useReverseWalletCredit(credit.transactionId)

  const walletsQuery = useCreditableWallets(
    reverseOpen && credit.accountNumber
      ? { accountNumber: credit.accountNumber }
      : null
  )

  const currentBalance = React.useMemo(() => {
    if (!walletsQuery.data) return null
    const match = walletsQuery.data.find(
      (wallet) => wallet.accountNumber === credit.accountNumber
    )
    return match?.balance ?? null
  }, [credit.accountNumber, walletsQuery.data])

  const groups = React.useMemo((): DataTableRowActionGroup[] => {
    return [
      {
        id: "reverse",
        items: [
          {
            id: "reverse",
            label: "Reverse credit",
            icon: Undo2Icon,
            variant: "destructive",
            onSelect: () => setReverseOpen(true),
          },
        ],
      },
    ]
  }, [])

  if (!isSuperAdmin || credit.status !== "POSTED") {
    return null
  }

  return (
    <>
      <DataTableRowActions
        subjectLabel={credit.owner.name}
        menuTitle={credit.owner.name}
        groups={groups}
      />
      <WalletCreditReverseDialog
        open={reverseOpen}
        onOpenChange={setReverseOpen}
        isPending={reverseMutation.isPending}
        creditLabel={`${credit.transactionId} · ${formatNgn(credit.amount)} to ${credit.owner.name}`}
        amount={credit.amount}
        currentBalance={currentBalance}
        balanceLoading={walletsQuery.isLoading}
        onSubmit={(values: TransactionReasonFormValues) => {
          reverseMutation.mutate(values, {
            onSuccess: () => setReverseOpen(false),
          })
        }}
      />
    </>
  )
}
