"use client"

import * as React from "react"
import { endOfDay, format, isValid, parseISO, startOfDay } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Input } from "../ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { cn } from "../../lib/utils"

const SELECT_EMPTY = "__dt_empty__"

export type DataTableFilterField =
  | {
    type: "text"
    param: string
    label: string
    placeholder?: string
  }
  | {
    type: "select"
    param: string
    label: string
    placeholder?: string
    options: readonly { value: string; label: string }[]
    /** Label for the “no filter” option (omits param from URL). */
    emptyLabel?: string
    /** When false, the empty option is omitted and a value must always be selected. */
    clearable?: boolean
  }
  | {
    type: "number"
    param: string
    label: string
    placeholder?: string
  }
  | {
    type: "date"
    param: string
    label: string
    /** Start or end of the selected calendar day, encoded as ISO 8601 for the API. */
    boundary: "startOfDay" | "endOfDay"
  }

type DataTableFilterBarProps = {
  fields: readonly DataTableFilterField[]
  activeFilters: Record<string, string>
  setFilters: (patch: Record<string, string | undefined>) => void
  clearFilters: () => void
}

function parseIsoToDate(value: string): Date | undefined {
  if (!value.trim()) return undefined
  const d = parseISO(value)
  return isValid(d) ? d : undefined
}

function DataTableDateFilter({
  id,
  value,
  boundary,
  placeholder,
  onChange,
}: {
  id: string
  value: string
  boundary: "startOfDay" | "endOfDay"
  placeholder: string
  onChange: (iso: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const selected = parseIsoToDate(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "h-7 w-full min-w-0 justify-start px-2 text-left text-xs font-normal",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-1 size-3.5 shrink-0 opacity-60" />
          <span className="truncate">
            {selected ? format(selected, "PPP") : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (!date) {
              onChange("")
              return
            }
            const iso =
              boundary === "startOfDay"
                ? startOfDay(date).toISOString()
                : endOfDay(date).toISOString()
            onChange(iso)
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

function buildDraftFromActive(
  fields: readonly DataTableFilterField[],
  activeFilters: Record<string, string>
) {
  const draft: Record<string, string> = {}
  for (const f of fields) {
    draft[f.param] = activeFilters[f.param] ?? ""
  }
  return draft
}

export function DataTableFilterBar({
  fields,
  activeFilters,
  setFilters,
  clearFilters,
}: DataTableFilterBarProps) {
  const [draft, setDraft] = React.useState(() =>
    buildDraftFromActive(fields, activeFilters)
  )

  React.useEffect(() => {
    setDraft((prev) => {
      const next = { ...prev }
      for (const f of fields) {
        next[f.param] = activeFilters[f.param] ?? ""
      }
      return next
    })
  }, [activeFilters, fields])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const patch: Record<string, string | undefined> = {}
    for (const f of fields) {
      const raw = draft[f.param]?.trim() ?? ""
      if (f.type === "number") {
        if (raw === "") {
          patch[f.param] = undefined
        } else {
          const n = Number(raw)
          patch[f.param] = Number.isFinite(n) ? String(n) : undefined
        }
      } else {
        patch[f.param] = raw === "" ? undefined : raw
      }
    }
    setFilters(patch)
  }

  function handleClear() {
    clearFilters()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-row items-end gap-2 border-b border-border bg-muted/30 px-3 py-2"
    >
      <ScrollArea
        className="min-w-0 flex-1"
      >
        <div className="flex w-max flex-nowrap items-end gap-x-2 gap-y-1 pb-0.5">
          {fields.map((field) => (
            <div
              key={field.param}
              className="flex w-44 shrink-0 flex-col gap-0.5 sm:w-52"
            >
              <label
                htmlFor={`dt-filter-${field.param}`}
                className="text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase"
              >
                {field.label}
              </label>
              {field.type === "text" ? (
                <Input
                  id={`dt-filter-${field.param}`}
                  type="search"
                  autoComplete="off"
                  value={draft[field.param] ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, [field.param]: e.target.value }))
                  }
                  placeholder={field.placeholder ?? field.label}
                  className="h-7 text-xs"
                />
              ) : field.type === "number" ? (
                <Input
                  id={`dt-filter-${field.param}`}
                  type="number"
                  inputMode="numeric"
                  autoComplete="off"
                  value={draft[field.param] ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, [field.param]: e.target.value }))
                  }
                  placeholder={field.placeholder ?? field.label}
                  className="h-7 text-xs"
                />
              ) : field.type === "date" ? (
                <DataTableDateFilter
                  id={`dt-filter-${field.param}`}
                  value={draft[field.param] ?? ""}
                  boundary={field.boundary}
                  placeholder={field.label}
                  onChange={(iso) =>
                    setDraft((d) => ({ ...d, [field.param]: iso }))
                  }
                />
              ) : (
                <Select
                  value={
                    draft[field.param]
                      ? draft[field.param]
                      : SELECT_EMPTY
                  }
                  onValueChange={(v) =>
                    setDraft((d) => ({
                      ...d,
                      [field.param]: v === SELECT_EMPTY ? "" : v,
                    }))
                  }
                >
                  <SelectTrigger
                    id={`dt-filter-${field.param}`}
                    size="sm"
                    className="h-7 w-full min-w-0 text-xs"
                  >
                    <SelectValue placeholder={field.placeholder ?? field.label} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.clearable !== false ? (
                      <SelectItem value={SELECT_EMPTY}>
                        {field.emptyLabel ?? "Any"}
                      </SelectItem>
                    ) : null}
                    {field.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex shrink-0 items-center gap-1.5 pb-0.5">
        <Button type="submit" size="xs" className="h-7">
          Apply
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className={cn("h-7 text-muted-foreground")}
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>
    </form>
  )
}
