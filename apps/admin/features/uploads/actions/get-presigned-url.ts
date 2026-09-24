"use server"

import { get } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"
import type { PresignedUrlResponse } from "@/lib/types/upload"

export async function getPresignedUrlAction(fileUrl: string): Promise<string> {
  const { data } = await get<PresignedUrlResponse | string>(
    endpoints.uploads.presign,
    { params: { url: fileUrl } }
  )

  if (typeof data === "string") {
    return data
  }

  return data.presignedUrl ?? fileUrl
}
