"use client"

import { useState } from "react"
import { format, isValid, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { Matcher } from "react-day-picker"

import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { cn } from "../lib/utils"

export type DatePickerProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  invalid?: boolean
  className?: string
  /** Output format for `onChange`. Default: `yyyy-MM-dd` */
  outputFormat?: string
}

function parseDateValue(value: string): Date | undefined {
  if (!value.trim()) return undefined
  const d = parseISO(value)
  return isValid(d) ? d : undefined
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  minDate,
  maxDate,
  invalid = false,
  className,
  outputFormat = "yyyy-MM-dd",
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = parseDateValue(value)

  const disabledDays: Matcher[] | undefined =
    minDate || maxDate
      ? [
          ...(minDate ? [{ before: minDate } satisfies Matcher] : []),
          ...(maxDate ? [{ after: maxDate } satisfies Matcher] : []),
        ]
      : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-invalid={invalid}
          className={cn(
            "w-full min-w-0 justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 size-4 shrink-0 opacity-60" />
          {selected ? format(selected, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          disabled={disabledDays}
          onSelect={(date) => {
            onChange(date ? format(date, outputFormat) : "")
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
