"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loader2Icon } from "lucide-react"

import { DatePicker } from "@gorro/ui/components/date-picker"
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

import { useMarketingCgas } from "@/features/cgas/usecases"
import { COMMUNITY_TYPES } from "@/features/communities/constants"
import {
  communityFormSchema,
  communityFormValuesToPayload,
  communityFormValuesToUpdatePayload,
  communityToFormValues,
  type CommunityFormValues,
} from "@/features/communities/schema"
import type { MarketingCommunity } from "@/features/communities/types"
import {
  useCreateCommunity,
  useUpdateCommunity,
} from "@/features/communities/usecases"

type CommunityFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  community?: MarketingCommunity | null
}

const emptyFormValues: CommunityFormValues = communityToFormValues(null)

export function CommunityFormDialog({
  open,
  onOpenChange,
  community,
}: CommunityFormDialogProps) {
  const isEdit = community != null
  const createMutation = useCreateCommunity()
  const updateMutation = useUpdateCommunity(community?.id ?? "")
  const cgas = useMarketingCgas()

  const form = useForm<CommunityFormValues>({
    resolver: standardSchemaResolver(communityFormSchema),
    defaultValues: emptyFormValues,
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
      reset(communityToFormValues(community))
    }
  }, [open, community, reset])

  const pending = createMutation.isPending || updateMutation.isPending

  const onSubmit = (values: CommunityFormValues) => {
    const onSuccess = () => onOpenChange(false)
    if (isEdit && community) {
      updateMutation.mutate(communityFormValuesToUpdatePayload(values), {
        onSuccess,
      })
    } else {
      createMutation.mutate(communityFormValuesToPayload(values), { onSuccess })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>
            {isEdit ? "Edit community" : "New community"}
          </DialogTitle>
          <DialogDescription>
            Territory and team lead come from the owning CGA. Activity status is
            computed from member transactions.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="px-4 py-4">
          <FieldGroup>
            <Field data-invalid={errors.name ? true : undefined}>
              <FieldLabel htmlFor="community-name">Name</FieldLabel>
              <Input
                id="community-name"
                aria-invalid={!!errors.name}
                disabled={pending}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={errors.type ? true : undefined}>
              <FieldLabel htmlFor="community-type">Type</FieldLabel>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={pending}
                  >
                    <SelectTrigger
                      id="community-type"
                      className="w-full min-w-0"
                      aria-invalid={!!errors.type}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMUNITY_TYPES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.type]} />
            </Field>

            <Field data-invalid={errors.location ? true : undefined}>
              <FieldLabel htmlFor="community-location">Location</FieldLabel>
              <Input
                id="community-location"
                aria-invalid={!!errors.location}
                disabled={pending}
                {...register("location")}
              />
              <FieldError errors={[errors.location]} />
            </Field>

            <Field data-invalid={errors.estimatedSize ? true : undefined}>
              <FieldLabel htmlFor="community-size">
                Estimated size (optional)
              </FieldLabel>
              <Input
                id="community-size"
                type="number"
                min={0}
                step={1}
                aria-invalid={!!errors.estimatedSize}
                disabled={pending}
                {...register("estimatedSize")}
              />
              <FieldError errors={[errors.estimatedSize]} />
            </Field>

            <Field data-invalid={errors.cgaUserId ? true : undefined}>
              <FieldLabel htmlFor="community-cga">Owning CGA</FieldLabel>
              <Controller
                name="cgaUserId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={pending || cgas.isLoading}
                  >
                    <SelectTrigger
                      id="community-cga"
                      className="w-full min-w-0"
                      aria-invalid={!!errors.cgaUserId}
                    >
                      <SelectValue placeholder="Select CGA" />
                    </SelectTrigger>
                    <SelectContent>
                      {(cgas.data ?? []).map((cga) => (
                        <SelectItem key={cga.userId} value={cga.userId}>
                          {cga.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.cgaUserId]} />
            </Field>

            <Field data-invalid={errors.acquiredOn ? true : undefined}>
              <FieldLabel htmlFor="community-acquired">Acquired on</FieldLabel>
              <Controller
                name="acquiredOn"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="community-acquired"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={pending}
                    invalid={!!errors.acquiredOn}
                  />
                )}
              />
              <FieldError errors={[errors.acquiredOn]} />
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
              {isEdit ? "Save changes" : "Create community"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
