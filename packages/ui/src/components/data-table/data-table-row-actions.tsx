"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { cn } from "../../lib/utils"

export type DataTableRowActionItem = {
  id: string
  label: string
  icon: LucideIcon
  onSelect?: () => void
  disabled?: boolean
  variant?: "default" | "destructive"
}

export type DataTableRowActionGroup = {
  /** Stable key for list reconciliation; defaults to index. */
  id?: string
  items: readonly DataTableRowActionItem[]
}

export type DataTableRowActionsProps = {
  /** Used for the trigger `aria-label` (e.g. user email or row title). */
  subjectLabel: string
  /** Optional first line in the menu (e.g. email); omit for icon-only context. */
  menuTitle?: string
  groups: readonly DataTableRowActionGroup[]
  triggerClassName?: string
  contentClassName?: string
}

/** Keep row-level click handlers (e.g. navigate on row click) from firing. */
function stopRowActivationBubble(
  event: React.MouseEvent | React.PointerEvent
) {
  event.stopPropagation()
}

/**
 * Shared “⋯” row actions menu for data tables (shadcn-style).
 */
export function DataTableRowActions({
  subjectLabel,
  menuTitle,
  groups,
  triggerClassName,
  contentClassName,
}: DataTableRowActionsProps) {
  return (
    <div
      data-slot="data-table-row-actions"
      className="inline-flex"
      onClick={stopRowActivationBubble}
      onPointerDown={stopRowActivationBubble}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "shrink-0 text-muted-foreground hover:text-foreground",
              triggerClassName
            )}
            aria-label={`Open actions for ${subjectLabel}`}
            onClick={stopRowActivationBubble}
            onPointerDown={stopRowActivationBubble}
          >
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={cn("w-56", contentClassName)}
          onClick={stopRowActivationBubble}
          onPointerDown={stopRowActivationBubble}
        >
          {menuTitle ? (
            <>
              <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                {menuTitle}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          ) : null}
          {groups.map((group, groupIndex) => (
            <React.Fragment key={group.id ?? `group-${groupIndex}`}>
              {groupIndex > 0 ? <DropdownMenuSeparator /> : null}
              <DropdownMenuGroup>
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      variant={item.variant}
                      disabled={item.disabled}
                      onClick={stopRowActivationBubble}
                      onPointerDown={stopRowActivationBubble}
                      onSelect={(event) => {
                        event.stopPropagation()
                        item.onSelect?.()
                      }}
                    >
                      <Icon />
                      {item.label}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
