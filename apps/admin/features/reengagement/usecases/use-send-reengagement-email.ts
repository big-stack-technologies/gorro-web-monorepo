"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { sendReengagementEmailAction } from "@/features/reengagement/actions"
import type { SendReengagementEmailPayload } from "@/features/reengagement/types"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"

export function useSendReengagementEmail() {
  return useMutation({
    mutationFn: async (payload: SendReengagementEmailPayload) =>
      unwrapActionResult(await sendReengagementEmailAction(payload)),
    onSuccess: (response) => {
      toast.success(
        `Queued for ${response.recipients.toLocaleString()} recipient${response.recipients === 1 ? "" : "s"} (~${response.estimatedSeconds}s)`
      )

      if (response.notFound && response.notFound.length > 0) {
        toast.warning(
          `${response.notFound.length} address${response.notFound.length === 1 ? "" : "es"} not found: ${response.notFound.join(", ")}`
        )
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Send re-engagement email error:", error)
    },
  })
}
