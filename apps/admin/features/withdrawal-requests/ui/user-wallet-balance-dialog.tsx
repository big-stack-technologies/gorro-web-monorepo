"use client"

import type { ReactNode } from "react"
import { CircleAlertIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@gorro/ui/components/ui/dialog"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gorro/ui/components/ui/table"
import { WITHDRAWAL_REQUEST_CURRENCY } from "@/features/withdrawal-requests/constants"
import { useGetUserMainWallet } from "@/features/withdrawal-requests/usecases"
import { emptyAsNa, formatCurrencyAmount } from "@gorro/ui/utils"

function DetailRow({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-x-4 gap-y-1 border-b border-border/60 py-2.5 last:border-b-0 sm:grid-cols-[140px_1fr]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 wrap-break-word font-medium">{value}</dd>
    </div>
  )
}

type UserWalletBalanceDialogProps = {
  userId: string
  userName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserWalletBalanceDialog({
  userId,
  userName,
  open,
  onOpenChange,
}: UserWalletBalanceDialogProps) {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetUserMainWallet(userId, open)

  const loading = isLoading || (isFetching && !data)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>User wallet balance</DialogTitle>
          <DialogDescription className="truncate">
            {userName ? `${userName} · ` : null}
            <span className="font-mono text-xs">{userId}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[min(70vh,520px)] overflow-y-auto px-4">
          {isError ? (
            <div
              role="alert"
              className="flex flex-col gap-3 py-4"
            >
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                  <CircleAlertIcon className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">
                    Couldn&apos;t load wallet balance
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {error instanceof Error ? error.message : "Unknown error"}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit gap-1.5"
                onClick={() => refetch()}
              >
                <RefreshCwIcon />
                Try again
              </Button>
            </div>
          ) : loading ? (
            <dl className="py-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[140px_1fr] gap-x-4 border-b border-border/60 py-2.5 last:border-b-0"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </dl>
          ) : data ? (
            <>
              <dl className="py-2">
                <DetailRow
                  label="Balance"
                  value={formatCurrencyAmount(
                    data.balanceMajorUnits,
                    WITHDRAWAL_REQUEST_CURRENCY
                  )}
                />
                <DetailRow
                  label="Internal account"
                  value={
                    <span className="font-mono text-sm">
                      {data.internalAccountNumber}
                    </span>
                  }
                />
                <DetailRow label="Owner ID" value={data.ownerId} />
              </dl>
              {data.nubans.length > 0 ? (
                <div className="border-t border-border/60 py-4">
                  <p className="mb-3 text-sm font-medium">NUBAN accounts</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account</TableHead>
                        <TableHead>Bank</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.nubans.map((nuban) => (
                        <TableRow
                          key={`${nuban.accountNumber}-${nuban.bankCode}`}
                        >
                          <TableCell>
                            <div className="min-w-0 space-y-0.5">
                              <p className="font-mono text-xs">
                                {nuban.accountNumber}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {emptyAsNa(nuban.accountName)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {nuban.bankName} ({nuban.bankCode})
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
