"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { CircleAlertIcon, RefreshCwIcon, WalletIcon } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@gorro/ui/components/ui/popover"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import { WITHDRAWAL_REQUEST_CURRENCY } from "@/features/withdrawal-requests/constants"
import { useGetUserMainWallet } from "@/features/withdrawal-requests/usecases"
import { emptyAsNa, formatCurrencyAmount } from "@gorro/ui/utils"

type UserWalletBalancePopoverProps = {
  userId: string
}

function WalletDetailRow({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right font-medium">{value}</span>
    </div>
  )
}

export function UserWalletBalancePopover({ userId }: UserWalletBalancePopoverProps) {
  const [open, setOpen] = useState(false)
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetUserMainWallet(userId, open)

  const loading = isLoading || (isFetching && !data)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline">
          <WalletIcon data-icon="inline-start" />
          Check balance
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="end">
        <PopoverHeader className="mb-2">
          <PopoverTitle>Wallet balance</PopoverTitle>
          <PopoverDescription className="font-mono text-xs break-all">
            {userId}
          </PopoverDescription>
        </PopoverHeader>

        {isError ? (
          <div role="alert" className="space-y-3">
            <div className="flex gap-2">
              <CircleAlertIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  Couldn&apos;t load balance
                </p>
                <p className="text-xs text-muted-foreground">
                  {error instanceof Error ? error.message : "Unknown error"}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={() => refetch()}
            >
              <RefreshCwIcon />
              Try again
            </Button>
          </div>
        ) : loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : data ? (
          <div className="divide-y divide-border/60">
            <WalletDetailRow
              label="Balance"
              value={formatCurrencyAmount(
                data.balanceMajorUnits,
                WITHDRAWAL_REQUEST_CURRENCY
              )}
            />
            <WalletDetailRow
              label="Internal account"
              value={
                <span className="font-mono text-xs">
                  {data.internalAccountNumber}
                </span>
              }
            />
            {data.nubans.length > 0 ? (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  NUBAN accounts
                </p>
                {data.nubans.map((nuban) => (
                  <div
                    key={`${nuban.accountNumber}-${nuban.bankCode}`}
                    className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-2 text-xs"
                  >
                    <p className="font-mono font-medium">
                      {nuban.accountNumber}
                    </p>
                    <p className="truncate text-muted-foreground">
                      {emptyAsNa(nuban.accountName)}
                    </p>
                    <p className="text-muted-foreground">
                      {nuban.bankName} ({nuban.bankCode})
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
