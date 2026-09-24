"use client"

import { CopyIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "./ui/button"
import { cn } from "../lib/utils"

type CopyableTruncatedIdProps = {
  value: string | null | undefined
  className?: string
}

/** Truncated monospace value with optional copy — reusable across tables and detail views. */
export function CopyableTruncatedId({
  value,
  className,
}: CopyableTruncatedIdProps) {
  const raw = value == null ? "" : String(value).trim()
  const isEmpty = raw === ""
  const display = isEmpty ? "N/A" : raw

  async function copy() {
    if (isEmpty) return
    try {
      await navigator.clipboard.writeText(raw)
      toast.success("Copied to clipboard")
    } catch {
      toast.error("Could not copy")
    }
  }

  return (
    <div
      className={cn(
        "flex max-w-[min(100%,11rem)] items-center gap-0.5 sm:max-w-52",
        className
      )}
    >
      <span
        className="min-w-0 flex-1 truncate font-mono text-xs"
        title={!isEmpty ? raw : undefined}
      >
        {display}
      </span>
      {!isEmpty ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation()
            void copy()
          }}
          aria-label="Copy value"
        >
          <CopyIcon className="size-3.5" />
        </Button>
      ) : null}
    </div>
  )
}
