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

import type { MarketingTerritory } from "@/features/cgas/types"
import {
  territoryFormSchema,
  territoryFormValuesToPayload,
  territoryToFormValues,
  type TerritoryFormValues,
} from "@/features/org/schema"
import {
  useCreateTerritory,
  useUpdateTerritory,
} from "@/features/org/usecases"
import { normalizeTerritoryCode } from "@/features/org/utils/territory-code"

type TerritoryFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  territory?: MarketingTerritory | null
}

const emptyFormValues: TerritoryFormValues = territoryToFormValues(null)

export function TerritoryFormDialog({
  open,
  onOpenChange,
  territory,
}: TerritoryFormDialogProps) {
  const isEdit = territory != null
  const createMutation = useCreateTerritory()
  const updateMutation = useUpdateTerritory(territory?.id ?? "")

  const form = useForm<TerritoryFormValues>({
    resolver: standardSchemaResolver(territoryFormSchema),
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
      reset(territoryToFormValues(territory))
    }
  }, [open, territory, reset])

  const pending = createMutation.isPending || updateMutation.isPending

  const onSubmit = (values: TerritoryFormValues) => {
    const payload = territoryFormValuesToPayload(values)
    const onSuccess = () => onOpenChange(false)
    if (isEdit && territory) {
      updateMutation.mutate(payload, { onSuccess })
    } else {
      createMutation.mutate(payload, { onSuccess })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>
            {isEdit ? "Edit territory" : "New territory"}
          </DialogTitle>
          <DialogDescription>
            Code is a short handle (letters and digits only), stored in upper
            case.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="px-4 py-4">
          <FieldGroup>
            <Field data-invalid={errors.name ? true : undefined}>
              <FieldLabel htmlFor="territory-name">Name</FieldLabel>
              <Input
                id="territory-name"
                aria-invalid={!!errors.name}
                autoComplete="off"
                disabled={pending}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={errors.code ? true : undefined}>
              <FieldLabel htmlFor="territory-code">Code</FieldLabel>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <Input
                    id="territory-code"
                    aria-invalid={!!errors.code}
                    autoComplete="off"
                    className="font-mono uppercase"
                    disabled={pending}
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(normalizeTerritoryCode(event.target.value))
                    }
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
              <FieldError errors={[errors.code]} />
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
              {isEdit ? "Save changes" : "Create territory"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
