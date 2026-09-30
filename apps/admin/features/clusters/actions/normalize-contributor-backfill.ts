import type {
  ContributorBackfillFailure,
  ContributorBackfillPlanItem,
  ContributorBackfillResult,
  ContributorBackfillUnparseable,
} from "@/features/clusters/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function readString(
  record: Record<string, unknown>,
  keys: string[]
): string | null {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === "string" && value.trim()) return value
  }
  return null
}

function readNumber(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === "number" && Number.isFinite(value)) return value
  }
  return 0
}

function clusterFields(record: Record<string, unknown>) {
  const cluster = record.cluster
  const clusterId = isRecord(cluster)
    ? readString(cluster, ["id", "clusterId"])
    : readString(record, ["clusterId"])
  const clusterName = isRecord(cluster)
    ? readString(cluster, ["name", "code"])
    : readString(record, ["clusterName", "cluster"])
  return { clusterId, clusterName }
}

function asPlanItem(value: unknown): ContributorBackfillPlanItem | null {
  if (!isRecord(value)) return null
  const cluster = clusterFields(value)
  return {
    clusterId: cluster.clusterId,
    clusterName: cluster.clusterName,
    phoneNumber: readString(value, ["phoneNumber", "phone"]),
    name: readString(value, ["name"]),
    outcome: readString(value, ["outcome", "action", "operation"]),
    virtualAccountCount: readNumber(value, [
      "virtualAccountCount",
      "virtualAccounts",
      "accountCount",
    ]),
  }
}

function asUnparseable(value: unknown): ContributorBackfillUnparseable | null {
  if (typeof value === "string") {
    return {
      clusterId: null,
      clusterName: null,
      phoneNumber: null,
      name: null,
      raw: value,
    }
  }
  if (!isRecord(value)) return null
  const cluster = clusterFields(value)
  return {
    clusterId: cluster.clusterId,
    clusterName: cluster.clusterName,
    phoneNumber: readString(value, ["phoneNumber", "phone", "raw"]),
    name: readString(value, ["name"]),
    raw: readString(value, ["raw", "value", "phoneNumber", "phone"]),
  }
}

function asFailure(value: unknown): ContributorBackfillFailure | null {
  if (typeof value === "string") {
    return { clusterId: null, phoneNumber: null, message: value }
  }
  if (!isRecord(value)) return null
  return {
    clusterId: readString(value, ["clusterId"]),
    phoneNumber: readString(value, ["phoneNumber", "phone"]),
    message: readString(value, ["message", "error", "reason"]),
  }
}

export function normalizeContributorBackfill(
  data: unknown,
  dryRun: boolean
): ContributorBackfillResult {
  const record = isRecord(data) ? data : {}
  const plan = Array.isArray(record.plan)
    ? record.plan.flatMap((item) => {
        const row = asPlanItem(item)
        return row ? [row] : []
      })
    : []
  const unparseable = Array.isArray(record.unparseable)
    ? record.unparseable.flatMap((item) => {
        const row = asUnparseable(item)
        return row ? [row] : []
      })
    : []
  const failureSource = Array.isArray(record.failures)
    ? record.failures
    : Array.isArray(record.errors)
      ? record.errors
      : []

  return {
    dryRun: typeof record.dryRun === "boolean" ? record.dryRun : dryRun,
    virtualAccountsFound: readNumber(record, ["virtualAccountsFound"]),
    distinctContributors: readNumber(record, ["distinctContributors"]),
    toCreate: readNumber(record, ["toCreate", "created"]),
    toReuse: readNumber(record, ["toReuse", "reused"]),
    willLinkToExistingUsers: readNumber(record, [
      "willLinkToExistingUsers",
      "linkedToExistingUsers",
    ]),
    plan,
    unparseable,
    failures: failureSource.flatMap((item) => {
      const row = asFailure(item)
      return row ? [row] : []
    }),
  }
}
