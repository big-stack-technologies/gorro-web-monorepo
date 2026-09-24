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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@gorro/ui/components/ui/field"
import { Input } from "@gorro/ui/components/ui/input"
import { Switch } from "@gorro/ui/components/ui/switch"
import {
  updateReengagementConfigFormSchema,
  type UpdateReengagementConfigFormValues,
} from "@/features/reengagement/schema"
import type { ReengagementConfig } from "@/features/reengagement/types"
import { useUpdateReengagementConfig } from "@/features/reengagement/usecases"

function defaultValuesFromConfig(
  config: ReengagementConfig
): UpdateReengagementConfigFormValues {
  return {
    masterEnabled: config.masterEnabled,
    kycReminderEnabled: config.kycReminderEnabled,
    firstSaveReminderEnabled: config.firstSaveReminderEnabled,
    referEarnReminderEnabled: config.referEarnReminderEnabled,
    pushEnabled: config.pushEnabled,
    emailEnabled: config.emailEnabled,
    sendHour: config.sendHour,
  }
}

type EditReengagementConfigDialogProps = {
  config: ReengagementConfig
  open: boolean
  onOpenChange: (open: boolean) => void
}

function SwitchField({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  invalid,
}: {
  id: string
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  invalid?: boolean
}) {
  return (
    <Field
      orientation="horizontal"
      className="items-start justify-between rounded-lg border bg-muted/20 px-3 py-3"
      data-invalid={invalid ? true : undefined}
    >
      <div className="space-y-1 pr-4">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {description ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
      </div>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        aria-invalid={invalid}
        onCheckedChange={onCheckedChange}
      />
    </Field>
  )
}

export function EditReengagementConfigDialog({
  config,
  open,
  onOpenChange,
}: EditReengagementConfigDialogProps) {
  const mutation = useUpdateReengagementConfig()

  const form = useForm<UpdateReengagementConfigFormValues>({
    resolver: standardSchemaResolver(updateReengagementConfigFormSchema),
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

  const onSubmit = (values: UpdateReengagementConfigFormValues) => {
    mutation.mutate(
      {
        masterEnabled: values.masterEnabled,
        kycReminderEnabled: values.kycReminderEnabled,
        firstSaveReminderEnabled: values.firstSaveReminderEnabled,
        referEarnReminderEnabled: values.referEarnReminderEnabled,
        pushEnabled: values.pushEnabled,
        emailEnabled: values.emailEnabled,
        sendHour: values.sendHour,
      },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  const pending = mutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Edit re-engagement settings</DialogTitle>
          <DialogDescription>
            Campaign toggles, channels, and daily send hour (Africa/Lagos).
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[min(70vh,560px)] flex-col"
        >
          <div className="overflow-y-auto px-4 py-4">
            <FieldGroup className="gap-3">
              <Controller
                name="masterEnabled"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    id="reengagement-master-enabled"
                    label="Master enabled"
                    description="Stops all campaigns when off."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    invalid={!!errors.masterEnabled}
                  />
                )}
              />
              <Controller
                name="kycReminderEnabled"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    id="reengagement-kyc-enabled"
                    label="Complete KYC campaign"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    invalid={!!errors.kycReminderEnabled}
                  />
                )}
              />
              <Controller
                name="firstSaveReminderEnabled"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    id="reengagement-save-enabled"
                    label="Start saving campaign"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    invalid={!!errors.firstSaveReminderEnabled}
                  />
                )}
              />
              <Controller
                name="referEarnReminderEnabled"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    id="reengagement-refer-enabled"
                    label="Refer & earn campaign"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    invalid={!!errors.referEarnReminderEnabled}
                  />
                )}
              />
              <Controller
                name="pushEnabled"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    id="reengagement-push-enabled"
                    label="Push channel"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    invalid={!!errors.pushEnabled}
                  />
                )}
              />
              <Controller
                name="emailEnabled"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    id="reengagement-email-enabled"
                    label="Email channel"
                    description="Reserved — marketing opt-out required before enabling."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled
                    invalid={!!errors.emailEnabled}
                  />
                )}
              />
              <Field data-invalid={errors.sendHour ? true : undefined}>
                <FieldLabel htmlFor="reengagement-send-hour">
                  Send hour (WAT)
                </FieldLabel>
                <Input
                  id="reengagement-send-hour"
                  type="number"
                  min={0}
                  max={23}
                  step={1}
                  aria-invalid={!!errors.sendHour}
                  {...register("sendHour", { valueAsNumber: true })}
                />
                <FieldError errors={[errors.sendHour]} />
              </Field>
            </FieldGroup>
          </div>

          <div className="flex justify-end gap-2 border-t px-4 py-4">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
              ) : null}
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
