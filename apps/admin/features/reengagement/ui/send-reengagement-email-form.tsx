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
  parseEmailList,
  sendReengagementEmailFormSchema,
  type SendReengagementEmailFormValues,
} from "@/features/reengagement/schema"
import type { SendReengagementEmailPayload } from "@/features/reengagement/types"
import { ReengagementAudienceField } from "@/features/reengagement/ui/reengagement-audience-field"
import { findAudienceOption } from "@/features/reengagement/audience-utils"
import {
  useReengagementAudiences,
  useSendReengagementEmail,
} from "@/features/reengagement/usecases"

const defaultValues: SendReengagementEmailFormValues = {
  subject: "",
  body: "",
  recipientMode: "emails",
  emails: "",
  audience: "ALL",
  balanceBelow: undefined,
}

function toPayload(
  values: SendReengagementEmailFormValues
): SendReengagementEmailPayload {
  if (values.recipientMode === "emails") {
    return {
      subject: values.subject.trim(),
      body: values.body.trim(),
      emails: parseEmailList(values.emails ?? ""),
    }
  }

  return {
    subject: values.subject.trim(),
    body: values.body.trim(),
    audience: values.audience,
    ...(values.audience === "LOW_BALANCE" && values.balanceBelow != null
      ? { balanceBelow: values.balanceBelow }
      : {}),
  }
}

function getRecipientSummary(
  values: SendReengagementEmailFormValues,
  audienceLabel?: string
) {
  if (values.recipientMode === "emails") {
    const emails = parseEmailList(values.emails ?? "")
    if (emails.length === 1) return emails[0]
    return `${emails.length} specific addresses`
  }

  return audienceLabel ?? values.audience ?? "selected audience"
}

export function SendReengagementEmailForm() {
  const mutation = useSendReengagementEmail()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingValues, setPendingValues] =
    useState<SendReengagementEmailFormValues | null>(null)

  const form = useForm<SendReengagementEmailFormValues>({
    resolver: standardSchemaResolver(sendReengagementEmailFormSchema),
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

  const onSubmit = (values: SendReengagementEmailFormValues) => {
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

  const isAudienceBlast = pendingValues?.recipientMode === "audience"

  return (
    <>
      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader>
          <CardTitle className="font-heading text-base">Send email</CardTitle>
          <CardDescription>
            Compose a branded Gorro email. Sends run in the background (~1.6/sec).
            Preview to yourself before an audience blast.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Field data-invalid={errors.subject ? true : undefined}>
                <FieldLabel htmlFor="email-subject">Subject</FieldLabel>
                <Input
                  id="email-subject"
                  placeholder="Scheduled maintenance this Saturday"
                  aria-invalid={!!errors.subject}
                  disabled={pending}
                  {...register("subject")}
                />
                <FieldError errors={[errors.subject]} />
              </Field>

              <Field data-invalid={errors.body ? true : undefined}>
                <FieldLabel htmlFor="email-body">Body</FieldLabel>
                <Textarea
                  id="email-body"
                  placeholder="We will be carrying out scheduled maintenance..."
                  rows={6}
                  aria-invalid={!!errors.body}
                  disabled={pending}
                  {...register("body")}
                />
                <FieldDescription>
                  Blank lines become separate paragraphs in the branded template.
                </FieldDescription>
                <FieldError errors={[errors.body]} />
              </Field>

              <Field data-invalid={errors.recipientMode ? true : undefined}>
                <FieldLabel htmlFor="email-recipient-mode">Recipients</FieldLabel>
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
                        id="email-recipient-mode"
                        className="w-full min-w-0"
                        aria-invalid={!!errors.recipientMode}
                      >
                        <SelectValue placeholder="Choose recipient mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emails">Specific emails</SelectItem>
                        <SelectItem value="audience">Audience</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.recipientMode]} />
              </Field>

              {recipientMode === "emails" ? (
                <Field data-invalid={errors.emails ? true : undefined}>
                  <FieldLabel htmlFor="email-recipients">Email addresses</FieldLabel>
                  <Textarea
                    id="email-recipients"
                    placeholder="one.user@example.com&#10;another@example.com"
                    rows={4}
                    aria-invalid={!!errors.emails}
                    disabled={pending}
                    {...register("emails")}
                  />
                  <FieldDescription>
                    One per line or comma-separated. Unmatched addresses are
                    returned after send.
                  </FieldDescription>
                  <FieldError errors={[errors.emails]} />
                </Field>
              ) : (
                <Controller
                  name="audience"
                  control={control}
                  render={({ field }) => (
                    <ReengagementAudienceField
                      id="email-audience"
                      channel="email"
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
              Send email
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send email?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Subject:</span>{" "}
                  {pendingValues?.subject}
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
                {isAudienceBlast ? (
                  <p className="text-destructive">
                    This queues email for every user in the selected audience.
                    Preview to yourself first when possible.
                  </p>
                ) : (
                  <p>
                    Sends are queued in the background. You will get an estimated
                    completion time when accepted.
                  </p>
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
              Send email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
