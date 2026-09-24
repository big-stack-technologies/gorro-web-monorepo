"use client"

import { Button } from "@gorro/ui/components/ui/button"
import { Input } from "@gorro/ui/components/ui/input"
import { Label } from "@gorro/ui/components/ui/label"

import { DEFAULT_SEGMENT_THRESHOLDS } from "@/features/segments/constants"
import type { SegmentThresholdOptions } from "@/features/segments/types"

type SegmentThresholdControlsProps = {
  options: SegmentThresholdOptions
  onApply: (next: SegmentThresholdOptions) => void
}

export function SegmentThresholdControls({
  options,
  onApply,
}: SegmentThresholdControlsProps) {
  return (
    <form
      key={`${options.minDaysSinceSignup}-${options.inactiveDays}-${options.nearZeroBalance}`}
      className="grid gap-4 rounded-xl border border-border p-4 ring-1 ring-foreground/10 sm:grid-cols-3 lg:grid-cols-4"
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        onApply({
          minDaysSinceSignup: String(
            formData.get("minDaysSinceSignup") ??
            DEFAULT_SEGMENT_THRESHOLDS.minDaysSinceSignup
          ),
          inactiveDays: String(
            formData.get("inactiveDays") ??
            DEFAULT_SEGMENT_THRESHOLDS.inactiveDays
          ),
          nearZeroBalance: String(
            formData.get("nearZeroBalance") ??
            DEFAULT_SEGMENT_THRESHOLDS.nearZeroBalance
          ),
        })
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="minDaysSinceSignup">Min days since signup</Label>
        <Input
          id="minDaysSinceSignup"
          name="minDaysSinceSignup"
          type="number"
          min={0}
          defaultValue={options.minDaysSinceSignup}
        />
        <p className="text-xs text-muted-foreground">
          Default 7 (API uses 10 for KYC, no deposit if omitted).
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="inactiveDays">Inactive days</Label>
        <Input
          id="inactiveDays"
          name="inactiveDays"
          type="number"
          min={0}
          defaultValue={options.inactiveDays}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nearZeroBalance">Near-zero balance (₦)</Label>
        <Input
          id="nearZeroBalance"
          name="nearZeroBalance"
          type="number"
          min={0}
          defaultValue={options.nearZeroBalance}
        />
      </div>
      <div className="flex items-center">
        <Button type="submit" variant="secondary" className="w-full sm:w-auto">
          Apply thresholds
        </Button>
      </div>
    </form>
  )
}
