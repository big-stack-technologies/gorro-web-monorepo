/** All NIN verification / review statuses returned by the API. */
export type NinReviewStatus =
  | "PENDING"
  | "PENDING_REVIEW"
  | "VERIFIED"
  | "FAILED"
  | "APPROVED_AUTO"
  | "APPROVED_MANUAL"
  | "REJECTED_MANUAL"

export type NinReviewUser = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  kycTier: number
}

/**
 * Name/dob/gender cross-check of the NIN registry against the Tier-1 BVN record.
 * Semantic checks, not a per-field map: `nameMatch` and `surnameMatched` cover
 * the given/middle/surname group collectively, and there is no phone check.
 */
export type NinReviewAutoMatch = {
  /** Whether the full name matched (token sets, order-insensitive, 1-typo tolerance). */
  nameMatch: boolean
  /** Lowercased name tokens present in both sources. Explains a partial nameMatch. */
  matchedTokens: string[]
  surnameMatched: boolean
  /** Tri-state: `null` means no data to compare, NOT a failure. */
  dobMatch: boolean | null
  /** Tri-state: `null` means no data to compare, NOT a failure. */
  genderMatch: boolean | null
  /** Overall verdict; a strong match would have auto-approved to Tier 2. */
  strong: boolean
  /** Full token set from the NIN registry. Absent on older records. */
  ninTokens?: string[]
  /** Full token set from the Tier-1 BVN record. Absent on older records. */
  bvnTokens?: string[]
}

/** Row from GET /admin/kyc/nin-reviews. No `status` field. */
export type NinReview = {
  id: string
  /** `null` on orphaned records — render as an unknown user rather than crashing. */
  user: NinReviewUser | null
  nin: string
  submittedAt: string
  waitingHours: number
  autoMatch: NinReviewAutoMatch | null
  hasRegistryData: boolean
  vendorError: string | null
  reviewedBy: string | null
  reviewedAt: string | null
  reviewNote: string | null
}

/** Raw list envelope: flat, no `meta`. Adapted before reaching DataTable. */
export type NinReviewListApiResponse = {
  page: number
  limit: number
  total: number
  data: NinReview[]
}

export type NinReviewProfile = {
  userId: string
  firstName: string | null
  middleName: string | null
  lastName: string | null
  /** Full ISO timestamp (e.g. "1983-11-23T23:00:00.000Z") — render as a UTC date. */
  dob: string | null
  gender: string | null
  phone: string | null
  email: string | null
  kycTier: number
  passportPhotoUrl: string | null
}

/**
 * Identity fields shared by all three compare columns. `dob` may be a full ISO
 * timestamp or a plain `YYYY-MM-DD`, and `gender` is not normalised across
 * sources ("female" vs "f") — display as-is and compare on the first letter.
 */
export type NinReviewIdentityRecord = {
  firstName: string | null
  middleName: string | null
  lastName: string | null
  dob: string | null
  gender: string | null
  phone: string | null
}

/** Tier-1 BVN record. */
export type NinReviewBvnRecord = NinReviewIdentityRecord & {
  verifiedAt?: string | null
}

/** NIN registry record. */
export type NinReviewRegistryRecord = NinReviewIdentityRecord & {
  /** Raw Base64 JPEG, rendered via a `data:image/jpeg;base64,` URL. */
  photoBase64?: string | null
}

export type NinReviewDecision = {
  reviewedBy: string | null
  reviewedAt: string | null
  reviewNote: string | null
}

/** GET /admin/kyc/nin-reviews/:id — no `waitingHours`, no `hasRegistryData`, no `user`. */
export type NinReviewDetail = {
  id: string
  status: NinReviewStatus
  nin: string
  submittedAt: string
  autoMatch: NinReviewAutoMatch | null
  vendorError: string | null
  profile: NinReviewProfile
  bvnRecord: NinReviewBvnRecord | null
  ninRegistry: NinReviewRegistryRecord | null
  review: NinReviewDecision
}

/** POST .../approve and POST .../reject both return this. */
export type NinReviewDecisionResponse = {
  message: string
  status: string
}

export type RejectNinReviewPayload = {
  reason: string
}
