"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { uploadFileAction } from "@/features/uploads/actions"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import type { UploadDescription } from "@/lib/types/upload"

export function useUploadFile(description: UploadDescription) {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("description", description)
      return unwrapActionResult(await uploadFileAction(formData))
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Upload file error:", error)
    },
  })
}
