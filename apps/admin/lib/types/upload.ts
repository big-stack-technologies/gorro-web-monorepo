export type UploadDescription =
  | "feedback"
  | "profile_picture"
  | "general"
  | "ajo"
  | "cluster"
  | "savings"

export type UploadFileResponse = {
  success: boolean
  message: string
  fileUrl: string
  presignedUrl: string
}

export type PresignedUrlResponse = {
  presignedUrl?: string
}
