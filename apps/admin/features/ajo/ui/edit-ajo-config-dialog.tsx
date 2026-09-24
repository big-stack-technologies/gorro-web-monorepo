"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gorro/ui/components/ui/select"
import {
  AJO_PENALTY_SCOPE_OPTIONS,
  bpsToPercent,
  nairaToMinorUnits,
  percentToBps,
} from "@/features/ajo/constants"
import {
  updateAjoConfigFormSchema,
  type UpdateAjoConfigFormValues,
} from "@/features/ajo/schema"
import type { AjoConfig } from "@/features/ajo/types"
import { useUpdateAjoConfig } from "@/features/ajo/usecases"

function defaultValuesFromConfig(
  config: AjoConfig
): UpdateAjoConfigFormValues {
  return {
    minContributionNaira: config.minContributionNaira,
    maxSlotsPerGroup: config.maxSlotsPerGroup,
    maxSlotsPerMember: config.maxSlotsPerMember,
    penaltyPercent: bpsToPercent(config.penaltyPercentBps),
    penaltyMinNaira: config.penaltyMinNaira,
    penaltyMaxNaira: config.penaltyMaxNaira,
    graceWindowHours: config.graceWindowHours,
    penaltyScope: config.penaltyScope,
  }
}

type EditAjoConfigDialogProps = {
  config: AjoConfig
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAjoConfigDialog({
  config,
  open,
  onOpenChange,
}: EditAjoConfigDialogProps) {
  const mutation = useUpdateAjoConfig()

  const form = useForm<UpdateAjoConfigFormValues>({
    resolver: standardSchemaResolver(updateAjoConfigFormSchema),
    defaultValues: defaultValuesFromConfig(config),
  })

  const {
    control,
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

  const onSubmit = (values: UpdateAjoConfigFormValues) => {
    mutation.mutate(
      {
        minContributionMinor: nairaToMinorUnits(values.minContributionNaira),
        maxSlotsPerGroup: values.maxSlotsPerGroup,
        maxSlotsPerMember: values.maxSlotsPerMember,
        penaltyPercentBps: percentToBps(values.penaltyPercent),
        penaltyMinMinor: nairaToMinorUnits(values.penaltyMinNaira),
        penaltyMaxMinor: nairaToMinorUnits(values.penaltyMaxNaira),
        graceWindowHours: values.graceWindowHours,
        penaltyScope: values.penaltyScope,
      },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  const pending = mutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Edit Ajo platform settings</DialogTitle>
          <DialogDescription>
            Changes apply immediately without a deploy.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[min(70vh,520px)] flex-col"
        >
          <div className="overflow-y-auto px-4 py-4">
            <FieldGroup>
              <Field
                data-invalid={errors.minContributionNaira ? true : undefined}
              >
                <FieldLabel htmlFor="ajo-min-contribution">
                  Minimum contribution (₦)
                </FieldLabel>
                <Input
                  id="ajo-min-contribution"
                  type="number"
                  step="1"
                  min="1"
                  aria-invalid={!!errors.minContributionNaira}
                  {...register("minContributionNaira", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.minContributionNaira]} />
              </Field>
              <Field data-invalid={errors.maxSlotsPerGroup ? true : undefined}>
                <FieldLabel htmlFor="ajo-max-slots-group">
                  Max slots per group
                </FieldLabel>
                <Input
                  id="ajo-max-slots-group"
                  type="number"
                  step="1"
                  min="2"
                  aria-invalid={!!errors.maxSlotsPerGroup}
                  {...register("maxSlotsPerGroup", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.maxSlotsPerGroup]} />
              </Field>
              <Field
                data-invalid={errors.maxSlotsPerMember ? true : undefined}
              >
                <FieldLabel htmlFor="ajo-max-slots-member">
                  Max slots per member (Private)
                </FieldLabel>
                <Input
                  id="ajo-max-slots-member"
                  type="number"
                  step="1"
                  min="1"
                  aria-invalid={!!errors.maxSlotsPerMember}
                  {...register("maxSlotsPerMember", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.maxSlotsPerMember]} />
              </Field>
              <Field data-invalid={errors.penaltyPercent ? true : undefined}>
                <FieldLabel htmlFor="ajo-penalty-percent">
                  Penalty rate (%)
                </FieldLabel>
                <Input
                  id="ajo-penalty-percent"
                  type="number"
                  step="0.01"
                  min="0"
                  aria-invalid={!!errors.penaltyPercent}
                  {...register("penaltyPercent", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.penaltyPercent]} />
              </Field>
              <Field data-invalid={errors.penaltyMinNaira ? true : undefined}>
                <FieldLabel htmlFor="ajo-penalty-min">
                  Penalty minimum (₦)
                </FieldLabel>
                <Input
                  id="ajo-penalty-min"
                  type="number"
                  step="1"
                  min="0"
                  aria-invalid={!!errors.penaltyMinNaira}
                  {...register("penaltyMinNaira", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.penaltyMinNaira]} />
              </Field>
              <Field data-invalid={errors.penaltyMaxNaira ? true : undefined}>
                <FieldLabel htmlFor="ajo-penalty-max">
                  Penalty maximum (₦)
                </FieldLabel>
                <Input
                  id="ajo-penalty-max"
                  type="number"
                  step="1"
                  min="0"
                  aria-invalid={!!errors.penaltyMaxNaira}
                  {...register("penaltyMaxNaira", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.penaltyMaxNaira]} />
              </Field>
              <Field data-invalid={errors.graceWindowHours ? true : undefined}>
                <FieldLabel htmlFor="ajo-grace-hours">
                  Grace window (hours)
                </FieldLabel>
                <Input
                  id="ajo-grace-hours"
                  type="number"
                  step="1"
                  min="1"
                  aria-invalid={!!errors.graceWindowHours}
                  {...register("graceWindowHours", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.graceWindowHours]} />
              </Field>
              <Field data-invalid={errors.penaltyScope ? true : undefined}>
                <FieldLabel htmlFor="ajo-penalty-scope">
                  Penalty scope
                </FieldLabel>
                <Controller
                  name="penaltyScope"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="ajo-penalty-scope"
                        className="w-full min-w-0"
                        aria-invalid={!!errors.penaltyScope}
                      >
                        <SelectValue placeholder="Penalty scope" />
                      </SelectTrigger>
                      <SelectContent>
                        {AJO_PENALTY_SCOPE_OPTIONS.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.penaltyScope]} />
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
              Save settings
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
