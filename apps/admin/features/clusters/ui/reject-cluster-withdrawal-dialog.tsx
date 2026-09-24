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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@gorro/ui/components/ui/field"
import { Textarea } from "@gorro/ui/components/ui/textarea"
import {
  rejectClusterWithdrawalSchema,
  type RejectClusterWithdrawalPayload,
} from "@/features/clusters/schema"
import { useRejectClusterWithdrawal } from "@/features/clusters/usecases"
import type { ClusterWithdrawal } from "@/features/clusters/types"


type RejectClusterWithdrawalDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  withdrawal: ClusterWithdrawal
}

export function RejectClusterWithdrawalDialog({
  open,
  onOpenChange,
  withdrawal,
}: RejectClusterWithdrawalDialogProps) {
  const form = useForm<RejectClusterWithdrawalPayload>({
    resolver: standardSchemaResolver(rejectClusterWithdrawalSchema),
    defaultValues: { reason: "" },
  })

  const rejectMutation = useRejectClusterWithdrawal(
    withdrawal.clusterId,
    withdrawal.id
  )

  function handleReject(values: RejectClusterWithdrawalPayload) {
    rejectMutation.mutate(values, { onSuccess: () => onOpenChange(false) })
  }

  useEffect(() => {
    if (open) form.reset({ reason: "" })
  }, [form, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Reject cluster withdrawal</DialogTitle>
          <DialogDescription className="truncate font-mono text-xs">
            {withdrawal.clusterName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleReject)} className="flex flex-col">
          <div className="px-4 py-4">
            <FieldGroup>
              <Field
                data-invalid={form.formState.errors.reason ? true : undefined}
              >
                <FieldLabel htmlFor="cluster-withdrawal-reason">
                  Reason
                </FieldLabel>
                <Textarea
                  id="cluster-withdrawal-reason"
                  rows={4}
                  placeholder="Explain why this withdrawal is being rejected"
                  aria-invalid={!!form.formState.errors.reason}
                  {...form.register("reason")}
                />
                <FieldError errors={[form.formState.errors.reason]} />
              </Field>
            </FieldGroup>
          </div>
          <div className="flex justify-end gap-2 border-t bg-muted/50 p-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={rejectMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={rejectMutation.isPending}>
              {rejectMutation.isPending ? (
                <Loader2Icon
                  data-icon="inline-start"
                  className="animate-spin"
                />
              ) : null}
              Reject withdrawal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
