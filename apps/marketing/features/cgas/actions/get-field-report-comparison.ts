"use server"

import { get } from "@gorro/api/client"

import { formatDateParam } from "@/features/analytics/actions/build-params"
import type {
  FieldReportComparison,
  FieldReportComparisonFilters,
  FieldReportComparisonRow,
} from "@/features/cgas/types"
import { endpoints } from "@/lib/endpoints"

function readNumber(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function readRow(value: unknown): FieldReportComparisonRow | null {
  if (!value || typeof value !== "object") return null
  const row = value as Record<string, unknown>
  const userId = typeof row.userId === "string" ? row.userId : ""
  const name = typeof row.name === "string" ? row.name : ""
  if (!userId && !name) return null
  return {
    userId,
    name,
    reportedRegistrations: readNumber(row.reportedRegistrations),
    actualSignups: readNumber(row.actualSignups),
    variance: readNumber(row.variance),
    reportedKyc: readNumber(row.reportedKyc),
    actualKyc: readNumber(row.actualKyc),
    kycVariance: readNumber(row.kycVariance),
    reportedFirstDeposits: readNumber(row.reportedFirstDeposits),
    actualFirstDeposits: readNumber(row.actualFirstDeposits),
    firstDepositVariance: readNumber(row.firstDepositVariance),
    reportedDepositValue: readNumber(row.reportedDepositValue),
    actualDepositValue: readNumber(row.actualDepositValue),
    depositValueVariance: readNumber(row.depositValueVariance),
    daysReported: readNumber(row.daysReported),
    reportingCompliancePct: readNumber(row.reportingCompliancePct),
  }
}

function readRows(data: unknown): FieldReportComparisonRow[] {
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object"
      ? ((data as { cgas?: unknown; data?: unknown; rows?: unknown }).cgas ??
        (data as { data?: unknown }).data ??
        (data as { rows?: unknown }).rows)
      : null
  if (!Array.isArray(list)) return []
  return list.flatMap((item) => {
    const row = readRow(item)
    return row ? [row] : []
  })
}

function readBound(data: unknown, key: "from" | "to") {
  if (!data || typeof data !== "object") return null
  const record = data as {
    from?: unknown
    to?: unknown
    period?: { from?: unknown; to?: unknown }
  }
  const direct = record[key]
  if (typeof direct === "string" && direct.trim()) return direct
  const period = record.period?.[key]
  return typeof period === "string" && period.trim() ? period : null
}

export async function getFieldReportComparisonAction(
  filters: FieldReportComparisonFilters
): Promise<FieldReportComparison> {
  try {
    const params: Record<string, string> = {}
    if (filters.from) params.from = formatDateParam(filters.from)
    if (filters.to) params.to = formatDateParam(filters.to)

    const { data } = await get<unknown>(
      endpoints.marketing.fieldReportsComparison,
      { params }
    )
    return {
      from: readBound(data, "from"),
      to: readBound(data, "to"),
      rows: readRows(data),
    }
  } catch (error) {
    console.error("Failed to load field report comparison:", error)
    throw error
  }
}
