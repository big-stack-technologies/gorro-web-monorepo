import { formatNgn, formatSnakeCaseWords, formatUtcDate } from "@gorro/ui/utils"

import type {
  FinanceDailyResponse,
  FinanceDailyRow,
} from "@/features/finance/types"

/** All finance amounts arrive in kobo. */
export function formatKobo(minorUnits: number) {
  return formatNgn(minorUnits / 100)
}

/** Short axis label, e.g. `₦13.5K`. */
export function formatKoboCompact(minorUnits: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(minorUnits / 100)
}

/** `from`/`to` are echoed back by the API as the exact range covered. */
export function formatFinanceRange(range: { from: string; to: string }) {
  return `${formatUtcDate(range.from)} – ${formatUtcDate(range.to)}`
}

export function formatFinanceLabel(value: string) {
  const words = formatSnakeCaseWords(value).toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function addUtcDays(date: string, days: number) {
  const next = new Date(`${date}T00:00:00Z`)
  next.setUTCDate(next.getUTCDate() + days)
  return next.toISOString().slice(0, 10)
}

/**
 * `days` only holds days with activity. Fill the gaps with zero activity,
 * carrying the running net forward, so the chart has one point per day.
 */
export function gapFillDailyRows(data: FinanceDailyResponse): FinanceDailyRow[] {
  const byDate = new Map(data.days.map((day) => [day.date, day]))
  const rows: FinanceDailyRow[] = []
  let cumulative = 0

  for (
    let date = data.from;
    date <= data.to && rows.length <= 366 * 5;
    date = addUtcDays(date, 1)
  ) {
    const day = byDate.get(date)
    if (day) {
      cumulative = day.cumulativeNetMinorUnits
      rows.push(day)
      continue
    }
    rows.push({
      date,
      feeRevenueMinorUnits: 0,
      productFeeRevenueMinorUnits: 0,
      totalRevenueMinorUnits: 0,
      processorCostMinorUnits: 0,
      interestPaidMinorUnits: 0,
      totalCostMinorUnits: 0,
      netMinorUnits: 0,
      cumulativeNetMinorUnits: cumulative,
    })
  }

  return rows
}
