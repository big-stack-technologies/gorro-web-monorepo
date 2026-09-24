"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loader2Icon } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"
import { Checkbox } from "@gorro/ui/components/ui/checkbox"
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
  updateWhtFormSchema,
  type UpdateWhtFormValues,
} from "@/features/savings/schema"
import type { SavingsWhtConfig } from "@/features/savings/types"
import { useUpdateWhtConfig } from "@/features/savings/usecases"

function defaultValuesFromConfig(
  config: SavingsWhtConfig
): UpdateWhtFormValues {
  return {
    whtRatePercent: config.whtRatePercent,
    isEnabled: config.isEnabled,
  }
}

type EditWhtDialogProps = {
  config: SavingsWhtConfig
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditWhtDialog({
  config,
  open,
  onOpenChange,
}: EditWhtDialogProps) {
  const mutation = useUpdateWhtConfig()

  const form = useForm<UpdateWhtFormValues>({
    resolver: standardSchemaResolver(updateWhtFormSchema),
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

  const onSubmit = (values: UpdateWhtFormValues) => {
    mutation.mutate(
      {
        whtRateBps: percentToBps(values.whtRatePercent),
        isEnabled: values.isEnabled,
      },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  const pending = mutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Edit WHT configuration</DialogTitle>
          <DialogDescription>
            WHT changes take effect immediately on interest payouts.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[min(70vh,520px)] flex-col"
        >
          <div className="overflow-y-auto px-4 py-4">
            <FieldGroup>
              <Field data-invalid={errors.whtRatePercent ? true : undefined}>
                <FieldLabel htmlFor="wht-rate">WHT rate (%)</FieldLabel>
                <Input
                  id="wht-rate"
                  type="number"
                  step="0.01"
                  min="0"
                  aria-invalid={!!errors.whtRatePercent}
                  {...register("whtRatePercent", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.whtRatePercent]} />
              </Field>
              <Field data-invalid={errors.isEnabled ? true : undefined}>
                <div className="flex items-center gap-2">
                  <Controller
                    name="isEnabled"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="wht-enabled"
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    )}
                  />
                  <FieldLabel htmlFor="wht-enabled" className="font-normal">
                    WHT enabled
                  </FieldLabel>
                </div>
                <FieldError errors={[errors.isEnabled]} />
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
              Save WHT
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
