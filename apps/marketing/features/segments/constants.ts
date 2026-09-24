import type { SegmentThresholdOptions } from "@/features/segments/types"

export const DEFAULT_SEGMENT_THRESHOLDS: SegmentThresholdOptions = {
  minDaysSinceSignup: "7",
  inactiveDays: "30",
  nearZeroBalance: "100",
}

export const SEGMENT_THRESHOLD_PARAM_KEYS = [
  "minDaysSinceSignup",
  "inactiveDays",
  "nearZeroBalance",
] as const
