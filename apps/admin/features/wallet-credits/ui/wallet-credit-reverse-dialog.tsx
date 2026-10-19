"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loader2Icon } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@gorro/ui/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@gorro/ui/components/ui/field"
import { Textarea } from "@gorro/ui/components/ui/textarea"
import { formatNgn } from "@gorro/ui/utils"
import {
  transactionReasonFormSchema,
  type TransactionReasonFormValues,
} from "@/features/transactions/schema"

type WalletCreditReverseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isPending: boolean
  creditLabel: string
  amount: number
  currentBalance: number | null
  balanceLoading: boolean
  onSubmit: (values: TransactionReasonFormValues) => void
}

export function WalletCreditReverseDialog({
  open,
  onOpenChange,
  isPending,
  creditLabel,
  amount,
  currentBalance,
  balanceLoading,
  onSubmit,
}: WalletCreditReverseDialogProps) {
  const form = useForm<TransactionReasonFormValues>({
    resolver: standardSchemaResolver(transactionReasonFormSchema),
    defaultValues: { reason: "" },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  useEffect(() => {
    if (open) reset({ reason: "" })
  }, [open, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Reverse credit</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {creditLabel}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[min(70vh,520px)] flex-col"
        >
          <div className="space-y-3 overflow-y-auto px-4 py-4">
            <p className="text-sm text-muted-foreground">
              This posts the opposite ledger entries. The customer&apos;s balance
              is not checked first — if they already spent the credit, the wallet
              can go negative and recover from the next deposit.
            </p>
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
              <p>
                Credit amount:{" "}
                <span className="font-medium">{formatNgn(amount)}</span>
              </p>
              <p className="text-muted-foreground">
                Current wallet balance:{" "}
                {balanceLoading
                  ? "Loading…"
                  : currentBalance != null
                    ? formatNgn(currentBalance)
                    : "Unavailable"}
              </p>
            </div>
            <FieldGroup>
              <Field data-invalid={errors.reason ? true : undefined}>
                <FieldLabel htmlFor="wallet-credit-reverse-reason">
                  Reason
                </FieldLabel>
                <Textarea
                  id="wallet-credit-reverse-reason"
                  placeholder="Why is this credit being reversed?"
                  rows={4}
                  aria-invalid={!!errors.reason}
                  {...register("reason")}
                />
                <FieldError errors={[errors.reason]} />
              </Field>
            </FieldGroup>
          </div>

          <div className="flex justify-end gap-2 border-t px-4 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? (
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
              ) : null}
              Reverse
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
