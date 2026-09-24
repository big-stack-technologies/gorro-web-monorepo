import type { ReactNode } from "react"
import {
  CheckCircle2Icon,
  CircleAlertIcon,
  CircleHelpIcon,
  XCircleIcon,
} from "lucide-react"

import { CopyableTruncatedId } from "@gorro/ui/components/copyable-truncated-id"
import { Badge } from "@gorro/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import {
  NIN_REVIEW_COMPARE_FIELDS,
  type NinReviewCompareFieldKey,
} from "@/features/kyc-reviews/constants"
import type {
  NinReviewBvnRecord,
  NinReviewIdentityRecord,
  NinReviewProfile,
  NinReviewRegistryRecord,
} from "@/features/kyc-reviews/types"
import {
  getRegistryPhotoSrc,
  NinReviewPhoto,
} from "@/features/kyc-reviews/ui/nin-review-photo"
import { emptyAsNa, formatDateTime, formatUtcDate } from "@gorro/ui/utils"

type NinReviewCompareProps = {
  profile: NinReviewProfile
  bvnRecord: NinReviewBvnRecord | null
  ninRegistry: NinReviewRegistryRecord | null
  vendorError: string | null
}

type CompareSource = NinReviewIdentityRecord | null

const MISSING_VALUE = "—"

/**
 * Sources disagree on formatting: `dob` arrives as a full ISO timestamp or a
 * plain date, and `gender` as "female" or "f". Display keeps the source wording.
 */
function formatCompareValue(
  key: NinReviewCompareFieldKey,
  value: string | null | undefined
): string {
  if (value == null || String(value).trim() === "") return MISSING_VALUE
  if (key === "dob") return formatUtcDate(value)
  return value.trim()
}

/**
 * Comparison key for the row-level agreement indicator. Gender compares on the
 * first letter only, matching the backend matcher, so "female" and "f" agree.
 */
function getComparisonKey(
  key: NinReviewCompareFieldKey,
  displayValue: string
): string {
  if (displayValue === MISSING_VALUE) return MISSING_VALUE
  const normalized = displayValue.trim().toLowerCase()
  if (key === "gender") return normalized.charAt(0)
  return normalized
}

function getFieldValue(
  source: CompareSource,
  key: NinReviewCompareFieldKey
): string | null | undefined {
  if (!source) return null
  return source[key]
}

function getAgreementState(comparisonKeys: string[]) {
  const comparable = comparisonKeys.filter((v) => v !== MISSING_VALUE)
  if (comparable.length <= 1) return "insufficient" as const
  const first = comparable[0]
  return comparable.every((v) => v === first)
    ? ("agree" as const)
    : ("disagree" as const)
}

function AgreementIcon({
  state,
}: {
  state: "agree" | "disagree" | "insufficient"
}) {
  if (state === "agree") {
    return <CheckCircle2Icon className="size-4 shrink-0 text-success" />
  }
  if (state === "disagree") {
    return <XCircleIcon className="size-4 shrink-0 text-destructive" />
  }
  return <CircleHelpIcon className="size-4 shrink-0 text-muted-foreground" />
}

function CompareColumn({
  title,
  source,
  emptyNote,
  photo,
  footer,
}: {
  title: string
  source: CompareSource
  emptyNote: string
  photo?: ReactNode
  footer?: ReactNode
}) {
  if (!source) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-48 flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-muted/20 px-4 text-center text-sm text-muted-foreground">
            <span className="font-medium">Not available</span>
            <span className="text-xs">{emptyNote}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {photo}
        <dl className="space-y-3">
          {NIN_REVIEW_COMPARE_FIELDS.map(({ key, label }) => (
            <div
              key={key}
              className="grid grid-cols-[minmax(0,7rem)_1fr] gap-x-3 text-sm"
            >
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="min-w-0 font-medium wrap-break-word">
                {formatCompareValue(key, getFieldValue(source, key))}
              </dd>
            </div>
          ))}
        </dl>
        {footer}
      </CardContent>
    </Card>
  )
}

export function NinReviewCompare({
  profile,
  bvnRecord,
  ninRegistry,
  vendorError,
}: NinReviewCompareProps) {
  const sources = [profile, bvnRecord, ninRegistry]

  return (
    <div className="space-y-4">
      {vendorError ? (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">Vendor error</p>
            <p className="mt-1 text-destructive/90">{vendorError}</p>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-[minmax(0,8rem)_repeat(3,minmax(0,1fr))] gap-3 border-b bg-muted/30 px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <div>Field</div>
          <div>Our profile</div>
          <div>BVN record</div>
          <div>NIN registry</div>
        </div>
        {NIN_REVIEW_COMPARE_FIELDS.map(({ key, label }) => {
          const values = sources.map((source) =>
            formatCompareValue(key, getFieldValue(source, key))
          )
          const agreement = getAgreementState(
            values.map((value) => getComparisonKey(key, value))
          )

          return (
            <div
              key={key}
              className="grid grid-cols-[minmax(0,8rem)_repeat(3,minmax(0,1fr))] gap-3 border-b px-4 py-3 text-sm last:border-b-0"
            >
              <div className="flex items-start gap-2 font-medium">
                <AgreementIcon state={agreement} />
                <span>{label}</span>
              </div>
              {values.map((value, index) => (
                <div
                  key={`${key}-${index}`}
                  className="min-w-0 wrap-break-word text-muted-foreground"
                >
                  {value}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <CompareColumn
          title="Our profile"
          source={profile}
          emptyNote="No profile on record."
          photo={
            <NinReviewPhoto
              src={profile.passportPhotoUrl}
              alt="User passport photo"
            />
          }
        />
        <CompareColumn
          title="BVN record (Tier 1)"
          source={bvnRecord}
          emptyNote="No Tier-1 BVN record held for this user."
          footer={
            bvnRecord?.verifiedAt ? (
              <p className="text-xs text-muted-foreground">
                BVN verified {formatDateTime(bvnRecord.verifiedAt)}
              </p>
            ) : null
          }
        />
        <CompareColumn
          title="NIN registry"
          source={ninRegistry}
          emptyNote={
            vendorError
              ? "The registry lookup failed — see the vendor error above."
              : "No registry data returned for this NIN."
          }
          photo={
            <NinReviewPhoto
              src={getRegistryPhotoSrc(ninRegistry?.photoBase64)}
              alt="NIN registry photo"
            />
          }
        />
      </div>
    </div>
  )
}

export function NinReviewSummaryStrip({
  nin,
  submittedAt,
  waitingHours,
  profile,
  statusBadge,
  slaBadge,
}: {
  nin: string
  submittedAt: string
  waitingHours: number
  profile: NinReviewProfile
  statusBadge: ReactNode
  slaBadge: ReactNode
}) {
  return (
    <div className="space-y-2 rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        {statusBadge}
        {slaBadge}
        <Badge variant="outline">Tier {profile.kycTier}</Badge>
        <span className="text-muted-foreground">
          NIN <span className="font-mono text-foreground">{nin}</span>
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="min-w-0 truncate">
          {emptyAsNa(profile.email)}
        </span>
        <span className="flex items-center gap-1">
          User
          <CopyableTruncatedId value={profile.userId} />
        </span>
        <span>Submitted {formatDateTime(submittedAt)}</span>
        <span>Waiting {waitingHours}h</span>
      </div>
    </div>
  )
}
