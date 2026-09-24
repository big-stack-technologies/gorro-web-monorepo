export type ReferralPair = {
  referrerId: string
  referrerName: string
  referrerEmail: string
  referrerReferralCode: string
  refereeId: string
  refereeName: string
  refereeEmail: string | null
  refereeReferralCode: string
  refereeJoinedAt: string
  bonusPaid: boolean
  bonusAmount: number
  createdAt: string
}

export type TopReferrer = {
  userId?: string
  name?: string
  email?: string
  referralCount?: number
  totalBonusesPaid?: number
  totalBonusesEarned?: number
}

export type ReferralStats = {
  totalReferralPairs: number
  totalBonusesPaid: number
  totalBonusesPending: number
  totalReferrers: number
  averageReferralsPerUser: number
  topReferrers: TopReferrer[]
}

export type ReferralUser = {
  id: string
  email: string | null
  phoneNumber: string | null
  firstName: string
  lastName: string
  referralCode: string
  refereeCode: string | null
  createdAt: string
}

export type UserReferralSummary = {
  totalReferrals: number
  totalBonusesEarned: number
  totalBonusesPaid: number
  pendingBonuses: number
}

export type UserReferralDetails = {
  user: ReferralUser
  referredBy: ReferralPair | null
  referrals: ReferralPair[]
  summary: UserReferralSummary
}
