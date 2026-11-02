const percentFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
})

const rateFormat = new Intl.NumberFormat(undefined, {
  style: "percent",
  maximumFractionDigits: 1,
})

/** `percentSaved` is already a percentage and may exceed 100 — show it as-is. */
export function formatPercentSaved(percent: number): string {
  return `${percentFormat.format(percent)}%`
}

/** `joinToFundRate` is a fraction: 0.1176 renders as 11.8%. */
export function formatRate(fraction: number): string {
  return rateFormat.format(fraction)
}
