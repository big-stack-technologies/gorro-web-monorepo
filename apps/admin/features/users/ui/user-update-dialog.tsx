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
  USER_GENDERS,
  updateUserFormSchema,
  type UpdateUserFormValues,
} from "@/features/users/schema"
import type { User } from "@/features/users/types"
import { useUpdateUser } from "@/features/users/usecases"

function normalizeGender(raw: string): UpdateUserFormValues["gender"] {
  return USER_GENDERS.includes(raw as (typeof USER_GENDERS)[number])
    ? (raw as UpdateUserFormValues["gender"])
    : "unknown"
}

function defaultValuesFromUser(user: User): UpdateUserFormValues {
  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    middleName: user.middleName ?? "",
    gender: normalizeGender(user.gender),
    nin: user.nin ?? "",
    bvn: user.bvn ?? "",
  }
}

type UserUpdateDialogProps = {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserUpdateDialog({
  user,
  open,
  onOpenChange,
}: UserUpdateDialogProps) {
  const form = useForm<UpdateUserFormValues>({
    resolver: standardSchemaResolver(updateUserFormSchema),
    defaultValues: defaultValuesFromUser(user),
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  useEffect(() => {
    if (open) {
      reset(defaultValuesFromUser(user))
    }
  }, [open, user, reset])

  const mutation = useUpdateUser(user.id)

  const onSubmit = (values: UpdateUserFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => onOpenChange(false),
    })
  }

  const pending = mutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Update user</DialogTitle>
          <DialogDescription className="truncate">{user.email}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[min(70vh,520px)] flex-col"
        >
          <div className="overflow-y-auto px-4 py-4">
            <FieldGroup>
              <Field data-invalid={errors.firstName ? true : undefined}>
                <FieldLabel htmlFor="edit-firstName">First name</FieldLabel>
                <Input
                  id="edit-firstName"
                  autoComplete="given-name"
                  aria-invalid={!!errors.firstName}
                  {...register("firstName")}
                />
                <FieldError errors={[errors.firstName]} />
              </Field>
              <Field data-invalid={errors.middleName ? true : undefined}>
                <FieldLabel htmlFor="edit-middleName">Middle name</FieldLabel>
                <Input
                  id="edit-middleName"
                  autoComplete="additional-name"
                  aria-invalid={!!errors.middleName}
                  {...register("middleName")}
                />
                <FieldError errors={[errors.middleName]} />
              </Field>
              <Field data-invalid={errors.lastName ? true : undefined}>
                <FieldLabel htmlFor="edit-lastName">Last name</FieldLabel>
                <Input
                  id="edit-lastName"
                  autoComplete="family-name"
                  aria-invalid={!!errors.lastName}
                  {...register("lastName")}
                />
                <FieldError errors={[errors.lastName]} />
              </Field>
              <Field data-invalid={errors.gender ? true : undefined}>
                <FieldLabel htmlFor="edit-gender">Gender</FieldLabel>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="edit-gender"
                        className="w-full min-w-0"
                        aria-invalid={!!errors.gender}
                      >
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.gender]} />
              </Field>
              <Field data-invalid={errors.nin ? true : undefined}>
                <FieldLabel htmlFor="edit-nin">NIN</FieldLabel>
                <Input
                  id="edit-nin"
                  inputMode="numeric"
                  aria-invalid={!!errors.nin}
                  {...register("nin")}
                />
                <FieldError errors={[errors.nin]} />
              </Field>
              <Field data-invalid={errors.bvn ? true : undefined}>
                <FieldLabel htmlFor="edit-bvn">BVN</FieldLabel>
                <Input
                  id="edit-bvn"
                  inputMode="numeric"
                  aria-invalid={!!errors.bvn}
                  {...register("bvn")}
                />
                <FieldError errors={[errors.bvn]} />
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
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
