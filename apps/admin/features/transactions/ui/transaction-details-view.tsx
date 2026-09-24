"use client"

import type { ReactNode } from "react"
import { CircleAlertIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"
import { Separator } from "@gorro/ui/components/ui/separator"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gorro/ui/components/ui/table"
import type { Transaction } from "@/features/transactions/types"
import { useGetTransaction } from "@/features/transactions/usecases"
import {
  emptyAsNa,
  formatCurrencyFromMinorUnits,
  formatDateTime,
} from "@gorro/ui/utils"

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

export type TransactionDetailsViewProps = {
  transactionId: string
  /** Optional list-row data for faster first paint when navigating from the table. */
  fallbackRow?: Transaction
}

export function TransactionDetailsView({
  transactionId,
  fallbackRow,
}: TransactionDetailsViewProps) {
  const {
    data: detail,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetTransaction(transactionId, true)

  const merged = detail ?? fallbackRow ?? null
  const type = merged?.type
  const status = merged?.status
  const direction = merged?.direction
  const amountMinorUnits = merged?.amountMinorUnits
  const currency = merged?.currency
  const initiatorId = merged?.initiatorId
  const referenceId = merged?.referenceId
  const idempotencyKey = merged?.idempotencyKey
  const postedAt = merged?.postedAt
  const createdAt = merged?.createdAt
  const updatedAt = merged?.updatedAt

  const ledgerEntries = detail?.ledgerEntries
  const initiatorName = detail?.initiatorName
  const recipientName = detail?.recipientName

  const loadingExtras = (isLoading || isFetching) && !detail
  const showFieldSkeleton = !merged && !isError

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
                  Couldn&apos;t load transaction details
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {error instanceof Error
                    ? error.message
                    : "Something went wrong. Check your connection and try again."}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="shrink-0 gap-1.5 sm:min-w-22"
              onClick={() => refetch()}
            >
              <RefreshCwIcon className="size-3.5" />
              Retry
            </Button>
          </div>
        </div>
      ) : null}

      <dl className="flex flex-col gap-3">
        <DetailField
          label="Type"
          value={
            showFieldSkeleton ? <Skeleton className="h-4 w-24" /> : (type ?? "—")
          }
        />
        <DetailField
          label="Status"
          value={
            showFieldSkeleton ? <Skeleton className="h-4 w-24" /> : (status ?? "—")
          }
        />
        <DetailField
          label="Direction"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              (direction ?? "—")
            )
          }
        />
        <DetailField
          label="Amount"
          value={
            showFieldSkeleton || amountMinorUnits == null || !currency ? (
              <Skeleton className="h-4 w-28" />
            ) : (
              formatCurrencyFromMinorUnits(amountMinorUnits, currency)
            )
          }
        />
        <DetailField
          label="Currency"
          value={
            showFieldSkeleton ? <Skeleton className="h-4 w-12" /> : (currency ?? "—")
          }
        />
        <DetailField
          label="Initiator"
          value={
            loadingExtras ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              initiatorName ?? "—"
            )
          }
        />
        <DetailField
          label="Initiator ID"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-full max-w-md" />
            ) : (
              <span className="font-mono text-xs break-all">
                {initiatorId ?? "—"}
              </span>
            )
          }
        />
        <DetailField
          label="Recipient"
          value={
            loadingExtras ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              recipientName ?? "—"
            )
          }
        />
        <DetailField
          label="Reference ID"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-full max-w-md" />
            ) : (
              <span className="font-mono text-xs break-all">
                {referenceId ?? "—"}
              </span>
            )
          }
        />
        <DetailField
          label="Idempotency key"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-full max-w-md" />
            ) : (
              <span className="font-mono text-xs break-all">
                {idempotencyKey ?? "—"}
              </span>
            )
          }
        />
        <DetailField
          label="Posted"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-40" />
            ) : postedAt == null || emptyAsNa(postedAt) === "N/A" ? (
              "N/A"
            ) : (
              formatDateTime(postedAt)
            )
          }
        />
        <DetailField
          label="Created"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-40" />
            ) : createdAt == null || emptyAsNa(createdAt) === "N/A" ? (
              "N/A"
            ) : (
              formatDateTime(createdAt)
            )
          }
        />
        <DetailField
          label="Updated"
          value={
            showFieldSkeleton ? (
              <Skeleton className="h-4 w-40" />
            ) : updatedAt == null || emptyAsNa(updatedAt) === "N/A" ? (
              "N/A"
            ) : (
              formatDateTime(updatedAt)
            )
          }
        />
      </dl>

      <Separator />

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">Ledger entries</h2>
        {loadingExtras ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : ledgerEntries && ledgerEntries.length > 0 && currency ? (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[28%]">Account</TableHead>
                  <TableHead>Debit</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead className="hidden md:table-cell">Balance after</TableHead>
                  <TableHead className="hidden lg:table-cell">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgerEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="max-w-48 align-top">
                      <span className="font-mono text-xs break-all">
                        {entry.accountId}
                      </span>
                    </TableCell>
                    <TableCell className="align-top whitespace-nowrap">
                      {entry.debitAmount != null
                        ? formatCurrencyFromMinorUnits(entry.debitAmount, currency)
                        : "—"}
                    </TableCell>
                    <TableCell className="align-top whitespace-nowrap">
                      {entry.creditAmount != null
                        ? formatCurrencyFromMinorUnits(
                            entry.creditAmount,
                            currency
                          )
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden align-top whitespace-nowrap md:table-cell">
                      {formatCurrencyFromMinorUnits(
                        entry.balanceAfter,
                        currency
                      )}
                    </TableCell>
                    <TableCell className="hidden max-w-xs align-top text-xs lg:table-cell">
                      {entry.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {detail ? "No ledger lines for this transaction." : null}
          </p>
        )}
      </div>
    </div>
  )
}
