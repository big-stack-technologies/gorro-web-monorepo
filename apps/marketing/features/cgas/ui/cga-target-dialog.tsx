"use client"

import { useState } from "react"
import { Loader2Icon } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@gorro/ui/components/ui/dialog"
import { Input } from "@gorro/ui/components/ui/input"
import { Label } from "@gorro/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gorro/ui/components/ui/select"

import { CGA_TARGET_METRICS } from "@/features/cgas/constants"
import type { CgaActionSubject } from "@/features/cgas/types"
import { useSetCgaTarget } from "@/features/cgas/usecases"

type CgaTargetDialogProps = {
  cga: CgaActionSubject | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function defaultPeriodMonth() {
  const now = new Date()
  const month = String(now.getUTCMonth() + 1).padStart(2, "0")
  return `${now.getUTCFullYear()}-${month}`
}

export function CgaTargetDialog({
  cga,
  open,
  onOpenChange,
}: CgaTargetDialogProps) {
  const mutation = useSetCgaTarget(cga?.userId ?? "")
  const [metric, setMetric] = useState("registered_users")
  const [periodMonth, setPeriodMonth] = useState(defaultPeriodMonth())
  const [targetValue, setTargetValue] = useState("")

  if (!cga) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>Set monthly target</DialogTitle>
          <DialogDescription>
            {cga.name}. Rates are whole percentages; counts and GTV are absolute
            values.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col"
          onSubmit={(event) => {
            event.preventDefault()
            const value = Number(targetValue)
            if (!Number.isFinite(value)) return
            const [year, month] = periodMonth.split("-")
            mutation.mutate(
              {
                metric,
                periodMonth: `${year}-${month}-01`,
                targetValue: value,
              },
              { onSuccess: () => onOpenChange(false) }
            )
          }}
        >
          <div className="space-y-4 px-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cga-target-metric">Metric</Label>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger id="cga-target-metric" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CGA_TARGET_METRICS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cga-target-month">Month</Label>
            <Input
              id="cga-target-month"
              type="month"
              value={periodMonth}
              onChange={(event) => setPeriodMonth(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cga-target-value">Target value</Label>
            <Input
              id="cga-target-value"
              type="number"
              min={0}
              step="any"
              value={targetValue}
              onChange={(event) => setTargetValue(event.target.value)}
              required
            />
          </div>
          </div>

          <div className="flex justify-end gap-2 border-t px-4 py-4">
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
              ) : null}
              Save target
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
