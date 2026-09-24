"use server"

import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { UploadFileResponse } from "@/lib/types/upload"

export async function uploadFileAction(
  formData: FormData
): Promise<ActionResult<UploadFileResponse>> {
  try {
    const { data } = await post<UploadFileResponse>(
      endpoints.uploads.file,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return { success: true, data }
  } catch (error) {
    console.error("Upload file action failed:", error)
    return actionFailure(error, "Could not upload file")
  }
}
