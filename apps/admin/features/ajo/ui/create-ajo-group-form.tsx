"use client"

import { useState } from "react"
import Link from "next/link"
import { addDays, startOfDay } from "date-fns"
import { Controller, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loader2Icon } from "lucide-react"

import { CopyableText } from "@gorro/ui/components/copyable-text"
import { DatePicker } from "@gorro/ui/components/date-picker"
import { FileUpload } from "@/components/file-upload"
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
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { AJO_FREQUENCY_OPTIONS, AJO_WEEKDAY_OPTIONS } from "@/features/ajo/constants"
import {
  createAjoGroupFormSchema,
  type CreateAjoGroupFormValues,
} from "@/features/ajo/schema"
import type { AjoGroup } from "@/features/ajo/types"
import { useAjoConfig, useCreateAjoGroup } from "@/features/ajo/usecases"
import { USER_ROLE } from "@/features/users/constants"
import { routes } from "@/lib/routes"

const defaultFormValues: CreateAjoGroupFormValues = {
  name: "",
  contributionAmount: 0,
  frequency: "WEEKLY",
  startDate: "",
  slotCount: 2,
  description: "",
  imageUrl: "",
}

export function CreateAjoGroupForm() {
  const { data: profile } = useGetProfile()
  const isSuperAdmin =
    profile?.roles?.includes(USER_ROLE.super_admin) === true

  const { data: config } = useAjoConfig()
  const mutation = useCreateAjoGroup()
  const [createdGroup, setCreatedGroup] = useState<AjoGroup | null>(null)

  const maxSlots = config?.maxSlotsPerGroup ?? 30
  const minContribution = config?.minContributionNaira ?? 500

  const form = useForm<CreateAjoGroupFormValues>({
    resolver: standardSchemaResolver(createAjoGroupFormSchema),
    defaultValues: defaultFormValues,
  })

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form

  // eslint-disable-next-line react-hooks/incompatible-library
  const imageUrl = watch("imageUrl")
  const frequency = watch("frequency")
  const isWeekly = frequency === "WEEKLY"

  if (!isSuperAdmin) {
    return (
      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader>
          <CardTitle className="font-heading text-base">Create group</CardTitle>
          <CardDescription>
            Only super admins can create Gorro public Ajo groups.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const onSubmit = (values: CreateAjoGroupFormValues) => {
    mutation.mutate(
      {
        name: values.name,
        type: "PUBLIC",
        contributionAmount: values.contributionAmount,
        frequency: values.frequency,
        startDate: values.startDate,
        slotCount: values.slotCount,
        ...(values.frequency === "WEEKLY" && {
          contributionDayOfWeek: values.contributionDayOfWeek,
          payoutDayOfWeek: values.payoutDayOfWeek,
        }),
        description: values.description?.trim() || undefined,
        imageUrl: values.imageUrl?.trim() || undefined,
      },
      {
        onSuccess: (group) => {
          setCreatedGroup(group)
          reset(defaultFormValues)
        },
      }
    )
  }

  const pending = mutation.isPending
  const minStartDate = startOfDay(addDays(new Date(), 1))

  return (
    <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
      <CardHeader>
        <CardTitle className="font-heading text-base">
          Create public group
        </CardTitle>
        <CardDescription>
          Create a Gorro-hosted public Ajo. Start date must be at least 24 hours
          away. Minimum contribution: ₦{minContribution.toLocaleString()}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {createdGroup ? (
          <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="font-medium text-foreground">
              Group &quot;{createdGroup.name}&quot; created
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>Invite code:</span>
              <CopyableText
                value={createdGroup.code}
                copyLabel="Copy invite code"
              />
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" asChild>
                <Link href={routes.protected.ajo.groupDetail(createdGroup.id)}>
                  View group
                </Link>
              </Button>
              <Button type="button" variant="ghost" size="sm" asChild>
                <Link href={routes.protected.ajo.base}>View groups list</Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCreatedGroup(null)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field data-invalid={errors.name ? true : undefined}>
              <FieldLabel htmlFor="ajo-group-name">Group name</FieldLabel>
              <Input
                id="ajo-group-name"
                placeholder="Market Women Circle"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field
              data-invalid={errors.contributionAmount ? true : undefined}
            >
              <FieldLabel htmlFor="ajo-contribution">
                Contribution amount (₦)
              </FieldLabel>
              <Input
                id="ajo-contribution"
                type="number"
                step="1"
                min={minContribution}
                aria-invalid={!!errors.contributionAmount}
                {...register("contributionAmount", { valueAsNumber: true })}
              />
              <FieldError errors={[errors.contributionAmount]} />
            </Field>

            <Field data-invalid={errors.frequency ? true : undefined}>
              <FieldLabel htmlFor="ajo-frequency">Frequency</FieldLabel>
              <Controller
                name="frequency"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                      if (value !== "WEEKLY") {
                        setValue("contributionDayOfWeek", undefined, {
                          shouldValidate: true,
                        })
                        setValue("payoutDayOfWeek", undefined, {
                          shouldValidate: true,
                        })
                      }
                    }}
                  >
                    <SelectTrigger
                      id="ajo-frequency"
                      className="w-full min-w-0"
                      aria-invalid={!!errors.frequency}
                    >
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {AJO_FREQUENCY_OPTIONS.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.frequency]} />
            </Field>

            {isWeekly ? (
              <>
                <Field
                  data-invalid={errors.contributionDayOfWeek ? true : undefined}
                >
                  <FieldLabel htmlFor="ajo-contribution-day">
                    Contribution day
                  </FieldLabel>
                  <Controller
                    name="contributionDayOfWeek"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={
                          field.value != null ? String(field.value) : undefined
                        }
                        onValueChange={(value) =>
                          field.onChange(Number(value))
                        }
                      >
                        <SelectTrigger
                          id="ajo-contribution-day"
                          className="w-full min-w-0"
                          aria-invalid={!!errors.contributionDayOfWeek}
                        >
                          <SelectValue placeholder="Select contribution day" />
                        </SelectTrigger>
                        <SelectContent>
                          {AJO_WEEKDAY_OPTIONS.map(({ value, label }) => (
                            <SelectItem key={value} value={String(value)}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.contributionDayOfWeek]} />
                </Field>

                <Field
                  data-invalid={errors.payoutDayOfWeek ? true : undefined}
                >
                  <FieldLabel htmlFor="ajo-payout-day">Payout day</FieldLabel>
                  <Controller
                    name="payoutDayOfWeek"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={
                          field.value != null ? String(field.value) : undefined
                        }
                        onValueChange={(value) =>
                          field.onChange(Number(value))
                        }
                      >
                        <SelectTrigger
                          id="ajo-payout-day"
                          className="w-full min-w-0"
                          aria-invalid={!!errors.payoutDayOfWeek}
                        >
                          <SelectValue placeholder="Select payout day" />
                        </SelectTrigger>
                        <SelectContent>
                          {AJO_WEEKDAY_OPTIONS.map(({ value, label }) => (
                            <SelectItem key={value} value={String(value)}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.payoutDayOfWeek]} />
                </Field>
              </>
            ) : null}

            <Field data-invalid={errors.startDate ? true : undefined}>
              <FieldLabel htmlFor="ajo-start-date">Start date</FieldLabel>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="ajo-start-date"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a start date"
                    disabled={pending}
                    minDate={minStartDate}
                    invalid={!!errors.startDate}
                  />
                )}
              />
              <FieldError errors={[errors.startDate]} />
            </Field>

            <Field data-invalid={errors.slotCount ? true : undefined}>
              <FieldLabel htmlFor="ajo-slot-count">Slot count</FieldLabel>
              <Input
                id="ajo-slot-count"
                type="number"
                step="1"
                min={2}
                max={maxSlots}
                aria-invalid={!!errors.slotCount}
                {...register("slotCount", { valueAsNumber: true })}
              />
              <FieldError errors={[errors.slotCount]} />
            </Field>

            <Field data-invalid={errors.description ? true : undefined}>
              <FieldLabel htmlFor="ajo-description">Description</FieldLabel>
              <Textarea
                id="ajo-description"
                placeholder="Optional group description"
                rows={3}
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              <FieldError errors={[errors.description]} />
            </Field>

            <FileUpload
              description="ajo"
              label="Group image"
              value={imageUrl}
              onChange={(url) =>
                setValue("imageUrl", url ?? "", { shouldValidate: true })
              }
              disabled={pending}
            />
          </FieldGroup>

          <Button type="submit" disabled={pending}>
            {pending ? (
              <Loader2Icon className="animate-spin" data-icon="inline-start" />
            ) : null}
            Create group
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
