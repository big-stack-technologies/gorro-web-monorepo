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

import { useMarketingCgas, useTerritories } from "@/features/cgas/usecases"
import type { CgaPlacement } from "@/features/cgas/types"
import type { MarketingTeamLead } from "@/features/cgas/types"
import {
  TEAM_LEAD_NONE_TERRITORY,
  TEAM_LEAD_NONE_USER,
  teamLeadFormSchema,
  teamLeadFormValuesToPayload,
  teamLeadToFormValues,
  type TeamLeadFormValues,
} from "@/features/org/schema"
import {
  useCreateTeamLead,
  useUpdateTeamLead,
} from "@/features/org/usecases"

type TeamLeadFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  teamLead?: MarketingTeamLead | null
}

const emptyFormValues: TeamLeadFormValues = teamLeadToFormValues(null)

function cgaSelectLabel(cga: CgaPlacement): string {
  if (cga.territory) {
    return `${cga.name} (${cga.territory.name})`
  }
  return cga.name
}

export function TeamLeadFormDialog({
  open,
  onOpenChange,
  teamLead,
}: TeamLeadFormDialogProps) {
  const isEdit = teamLead != null
  const createMutation = useCreateTeamLead()
  const updateMutation = useUpdateTeamLead(teamLead?.id ?? "")
  const territories = useTerritories()
  const cgas = useMarketingCgas()
  const cgaRows = cgas.data ?? []
  const linkedUserId = teamLead?.user?.id
  const linkedUserMissingFromList =
    linkedUserId != null &&
    !cgaRows.some((cga) => cga.userId === linkedUserId)

  const form = useForm<TeamLeadFormValues>({
    resolver: standardSchemaResolver(teamLeadFormSchema),
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
      reset(teamLeadToFormValues(teamLead))
    }
  }, [open, teamLead, reset])

  const pending = createMutation.isPending || updateMutation.isPending

  const onSubmit = (values: TeamLeadFormValues) => {
    const payload = teamLeadFormValuesToPayload(values)
    const onSuccess = () => onOpenChange(false)
    if (isEdit && teamLead) {
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
            {isEdit ? "Edit team lead" : "New team lead"}
          </DialogTitle>
          <DialogDescription>
            Link a Gorro user when they can log in; you can add the account
            later. Territory is optional.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="px-4 py-4">
          <FieldGroup>
            <Field data-invalid={errors.name ? true : undefined}>
              <FieldLabel htmlFor="team-lead-name">Name</FieldLabel>
              <Input
                id="team-lead-name"
                aria-invalid={!!errors.name}
                autoComplete="off"
                disabled={pending}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={errors.userId ? true : undefined}>
              <FieldLabel htmlFor="team-lead-user">Linked CGA</FieldLabel>
              <Controller
                name="userId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={pending}
                  >
                    <SelectTrigger id="team-lead-user" aria-invalid={!!errors.userId}>
                      <SelectValue placeholder="Linked CGA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TEAM_LEAD_NONE_USER}>
                        No linked user
                      </SelectItem>
                      {linkedUserMissingFromList && teamLead?.user ? (
                        <SelectItem value={teamLead.user.id}>
                          {teamLead.user.name}
                        </SelectItem>
                      ) : null}
                      {cgaRows.map((cga) => (
                        <SelectItem key={cga.userId} value={cga.userId}>
                          {cgaSelectLabel(cga)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.userId]} />
            </Field>

            <Field data-invalid={errors.territoryId ? true : undefined}>
              <FieldLabel htmlFor="team-lead-territory">Territory</FieldLabel>
              <Controller
                name="territoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={pending}
                  >
                    <SelectTrigger id="team-lead-territory">
                      <SelectValue placeholder="Territory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TEAM_LEAD_NONE_TERRITORY}>
                        None
                      </SelectItem>
                      {(territories.data ?? []).map((territory) => (
                        <SelectItem key={territory.id} value={territory.id}>
                          {territory.name} ({territory.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.territoryId]} />
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
              {isEdit ? "Save changes" : "Create team lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
