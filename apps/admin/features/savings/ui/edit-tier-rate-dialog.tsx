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
import {
  getSavingsProductTypeLabel,
  nairaToMinorUnits,
  percentToBps,
} from "@/features/savings/constants"
import {
  updateTierRateFormSchema,
  type UpdateTierRateFormValues,
} from "@/features/savings/schema"
import type { SavingsProductType, SavingsRateConfig } from "@/features/savings/types"
import { useUpdateSavingsRate } from "@/features/savings/usecases"

function defaultValuesFromConfig(
  config: SavingsRateConfig
): UpdateTierRateFormValues {
  return {
    tier1RatePercent: config.tier1RatePercent,
    tier2RatePercent: config.tier2RatePercent,
    tierThresholdNaira: config.tierThresholdNaira,
  }
}

type EditTierRateDialogProps = {
  config: SavingsRateConfig
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTierRateDialog({
  config,
  open,
  onOpenChange,
}: EditTierRateDialogProps) {
  const productType = config.productType as SavingsProductType
  const mutation = useUpdateSavingsRate(productType)

  const form = useForm<UpdateTierRateFormValues>({
    resolver: standardSchemaResolver(updateTierRateFormSchema),
    defaultValues: defaultValuesFromConfig(config),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  useEffect(() => {
    if (open) {
      reset(defaultValuesFromConfig(config))
    }
  }, [open, config, reset])

  const onSubmit = (values: UpdateTierRateFormValues) => {
    mutation.mutate(
      {
        tier1RateBps: percentToBps(values.tier1RatePercent),
        tier2RateBps: percentToBps(values.tier2RatePercent),
        tierThresholdMinorUnits: nairaToMinorUnits(values.tierThresholdNaira),
      },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  const pending = mutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>
            Edit {getSavingsProductTypeLabel(productType)} rates
          </DialogTitle>
          <DialogDescription>
            Rate changes apply to new accruals only — not retroactive.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[min(70vh,520px)] flex-col"
        >
          <div className="overflow-y-auto px-4 py-4">
            <FieldGroup>
              <Field data-invalid={errors.tier1RatePercent ? true : undefined}>
                <FieldLabel htmlFor="tier1-rate">Tier 1 rate (%)</FieldLabel>
                <Input
                  id="tier1-rate"
                  type="number"
                  step="0.01"
                  min="0"
                  aria-invalid={!!errors.tier1RatePercent}
                  {...register("tier1RatePercent", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.tier1RatePercent]} />
              </Field>
              <Field data-invalid={errors.tier2RatePercent ? true : undefined}>
                <FieldLabel htmlFor="tier2-rate">Tier 2 rate (%)</FieldLabel>
                <Input
                  id="tier2-rate"
                  type="number"
                  step="0.01"
                  min="0"
                  aria-invalid={!!errors.tier2RatePercent}
                  {...register("tier2RatePercent", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.tier2RatePercent]} />
              </Field>
              <Field
                data-invalid={errors.tierThresholdNaira ? true : undefined}
              >
                <FieldLabel htmlFor="tier-threshold">
                  Tier threshold (₦)
                </FieldLabel>
                <Input
                  id="tier-threshold"
                  type="number"
                  step="1"
                  min="0"
                  aria-invalid={!!errors.tierThresholdNaira}
                  {...register("tierThresholdNaira", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.tierThresholdNaira]} />
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
              Save rates
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
