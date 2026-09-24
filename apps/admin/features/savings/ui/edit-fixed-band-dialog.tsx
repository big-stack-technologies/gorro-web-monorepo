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
import { Input } from "@gorro/ui/components/ui/input"
import { percentToBps } from "@/features/savings/constants"
import {
  updateFixedBandFormSchema,
  type UpdateFixedBandFormValues,
} from "@/features/savings/schema"
import type { SavingsFixedRateBand } from "@/features/savings/types"
import { useUpdateFixedRateBand } from "@/features/savings/usecases"

function defaultValuesFromBand(
  band: SavingsFixedRateBand
): UpdateFixedBandFormValues {
  return {
    ratePercent: band.ratePercent,
    minDays: band.minDays,
    maxDays: band.maxDays,
  }
}

type EditFixedBandDialogProps = {
  band: SavingsFixedRateBand
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditFixedBandDialog({
  band,
  open,
  onOpenChange,
}: EditFixedBandDialogProps) {
  const mutation = useUpdateFixedRateBand(band.id)

  const form = useForm<UpdateFixedBandFormValues>({
    resolver: standardSchemaResolver(updateFixedBandFormSchema),
    defaultValues: defaultValuesFromBand(band),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  useEffect(() => {
    if (open) {
      reset(defaultValuesFromBand(band))
    }
  }, [open, band, reset])

  const onSubmit = (values: UpdateFixedBandFormValues) => {
    mutation.mutate(
      {
        rateBps: percentToBps(values.ratePercent),
        minDays: values.minDays,
        maxDays: values.maxDays,
      },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  const pending = mutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Edit fixed rate band</DialogTitle>
          <DialogDescription>
            {band.minDays}–{band.maxDays} days · changes apply to new accruals
            only
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[min(70vh,520px)] flex-col"
        >
          <div className="overflow-y-auto px-4 py-4">
            <FieldGroup>
              <Field data-invalid={errors.ratePercent ? true : undefined}>
                <FieldLabel htmlFor="band-rate">Rate (%)</FieldLabel>
                <Input
                  id="band-rate"
                  type="number"
                  step="0.01"
                  min="0"
                  aria-invalid={!!errors.ratePercent}
                  {...register("ratePercent", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.ratePercent]} />
              </Field>
              <Field data-invalid={errors.minDays ? true : undefined}>
                <FieldLabel htmlFor="band-min-days">Min days</FieldLabel>
                <Input
                  id="band-min-days"
                  type="number"
                  step="1"
                  min="1"
                  aria-invalid={!!errors.minDays}
                  {...register("minDays", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.minDays]} />
              </Field>
              <Field data-invalid={errors.maxDays ? true : undefined}>
                <FieldLabel htmlFor="band-max-days">Max days</FieldLabel>
                <Input
                  id="band-max-days"
                  type="number"
                  step="1"
                  min="1"
                  aria-invalid={!!errors.maxDays}
                  {...register("maxDays", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.maxDays]} />
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
              Save band
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
