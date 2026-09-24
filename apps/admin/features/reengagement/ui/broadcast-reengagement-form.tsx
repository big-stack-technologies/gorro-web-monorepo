"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loader2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@gorro/ui/components/ui/alert-dialog"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
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
import {
  broadcastReengagementFormSchema,
  type BroadcastReengagementFormValues,
} from "@/features/reengagement/schema"
import type { BroadcastReengagementPayload } from "@/features/reengagement/types"
import { ReengagementAudienceField } from "@/features/reengagement/ui/reengagement-audience-field"
import { findAudienceOption } from "@/features/reengagement/audience-utils"
import { useBroadcastReengagement, useReengagementAudiences } from "@/features/reengagement/usecases"

const defaultValues: BroadcastReengagementFormValues = {
  title: "",
  body: "",
  recipientMode: "preview",
  previewEmail: "",
  audience: "ALL",
  balanceBelow: undefined,
}

function toPayload(values: BroadcastReengagementFormValues): BroadcastReengagementPayload {
  if (values.recipientMode === "preview") {
    return {
      title: values.title.trim(),
      body: values.body.trim(),
      email: values.previewEmail?.trim(),
    }
  }

  return {
    title: values.title.trim(),
    body: values.body.trim(),
    audience: values.audience,
    ...(values.audience === "LOW_BALANCE" && values.balanceBelow != null
      ? { balanceBelow: values.balanceBelow }
      : {}),
  }
}

function getRecipientSummary(
  values: BroadcastReengagementFormValues,
  audienceLabel?: string
) {
  if (values.recipientMode === "preview") {
    return values.previewEmail?.trim() ?? "preview recipient"
  }

  return audienceLabel ?? values.audience ?? "selected audience"
}

export function BroadcastReengagementForm() {
  const mutation = useBroadcastReengagement()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingValues, setPendingValues] =
    useState<BroadcastReengagementFormValues | null>(null)

  const form = useForm<BroadcastReengagementFormValues>({
    resolver: standardSchemaResolver(broadcastReengagementFormSchema),
    defaultValues,
  })

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = form

  const recipientMode = watch("recipientMode")
  const audience = watch("audience")
  const balanceBelow = watch("balanceBelow")
  const pending = mutation.isPending

  const audiencesQuery = useReengagementAudiences(
    audience === "LOW_BALANCE" && balanceBelow != null ? { balanceBelow } : {},
    recipientMode === "audience"
  )

  const onSubmit = (values: BroadcastReengagementFormValues) => {
    setPendingValues(values)
    setConfirmOpen(true)
  }

  const handleConfirm = () => {
    if (!pendingValues) return

    mutation.mutate(toPayload(pendingValues), {
      onSuccess: () => {
        setConfirmOpen(false)
        setPendingValues(null)
        reset(defaultValues)
      },
    })
  }

  return (
    <>
      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader>
          <CardTitle className="font-heading text-base">Push broadcast</CardTitle>
          <CardDescription>
            Send an immediate push notification (in-app inbox + FCM). Preview to
            one email before sending to a full audience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Field data-invalid={errors.title ? true : undefined}>
                <FieldLabel htmlFor="broadcast-title">Title</FieldLabel>
                <Input
                  id="broadcast-title"
                  placeholder="Scheduled maintenance tonight"
                  aria-invalid={!!errors.title}
                  disabled={pending}
                  {...register("title")}
                />
                <FieldError errors={[errors.title]} />
              </Field>

              <Field data-invalid={errors.body ? true : undefined}>
                <FieldLabel htmlFor="broadcast-body">Body</FieldLabel>
                <Textarea
                  id="broadcast-body"
                  placeholder="Gorro will be briefly unavailable between 1:00–2:00 AM for an upgrade."
                  rows={4}
                  aria-invalid={!!errors.body}
                  disabled={pending}
                  {...register("body")}
                />
                <FieldError errors={[errors.body]} />
              </Field>

              <Field data-invalid={errors.recipientMode ? true : undefined}>
                <FieldLabel htmlFor="broadcast-recipient-mode">
                  Recipients
                </FieldLabel>
                <Controller
                  name="recipientMode"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={pending}
                    >
                      <SelectTrigger
                        id="broadcast-recipient-mode"
                        className="w-full min-w-0"
                        aria-invalid={!!errors.recipientMode}
                      >
                        <SelectValue placeholder="Choose recipient mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preview">
                          Preview (single email)
                        </SelectItem>
                        <SelectItem value="audience">Audience</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.recipientMode]} />
              </Field>

              {recipientMode === "preview" ? (
                <Field data-invalid={errors.previewEmail ? true : undefined}>
                  <FieldLabel htmlFor="broadcast-preview-email">
                    Preview email
                  </FieldLabel>
                  <Input
                    id="broadcast-preview-email"
                    type="email"
                    placeholder="you@example.com"
                    aria-invalid={!!errors.previewEmail}
                    disabled={pending}
                    {...register("previewEmail")}
                  />
                  <FieldDescription>
                    Sends only to this user. Audience is ignored.
                  </FieldDescription>
                  <FieldError errors={[errors.previewEmail]} />
                </Field>
              ) : (
                <Controller
                  name="audience"
                  control={control}
                  render={({ field }) => (
                    <ReengagementAudienceField
                      id="broadcast-audience"
                      channel="push"
                      value={field.value}
                      onValueChange={field.onChange}
                      balanceBelow={balanceBelow}
                      onBalanceBelowChange={(value) =>
                        form.setValue("balanceBelow", value)
                      }
                      disabled={pending}
                      error={errors.audience}
                    />
                  )}
                />
              )}
            </FieldGroup>

            <Button type="submit" disabled={pending}>
              {pending ? (
                <Loader2Icon
                  className="animate-spin"
                  data-icon="inline-start"
                />
              ) : null}
              Send push broadcast
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send push broadcast?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Title:</span>{" "}
                  {pendingValues?.title}
                </p>
                <p>
                  <span className="font-medium text-foreground">To:</span>{" "}
                  {pendingValues
                    ? getRecipientSummary(
                        pendingValues,
                        findAudienceOption(
                          audiencesQuery.data?.audiences,
                          pendingValues.audience
                        )?.label
                      )
                    : ""}
                </p>
                {pendingValues?.recipientMode === "audience" ? (
                  <p className="text-destructive">
                    This sends immediately to every user in the selected
                    audience. Preview to yourself first when possible.
                  </p>
                ) : (
                  <p>This sends immediately to the preview recipient only.</p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              onClick={(event) => {
                event.preventDefault()
                handleConfirm()
              }}
            >
              {pending ? (
                <Loader2Icon
                  className="animate-spin"
                  data-icon="inline-start"
                />
              ) : null}
              Send broadcast
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
