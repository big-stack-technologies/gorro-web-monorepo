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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@gorro/ui/components/ui/field"
import { Textarea } from "@gorro/ui/components/ui/textarea"
import {
  ADDRESS_REVIEW_CANNED_REASONS,
  ADDRESS_REVIEW_REASON_MAX_LENGTH,
} from "@/features/kyc-reviews/constants"
import {
  rejectAddressReviewFormSchema,
  type RejectAddressReviewFormValues,
} from "@/features/kyc-reviews/schema"
import { useRejectAddressReview } from "@/features/kyc-reviews/usecases"

type AddressReviewRejectDialogProps = {
  reviewId: string
  customerName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddressReviewRejectDialog({
  reviewId,
  customerName,
  open,
  onOpenChange,
}: AddressReviewRejectDialogProps) {
  const form = useForm<RejectAddressReviewFormValues>({
    resolver: standardSchemaResolver(rejectAddressReviewFormSchema),
    defaultValues: { reason: "" },
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form

  // eslint-disable-next-line react-hooks/incompatible-library
  const reason = watch("reason")

  useEffect(() => {
    if (open) {
      reset({ reason: "" })
    }
  }, [open, reset])

  const mutation = useRejectAddressReview(reviewId)

  const onSubmit = (values: RejectAddressReviewFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => onOpenChange(false),
    })
  }

  const pending = mutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Reject address review</DialogTitle>
          <DialogDescription>
            {customerName} will see this reason and can resubmit.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[min(70vh,640px)] flex-col"
        >
          <div className="overflow-y-auto px-4 py-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Suggested reasons</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {ADDRESS_REVIEW_CANNED_REASONS.map((option) => (
                    <Button
                      key={option.label}
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={pending}
                      onClick={() =>
                        setValue("reason", option.reason, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                <FieldDescription>
                  These fill the reason. Edit the text so the customer knows
                  what to fix.
                </FieldDescription>
              </Field>

              <Field data-invalid={errors.reason ? true : undefined}>
                <FieldLabel htmlFor="address-review-reject-reason">
                  Reason
                </FieldLabel>
                <Textarea
                  id="address-review-reject-reason"
                  placeholder="Explain what is wrong with the bill. The customer sees this text verbatim."
                  rows={5}
                  maxLength={ADDRESS_REVIEW_REASON_MAX_LENGTH}
                  aria-invalid={!!errors.reason}
                  {...register("reason")}
                />
                <div className="flex items-start justify-between gap-3">
                  <FieldError errors={[errors.reason]} />
                  <p className="ml-auto text-xs text-muted-foreground tabular-nums">
                    {reason.trim().length}/{ADDRESS_REVIEW_REASON_MAX_LENGTH}
                  </p>
                </div>
              </Field>
            </FieldGroup>
          </div>

          <div className="flex justify-end gap-2 border-t px-4 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending ? (
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
              ) : null}
              Reject review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
