"use client"

import { useRef, useState } from "react"
import { ImageIcon, Loader2Icon, XIcon } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

import { Button } from "@gorro/ui/components/ui/button"
import { Label } from "@gorro/ui/components/ui/label"
import { usePresignedUrl, useUploadFile } from "@/features/uploads/usecases"
import type { UploadDescription } from "@/lib/types/upload"
import { cn } from "@gorro/ui/utils"

const MAX_FILE_SIZE_BYTES = 1024 * 1024

type FileUploadProps = {
  description: UploadDescription
  value?: string
  onChange: (fileUrl: string | undefined) => void
  disabled?: boolean
  accept?: string
  label?: string
}

export function FileUpload({
  description,
  value,
  onChange,
  disabled = false,
  accept = "image/*",
  label = "File",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)

  const uploadMutation = useUploadFile(description)
  const presignQuery = usePresignedUrl(value)

  const previewUrl =
    localPreviewUrl ??
    (value
      ? (presignQuery.data ?? uploadMutation.data?.presignedUrl)
      : null)

  const pending = uploadMutation.isPending
  const isDisabled = disabled || pending

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("File must be 1 MB or smaller")
      event.target.value = ""
      return
    }

    setLocalPreviewUrl(URL.createObjectURL(file))

    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        onChange(data.fileUrl)
        setLocalPreviewUrl(data.presignedUrl)
      },
      onError: () => {
        setLocalPreviewUrl(null)
      },
    })

    event.target.value = ""
  }

  const handleClear = () => {
    if (localPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(localPreviewUrl)
    }
    uploadMutation.reset()
    onChange(undefined)
    setLocalPreviewUrl(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg border border-dashed border-border bg-muted/20 p-4",
          isDisabled && "opacity-60"
        )}
      >
        {previewUrl ? (
          <div className="relative mx-auto size-32 overflow-hidden rounded-lg border bg-background">
            <Image
              src={previewUrl}
              alt="Upload preview"
              fill
              className="object-cover"
              unoptimized
            />
            {!isDisabled ? (
              <Button
                type="button"
                variant="secondary"
                size="icon-xs"
                className="absolute top-1 right-1 size-7"
                onClick={handleClear}
                aria-label="Remove file"
              >
                <XIcon className="size-3.5" />
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
            <ImageIcon className="size-8 opacity-50" aria-hidden />
            <p className="text-sm">No file selected</p>
            <p className="text-center text-xs text-muted-foreground">
              Max file size: 1 MB
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isDisabled}
            onClick={() => inputRef.current?.click()}
          >
            {pending ? (
              <Loader2Icon className="animate-spin" data-icon="inline-start" />
            ) : null}
            {previewUrl ? "Replace file" : "Choose file"}
          </Button>
          {previewUrl && !isDisabled ? (
            <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
              Clear
            </Button>
          ) : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          disabled={isDisabled}
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}
