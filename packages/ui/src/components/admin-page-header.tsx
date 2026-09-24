import type { ComponentPropsWithoutRef } from "react"

import { cn } from "../lib/utils"

type AdminPageHeaderProps = Omit<
  ComponentPropsWithoutRef<"header">,
  "children" | "title"
> & {
  title: string
  description: string
}

export function AdminPageHeader({
  title,
  description,
  className,
  ...props
}: AdminPageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-1", className)} {...props}>
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </header>
  )
}
