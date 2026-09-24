"use client"

import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { CircleAlertIcon, Loader2Icon } from "lucide-react"

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
import {
  DEFAULT_VIRTUAL_ACCOUNT_PROVIDER,
  VIRTUAL_ACCOUNT_PROVIDER_OPTIONS,
} from "@/features/users/constants"
import {
  createVirtualAccountFormSchema,
  type CreateVirtualAccountFormValues,
} from "@/features/users/schema"
import type { User, VirtualAccountData } from "@/features/users/types"
import { VirtualAccountDetails } from "@/features/users/ui/virtual-account-details"
import { getVirtualAccountEligibility } from "@/features/users/virtual-account-eligibility"
import { useCreateUserVirtualAccount } from "@/features/users/usecases"

type UserCreateVirtualAccountDialogProps = {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatMissingFields(fields: string[]): string {
  if (fields.length === 0) return ""
  if (fields.length === 1) return fields[0]
  if (fields.length === 2) return `${fields[0]} and ${fields[1]}`
  return `${fields.slice(0, -1).join(", ")}, and ${fields.at(-1)}`
}

export function UserCreateVirtualAccountDialog({
  user,
  open,
  onOpenChange,
}: UserCreateVirtualAccountDialogProps) {
  const [createdAccount, setCreatedAccount] = useState<VirtualAccountData | null>(
    null
  )
  const { eligible, missingFields } = getVirtualAccountEligibility(user)

  const form = useForm<CreateVirtualAccountFormValues>({
    resolver: standardSchemaResolver(createVirtualAccountFormSchema),
    defaultValues: { provider: DEFAULT_VIRTUAL_ACCOUNT_PROVIDER },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  useEffect(() => {
    if (open) {
      reset({ provider: DEFAULT_VIRTUAL_ACCOUNT_PROVIDER })
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCreatedAccount(null)
    }
  }, [open, reset])

  const mutation = useCreateUserVirtualAccount(user.id)

  const onSubmit = (values: CreateVirtualAccountFormValues) => {
    mutation.mutate(values, {
      onSuccess: (result) => {
        setCreatedAccount(result.account)
      },
    })
  }

  const pending = mutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Create virtual account</DialogTitle>
          <DialogDescription className="truncate">{user.email}</DialogDescription>
        </DialogHeader>

        {createdAccount ? (
          <div className="flex max-h-[min(70vh,520px)] flex-col">
            <div className="overflow-y-auto px-4 py-4">
              <p className="mb-3 text-sm text-muted-foreground">
                Virtual account details for this user:
              </p>
              <VirtualAccountDetails account={createdAccount} />
            </div>
            <div className="flex justify-end gap-2 border-t bg-muted/50 p-4">
              <Button type="button" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex max-h-[min(70vh,520px)] flex-col"
          >
            <div className="overflow-y-auto px-4 py-4">
              {!eligible ? (
                <div
                  role="alert"
                  className="mb-4 flex gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5"
                >
                  <CircleAlertIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-destructive">
                      Required identity fields are missing
                    </p>
                    <p className="text-muted-foreground">
                      Add {formatMissingFields(missingFields)} before creating a
                      virtual account.
                    </p>
                  </div>
                </div>
              ) : null}

              <FieldGroup>
                <Field data-invalid={errors.provider ? true : undefined}>
                  <FieldLabel htmlFor="virtual-account-provider">
                    Provider
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="provider"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!eligible || pending}
                      >
                        <SelectTrigger id="virtual-account-provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {VIRTUAL_ACCOUNT_PROVIDER_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.provider]} />
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
              <Button type="submit" disabled={!eligible || pending}>
                {pending ? (
                  <Loader2Icon className="animate-spin" data-icon="inline-start" />
                ) : null}
                Create virtual account
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
