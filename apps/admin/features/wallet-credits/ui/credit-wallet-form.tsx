"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loader2Icon } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@gorro/ui/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@gorro/ui/components/ui/field"
import { Input } from "@gorro/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gorro/ui/components/ui/select"
import { Textarea } from "@gorro/ui/components/ui/textarea"
import { cn, formatNgn } from "@gorro/ui/utils"
import {
  NARRATION_MAX_LENGTH,
  REASON_MAX_LENGTH,
  WALLET_CREDIT_CATEGORIES,
  WALLET_CREDIT_CATEGORY_CONFIRM_LABELS,
  WALLET_CREDIT_CATEGORY_FUNDING,
  WALLET_CREDIT_CATEGORY_HINTS,
  WALLET_CREDIT_CATEGORY_LABELS,
  WALLET_CREDIT_DEFAULT_NARRATION,
  WALLET_CREDIT_PROVIDERS,
  WALLET_CREDIT_PROVIDER_LABELS,
} from "@/features/wallet-credits/constants"
import { creditFormToPayload } from "@/features/wallet-credits/lib/form-payload"
import {
  creditWalletFormSchema,
  type CreditWalletFormValues,
} from "@/features/wallet-credits/schema"
import type {
  CreditableWallet,
  CreditWalletResult,
  WalletCreditCategory,
} from "@/features/wallet-credits/types"
import { useCreditWallet } from "@/features/wallet-credits/usecases"

const defaultValues: CreditWalletFormValues = {
  amount: "",
  category: "REFUND_COMPENSATION",
  reason: "",
  narration: "",
  provider: undefined,
  providerReference: "",
  senderName: "",
  senderAccountNumber: "",
  senderBankName: "",
}

type CreditWalletFormProps = {
  wallet: CreditableWallet
  onCredited: (result: CreditWalletResult) => void
}

function parsedAmount(value: string) {
  const amount = Number(value)
  return Number.isFinite(amount) && amount >= 0.01 ? amount : null
}

export function CreditWalletForm({ wallet, onCredited }: CreditWalletFormProps) {
  const panelRef = React.useRef<HTMLDivElement>(null)
  const [reference, setReference] = React.useState(() => crypto.randomUUID())
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [pendingValues, setPendingValues] =
    React.useState<CreditWalletFormValues | null>(null)

  const mutation = useCreditWallet()

  const form = useForm<CreditWalletFormValues>({
    resolver: standardSchemaResolver(creditWalletFormSchema),
    defaultValues,
  })

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = form

  const category = watch("category")
  const amountValue = watch("amount")
  const reasonValue = watch("reason") ?? ""
  const narrationValue = watch("narration") ?? ""
  const amount = parsedAmount(amountValue)

  React.useEffect(() => {
    setReference(crypto.randomUUID())
    reset(defaultValues)
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [wallet.targetType, wallet.targetId, reset])

  function openConfirm(values: CreditWalletFormValues) {
    setPendingValues(values)
    setConfirmOpen(true)
  }

  function submitCredit() {
    if (!pendingValues) return
    const payload = creditFormToPayload(wallet, reference, pendingValues)
    mutation.mutate(payload, {
      onSuccess: (result) => {
        setConfirmOpen(false)
        setPendingValues(null)
        onCredited(result)
        reset(defaultValues)
        setReference(crypto.randomUUID())
      },
    })
  }

  const pendingAmount =
    pendingValues != null ? parsedAmount(pendingValues.amount) : null
  const pendingNarration = pendingValues?.narration?.trim()

  return (
    <div ref={panelRef}>
      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader>
          <CardTitle className="font-heading text-base">3. Credit details</CardTitle>
          <CardDescription>
            {wallet.owner.name} · {wallet.label}
          </CardDescription>
          <p className="font-mono text-xs text-muted-foreground">
            {wallet.accountNumber} · {formatNgn(wallet.balance)} now
          </p>
        </CardHeader>
        <CardContent>
          <form
            id="credit-wallet-form"
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(openConfirm)}
          >
            <FieldGroup>
              <Field data-invalid={errors.amount ? true : undefined}>
                <FieldLabel htmlFor="wc-amount">Amount</FieldLabel>
                <Input
                  id="wc-amount"
                  inputMode="decimal"
                  placeholder="5000"
                  autoComplete="off"
                  aria-invalid={!!errors.amount}
                  {...register("amount")}
                />
                <FieldDescription>
                  {amount != null
                    ? `Will credit ${formatNgn(amount)}.`
                    : "Naira, at least ₦0.01, up to 2 decimal places."}
                </FieldDescription>
                <FieldError errors={[errors.amount]} />
              </Field>

              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Field data-invalid={errors.category ? true : undefined}>
                    <FieldLabel>Category</FieldLabel>
                    <div className="flex flex-col gap-2" role="radiogroup" aria-label="Category">
                      {WALLET_CREDIT_CATEGORIES.map((value) => {
                        const selected = field.value === value
                        return (
                          <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            className={cn(
                              "rounded-lg border px-3 py-2 text-left",
                              selected
                                ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                                : "border-border hover:bg-muted/40"
                            )}
                            onClick={() =>
                              field.onChange(value as WalletCreditCategory)
                            }
                          >
                            <span className="block text-sm font-medium">
                              {WALLET_CREDIT_CATEGORY_LABELS[value]}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {WALLET_CREDIT_CATEGORY_HINTS[value]}
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                              Funded from {WALLET_CREDIT_CATEGORY_FUNDING[value]}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    <FieldError errors={[errors.category]} />
                  </Field>
                )}
              />

              <Field data-invalid={errors.reason ? true : undefined}>
                <FieldLabel htmlFor="wc-reason">Internal reason</FieldLabel>
                <Textarea
                  id="wc-reason"
                  rows={3}
                  maxLength={REASON_MAX_LENGTH}
                  placeholder="Ticket #4821 — why this credit is being applied"
                  aria-invalid={!!errors.reason}
                  {...register("reason")}
                />
                <FieldDescription>
                  Never shown to the customer. {reasonValue.length}/
                  {REASON_MAX_LENGTH}
                </FieldDescription>
                <FieldError errors={[errors.reason]} />
              </Field>

              <Field data-invalid={errors.narration ? true : undefined}>
                <FieldLabel htmlFor="wc-narration">
                  What the customer sees
                </FieldLabel>
                <Textarea
                  id="wc-narration"
                  rows={2}
                  maxLength={NARRATION_MAX_LENGTH}
                  placeholder={WALLET_CREDIT_DEFAULT_NARRATION[category]}
                  aria-invalid={!!errors.narration}
                  {...register("narration")}
                />
                <FieldDescription>
                  Optional. Blank uses “{WALLET_CREDIT_DEFAULT_NARRATION[category]}
                  ”. {narrationValue.length}/{NARRATION_MAX_LENGTH}
                </FieldDescription>
                <FieldError errors={[errors.narration]} />
              </Field>
            </FieldGroup>

            {category === "MISSED_DEPOSIT" ? (
              <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Payment that was missed</p>
                  <p className="text-xs text-muted-foreground">
                    The provider reference must match the payment exactly. If
                    it is already on the ledger, the credit is refused.
                  </p>
                </div>
                <FieldGroup>
                  <Field data-invalid={errors.provider ? true : undefined}>
                    <FieldLabel htmlFor="wc-provider">Provider</FieldLabel>
                    <Controller
                      control={control}
                      name="provider"
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="wc-provider" aria-invalid={!!errors.provider}>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {WALLET_CREDIT_PROVIDERS.map((value) => (
                              <SelectItem key={value} value={value}>
                                {WALLET_CREDIT_PROVIDER_LABELS[value]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={[errors.provider]} />
                  </Field>

                  <Field data-invalid={errors.providerReference ? true : undefined}>
                    <FieldLabel htmlFor="wc-provider-ref">
                      Provider reference
                    </FieldLabel>
                    <Input
                      id="wc-provider-ref"
                      placeholder="Fincra session ID or Flutterwave flw_ref"
                      aria-invalid={!!errors.providerReference}
                      {...register("providerReference")}
                    />
                    <FieldError errors={[errors.providerReference]} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="wc-sender-name">
                      Payer name (optional)
                    </FieldLabel>
                    <Input
                      id="wc-sender-name"
                      placeholder="From the customer's receipt"
                      {...register("senderName")}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="wc-sender-acct">
                      Payer account (optional)
                    </FieldLabel>
                    <Input
                      id="wc-sender-acct"
                      {...register("senderAccountNumber")}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="wc-sender-bank">
                      Payer bank (optional)
                    </FieldLabel>
                    <Input id="wc-sender-bank" {...register("senderBankName")} />
                  </Field>
                </FieldGroup>
              </div>
            ) : null}
          </form>
        </CardContent>
        <CardFooter className="justify-end border-t">
          <Button type="submit" form="credit-wallet-form" disabled={mutation.isPending}>
            {amount != null ? `Review ${formatNgn(amount)}` : "Review credit"}
          </Button>
        </CardFooter>
      </Card>

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!mutation.isPending) setConfirmOpen(open)
        }}
      >
        <DialogContent className="gap-0 p-0 sm:max-w-md">
          <DialogHeader className="border-b px-4 py-4">
            <DialogTitle>Confirm credit</DialogTitle>
            <DialogDescription>
              Money moves the moment this succeeds. Undo it later from History.
            </DialogDescription>
          </DialogHeader>
          {pendingValues && pendingAmount != null ? (
            <div className="flex flex-col gap-4 px-4 py-4">
              <p className="font-heading text-2xl">{formatNgn(pendingAmount)}</p>
              <dl className="flex flex-col gap-2 text-sm">
                <SummaryRow label="To" value={wallet.owner.name} />
                <SummaryRow
                  label="Wallet"
                  value={`${wallet.label} · ${wallet.accountNumber}`}
                />
                <SummaryRow
                  label="Balance after"
                  value={formatNgn(wallet.balance + pendingAmount)}
                />
                <SummaryRow
                  label="Category"
                  value={
                    WALLET_CREDIT_CATEGORY_CONFIRM_LABELS[pendingValues.category]
                  }
                />
                <SummaryRow
                  label="Funded from"
                  value={WALLET_CREDIT_CATEGORY_FUNDING[pendingValues.category]}
                />
                <SummaryRow
                  label="Customer sees"
                  value={
                    pendingNarration ||
                    WALLET_CREDIT_DEFAULT_NARRATION[pendingValues.category]
                  }
                />
              </dl>
            </div>
          ) : null}
          <div className="flex justify-end gap-2 border-t px-4 py-4">
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => setConfirmOpen(false)}
            >
              Back
            </Button>
            <Button type="button" disabled={mutation.isPending} onClick={submitCredit}>
              {mutation.isPending ? (
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
              ) : null}
              Credit wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}
