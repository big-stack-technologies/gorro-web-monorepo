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
import {
  transactionReasonFormSchema,
  type TransactionReasonFormValues,
} from "@/features/transactions/schema"

const COPY: Record<
  "reverse" | "approve" | "reject",
  { title: string; description: string; confirm: string; destructive?: boolean }
> = {
  reverse: {
    title: "Reverse transaction",
    description: "Provide a reason for reversing this transaction.",
    confirm: "Reverse",
    destructive: true,
  },
  approve: {
    title: "Approve (AML)",
    description: "Approve this transaction for AML review.",
    confirm: "Approve",
  },
  reject: {
    title: "Reject transaction",
    description: "Reject this transaction with a reason.",
    confirm: "Reject",
    destructive: true,
  },
}

type TransactionReasonDialogProps = {
  kind: "reverse" | "approve" | "reject"
  transactionLabel: string
  open: boolean
  onOpenChange: (open: boolean) => void
  isPending: boolean
  onSubmit: (values: TransactionReasonFormValues) => void
}

export function TransactionReasonDialog({
  kind,
  transactionLabel,
  open,
  onOpenChange,
  isPending,
  onSubmit,
}: TransactionReasonDialogProps) {
  const copy = COPY[kind]

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
    if (open) {
      reset({ reason: "" })
    }
  }, [open, reset, kind])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription className="truncate font-mono text-xs">
            {transactionLabel}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[min(70vh,520px)] flex-col"
        >
          <div className="overflow-y-auto px-4 py-4">
            <p className="mb-3 text-sm text-muted-foreground">{copy.description}</p>
            <FieldGroup>
              <Field data-invalid={errors.reason ? true : undefined}>
                <FieldLabel htmlFor={`tx-reason-${kind}`}>Reason</FieldLabel>
                <Textarea
                  id={`tx-reason-${kind}`}
                  placeholder="Enter a reason"
                  rows={4}
                  aria-invalid={!!errors.reason}
                  {...register("reason")}
                />
                <FieldError errors={[errors.reason]} />
              </Field>
            </FieldGroup>
          </div>

          <div className="flex justify-end gap-2 border-t bg-muted/50 p-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={copy.destructive ? "destructive" : "default"}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
              ) : null}
              {copy.confirm}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
