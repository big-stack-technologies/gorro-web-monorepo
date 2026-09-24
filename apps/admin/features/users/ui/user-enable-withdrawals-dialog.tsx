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
  withdrawalsReasonFormSchema,
  type WithdrawalsReasonFormValues,
} from "@/features/users/schema"
import type { User } from "@/features/users/types"
import { useEnableUserWithdrawals } from "@/features/users/usecases"

type UserEnableWithdrawalsDialogProps = {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserEnableWithdrawalsDialog({
  user,
  open,
  onOpenChange,
}: UserEnableWithdrawalsDialogProps) {
  const form = useForm<WithdrawalsReasonFormValues>({
    resolver: standardSchemaResolver(withdrawalsReasonFormSchema),
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
  }, [open, reset])

  const mutation = useEnableUserWithdrawals(user.id)

  const onSubmit = (values: WithdrawalsReasonFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => onOpenChange(false),
    })
  }

  const pending = mutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Enable withdrawals</DialogTitle>
          <DialogDescription className="truncate">{user.email}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[min(70vh,520px)] flex-col"
        >
          <div className="overflow-y-auto px-4 py-4">
            <FieldGroup>
              <Field data-invalid={errors.reason ? true : undefined}>
                <FieldLabel htmlFor="enable-withdrawals-reason">Reason</FieldLabel>
                <Textarea
                  id="enable-withdrawals-reason"
                  placeholder="Why should withdrawals be re-enabled for this user?"
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
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
              ) : null}
              Enable withdrawals
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
