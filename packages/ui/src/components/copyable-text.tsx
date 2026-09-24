"use client"

import { CopyIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "./ui/button"
import { cn } from "../lib/utils"

type CopyableTextProps = {
  value: string
  className?: string
  valueClassName?: string
  copyLabel?: string
}

export function CopyableText({
  value,
  className,
  valueClassName,
  copyLabel = "Copy value",
}: CopyableTextProps) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      toast.success("Copied to clipboard")
    } catch (error) {
      toast.error("Could not copy")
      console.error("Copy to clipboard failed:", error)
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border bg-background px-2 py-0.5",
        className
      )}
    >
      <span className={cn("font-mono font-semibold tabular-nums", valueClassName)}>
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={() => void copy()}
        aria-label={copyLabel}
      >
        <CopyIcon className="size-3.5" />
      </Button>
    </span>
  )
}
