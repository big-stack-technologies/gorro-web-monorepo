import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Returns `"N/A"` for null, undefined, or blank/whitespace-only strings. */
export function emptyAsNa(value: string | null | undefined): string {
  if (value == null || String(value).trim() === "") {
    return "N/A"
  }
  return String(value)
}

export function formatDateTime(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

/** Formats an ISO date in UTC so calendar dates are not shifted by local timezone. */
export function formatUtcDate(iso: string | null | undefined) {
  if (iso == null || String(iso).trim() === "") return "—"
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeZone: "UTC",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

/** Joins non-empty parts with spaces; returns an em dash if none. */
export function joinPartsOrEmDash(parts: (string | null | undefined)[]) {
  const joined = parts.filter(Boolean).join(" ")
  return joined.length > 0 ? joined : "—"
}

/** Turns `snake_case` into space-separated words for display. */
export function formatSnakeCaseWords(value: string) {
  return value.replace(/_/g, " ")
}

export function formatNgn(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(value)
}

/**
 * Formats a numeric amount with {@link Intl} currency style. Pass the value in the
 * same unit the API uses for display (e.g. if the field is already in major units,
 * do not divide by 100 here).
 */
export function formatCurrencyAmount(value: number, currency: string = "NGN") {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(value)
  } catch {
    return `${value} ${currency}`
  }
}

/**
 * Format integer minor units (e.g. kobo/cents) as currency for display.
 */
export function formatCurrencyFromMinorUnits(
  minorUnits: number,
  currency: string = "NGN"
) {
  return formatCurrencyAmount(minorUnits / 100, currency)
}
