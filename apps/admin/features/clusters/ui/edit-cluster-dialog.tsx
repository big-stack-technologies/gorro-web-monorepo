"use client"

import { useEffect } from "react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Loader2Icon } from "lucide-react"
import { useForm } from "react-hook-form"

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
import { Textarea } from "@gorro/ui/components/ui/textarea"
import {
  updateClusterSchema,
  type UpdateClusterFormValues,
} from "@/features/clusters/schema"
import type { ClusterDetail } from "@/features/clusters/types"
import { useUpdateCluster } from "@/features/clusters/usecases"

type EditClusterDialogProps = {
  cluster: ClusterDetail
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditClusterDialog({
  cluster,
  open,
  onOpenChange,
}: EditClusterDialogProps) {
  const updateMutation = useUpdateCluster(cluster.id)
  const form = useForm<UpdateClusterFormValues>({
    resolver: standardSchemaResolver(updateClusterSchema),
    defaultValues: {
      name: cluster.name,
      description: cluster.description ?? "",
      requiredApprovals: cluster.requiredApprovals,
    },
  })

  useEffect(() => {
    if (!open) return
    form.reset({
      name: cluster.name,
      description: cluster.description ?? "",
      requiredApprovals: cluster.requiredApprovals,
    })
  }, [cluster, form, open])

  function handleSubmit(values: UpdateClusterFormValues) {
    updateMutation.mutate(values, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Edit cluster</DialogTitle>
          <DialogDescription>{cluster.code}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex max-h-[min(80vh,640px)] flex-col"
        >
          <div className="overflow-y-auto px-4 py-4">
            <FieldGroup>
              <Field
                data-invalid={form.formState.errors.name ? true : undefined}
              >
                <FieldLabel htmlFor="cluster-name">Name</FieldLabel>
                <Input
                  id="cluster-name"
                  aria-invalid={!!form.formState.errors.name}
                  {...form.register("name")}
                />
                <FieldError errors={[form.formState.errors.name]} />
              </Field>
              <Field
                data-invalid={
                  form.formState.errors.description ? true : undefined
                }
              >
                <FieldLabel htmlFor="cluster-description">
                  Description
                </FieldLabel>
                <Textarea
                  id="cluster-description"
                  rows={4}
                  aria-invalid={!!form.formState.errors.description}
                  {...form.register("description")}
                />
                <FieldError errors={[form.formState.errors.description]} />
              </Field>
              <Field
                data-invalid={
                  form.formState.errors.requiredApprovals ? true : undefined
                }
              >
                <FieldLabel htmlFor="cluster-required-approvals">
                  Required approvals
                </FieldLabel>
                <Input
                  id="cluster-required-approvals"
                  type="number"
                  min={1}
                  max={10}
                  inputMode="numeric"
                  aria-invalid={!!form.formState.errors.requiredApprovals}
                  {...form.register("requiredApprovals", {
                    valueAsNumber: true,
                  })}
                />
                <FieldDescription>
                  Number of cluster admin approvals needed before payout.
                </FieldDescription>
                <FieldError
                  errors={[form.formState.errors.requiredApprovals]}
                />
              </Field>
            </FieldGroup>
          </div>
          <div className="flex justify-end gap-2 border-t bg-muted/50 p-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2Icon
                  data-icon="inline-start"
                  className="animate-spin"
                />
              ) : null}
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
