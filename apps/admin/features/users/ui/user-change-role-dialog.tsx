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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gorro/ui/components/ui/select"
import { Textarea } from "@gorro/ui/components/ui/textarea"
import {
  USER_ROLE_FILTER_OPTIONS,
  USER_ROLES,
} from "@/features/users/constants"
import {
  changeUserRoleFormSchema,
  type ChangeUserRoleFormValues,
} from "@/features/users/schema"
import type { User } from "@/features/users/types"
import { useChangeUserRole } from "@/features/users/usecases"

function defaultRole(user: User): ChangeUserRoleFormValues["role"] {
  return USER_ROLES.includes(user.role as (typeof USER_ROLES)[number])
    ? (user.role as ChangeUserRoleFormValues["role"])
    : "user"
}

function defaultValuesFromUser(user: User): ChangeUserRoleFormValues {
  return {
    role: defaultRole(user),
    reason: "",
  }
}

type UserChangeRoleDialogProps = {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserChangeRoleDialog({
  user,
  open,
  onOpenChange,
}: UserChangeRoleDialogProps) {
  const form = useForm<ChangeUserRoleFormValues>({
    resolver: standardSchemaResolver(changeUserRoleFormSchema),
    defaultValues: defaultValuesFromUser(user),
  })

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = form

  useEffect(() => {
    if (open) {
      reset(defaultValuesFromUser(user))
    }
  }, [open, user, reset])

  const mutation = useChangeUserRole(user.id)

  const onSubmit = (values: ChangeUserRoleFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => onOpenChange(false),
    })
  }

  const pending = mutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Change user role</DialogTitle>
          <DialogDescription className="truncate">{user.email}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[min(70vh,520px)] flex-col"
        >
          <div className="overflow-y-auto px-4 py-4">
            <FieldGroup>
              <Field data-invalid={errors.role ? true : undefined}>
                <FieldLabel htmlFor="change-role">Role</FieldLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="change-role"
                        className="w-full min-w-0"
                        aria-invalid={!!errors.role}
                      >
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {USER_ROLE_FILTER_OPTIONS.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.role]} />
              </Field>
              <Field data-invalid={errors.reason ? true : undefined}>
                <FieldLabel htmlFor="change-role-reason">Reason</FieldLabel>
                <Textarea
                  id="change-role-reason"
                  placeholder="Why is this role change needed?"
                  rows={4}
                  aria-invalid={!!errors.reason}
                  {...register("reason")}
                />
                <FieldError errors={[errors.reason]} />
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
              Save role
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
