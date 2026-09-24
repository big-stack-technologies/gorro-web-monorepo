"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"

import { createTeamLeadAction } from "@/features/org/actions"
import type { TeamLeadPayload } from "@/features/org/types"
import { invalidateOrgTeamLeads } from "@/features/org/usecases/invalidate-org"

export function useCreateTeamLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: TeamLeadPayload) =>
      unwrapActionResult(await createTeamLeadAction(payload)),
    onSuccess: () => {
      invalidateOrgTeamLeads(queryClient)
      toast.success("Team lead created")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Create team lead error:", error)
    },
  })
}
