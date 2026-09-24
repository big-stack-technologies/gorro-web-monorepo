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
  rejectNinReviewFormSchema,
  type RejectNinReviewFormValues,
} from "@/features/kyc-reviews/schema"
import { useRejectNinReview } from "@/features/kyc-reviews/usecases"

type NinReviewRejectDialogProps = {
  reviewId: string
  nin: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NinReviewRejectDialog({
  reviewId,
  nin,
  open,
  onOpenChange,
}: NinReviewRejectDialogProps) {
  const form = useForm<RejectNinReviewFormValues>({
    resolver: standardSchemaResolver(rejectNinReviewFormSchema),
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

  const mutation = useRejectNinReview(reviewId)

  const onSubmit = (values: RejectNinReviewFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => onOpenChange(false),
    })
  }

  const pending = mutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Reject NIN review</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            NIN {nin}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[min(70vh,520px)] flex-col"
        >
          <div className="overflow-y-auto px-4 py-4">
            <FieldGroup>
              <Field data-invalid={errors.reason ? true : undefined}>
                <FieldLabel htmlFor="nin-review-reject-reason">
                  Reason
                </FieldLabel>
                <Textarea
                  id="nin-review-reject-reason"
                  placeholder="Explain why this NIN review is being rejected. This reason is sent to the user."
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
