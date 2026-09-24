"use client"

import { useState } from "react"
import { Loader2Icon } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@gorro/ui/components/ui/dialog"
import { Label } from "@gorro/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gorro/ui/components/ui/select"

import type { CgaActionSubject } from "@/features/cgas/types"
import {
  useTeamLeads,
  useTerritories,
  useUpdateCgaAssignment,
} from "@/features/cgas/usecases"

const UNASSIGNED = "__unassigned__"

type CgaAssignmentDialogProps = {
  cga: CgaActionSubject | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CgaAssignmentForm({
  cga,
  onOpenChange,
}: {
  cga: CgaActionSubject
  onOpenChange: (open: boolean) => void
}) {
  const mutation = useUpdateCgaAssignment(cga.userId)
  const teamLeads = useTeamLeads()
  const territories = useTerritories()
  const [teamLeadId, setTeamLeadId] = useState(
    () => cga.teamLead?.id ?? UNASSIGNED
  )
  const [territoryId, setTerritoryId] = useState(
    () => cga.territory?.id ?? UNASSIGNED
  )

  return (
    <>
      <DialogHeader className="border-b px-4 py-4">
        <DialogTitle>Assign team and territory</DialogTitle>
        <DialogDescription>
          {cga.name}. Choose unassigned to clear either field.
        </DialogDescription>
      </DialogHeader>
      <form
        className="flex flex-col"
        onSubmit={(event) => {
          event.preventDefault()
          mutation.mutate(
            {
              teamLeadId: teamLeadId === UNASSIGNED ? null : teamLeadId,
              territoryId: territoryId === UNASSIGNED ? null : territoryId,
            },
            { onSuccess: () => onOpenChange(false) }
          )
        }}
      >
        <div className="space-y-4 px-4 py-4">
        <div className="space-y-2">
          <Label>Team lead</Label>
          <Select value={teamLeadId} onValueChange={setTeamLeadId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Team lead" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
              {(teamLeads.data ?? []).map((lead) => (
                <SelectItem key={lead.id} value={lead.id}>
                  {lead.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Territory</Label>
          <Select value={territoryId} onValueChange={setTerritoryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Territory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
              {(territories.data ?? [])
                .filter((t) => t.isActive)
                .map((territory) => (
                  <SelectItem key={territory.id} value={territory.id}>
                    {territory.name} ({territory.code})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        </div>

        <div className="flex justify-end gap-2 border-t px-4 py-4">
          <Button
            type="button"
            variant="outline"
            disabled={mutation.isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2Icon className="animate-spin" data-icon="inline-start" />
            ) : null}
            Save assignment
          </Button>
        </div>
      </form>
    </>
  )
}

export function CgaAssignmentDialog({
  cga,
  open,
  onOpenChange,
}: CgaAssignmentDialogProps) {
  if (!cga) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        {open ? (
          <CgaAssignmentForm
            key={cga.userId}
            cga={cga}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
