export const endpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
  },
  admin: {
    users: "/admin/users",
    userById: (id: string) => `/admin/users/${encodeURIComponent(id)}`,
    userRoleById: (id: string) => `/admin/users/${encodeURIComponent(id)}/role`,
    userFreezeById: (id: string) =>
      `/admin/users/${encodeURIComponent(id)}/freeze`,
    userResetPinById: (id: string) =>
      `/admin/users/${encodeURIComponent(id)}/reset-pin`,
    userWithdrawalsDisableById: (id: string) =>
      `/admin/users/${encodeURIComponent(id)}/withdrawals/disable`,
    userWithdrawalsEnableById: (id: string) =>
      `/admin/users/${encodeURIComponent(id)}/withdrawals/enable`,
    userVirtualAccountById: (id: string) =>
      `/admin/users/${encodeURIComponent(id)}/virtual-account`,
    withdrawalRequests: "/admin/users/withdrawal-requests",
    withdrawalRequestById: (id: string) =>
      `/admin/users/withdrawal-requests/${encodeURIComponent(id)}`,
    withdrawalRequestApproveById: (id: string) =>
      `/admin/users/withdrawal-requests/${encodeURIComponent(id)}/approve`,
    withdrawalRequestRejectById: (id: string) =>
      `/admin/users/withdrawal-requests/${encodeURIComponent(id)}/reject`,
    transactions: "/admin/transactions",
    transactionById: (id: string) =>
      `/admin/transactions/${encodeURIComponent(id)}`,
    transactionReverseById: (id: string) =>
      `/admin/transactions/${encodeURIComponent(id)}/reverse`,
    transactionApproveAmlById: (id: string) =>
      `/admin/transactions/${encodeURIComponent(id)}/approve-aml`,
    transactionRejectById: (id: string) =>
      `/admin/transactions/${encodeURIComponent(id)}/reject`,
    analyticsDashboard: "/admin/analytics/dashboard",
    usersGrowth: "/admin/analytics/users/growth",
    usersAnalyticsSummary: "/admin/analytics/users/summary",
    usersByTier: "/admin/analytics/users/by-tier",
    transactionsAnalyticsSummary: "/admin/analytics/transactions/summary",
    transactionsVolume: "/admin/analytics/transactions/volume",
    amlFlags: "/admin/analytics/aml-flags",
    referrals: "/admin/referrals",
    referralsStats: "/admin/referrals/stats",
    referralByUserId: (id: string) =>
      `/admin/referrals/${encodeURIComponent(id)}`,
    referralsRetrigger: "/admin/referrals/retrigger",
    savingsRates: "/admin/savings/rates",
    savingsRateByProduct: (productType: string) =>
      `/admin/savings/rates/${encodeURIComponent(productType)}`,
    savingsFixedRateBands: "/admin/savings/fixed-rate-bands",
    savingsFixedRateBandById: (id: string) =>
      `/admin/savings/fixed-rate-bands/${encodeURIComponent(id)}`,
    savingsWht: "/admin/savings/wht",
    savingsMetricsSummary: "/admin/savings/metrics/summary",
    savingsMetricsAccounts: "/admin/savings/metrics/accounts",
    featureFlags: "/admin/feature-flags",
    featureFlagByKey: (key: string) =>
      `/admin/feature-flags/${encodeURIComponent(key)}`,
    ajoConfig: "/admin/ajo/config",
    ajoGroups: "/admin/ajo/groups",
    ajoGroupById: (id: string) =>
      `/admin/ajo/groups/${encodeURIComponent(id)}`,
    ajoGroupClose: (id: string) =>
      `/admin/ajo/groups/${encodeURIComponent(id)}/close`,
    ajoGroupMemberRemove: (id: string, memberId: string) =>
      `/admin/ajo/groups/${encodeURIComponent(id)}/members/${encodeURIComponent(memberId)}/remove`,
    clusters: "/admin/clusters",
    clusterById: (id: string) => `/admin/clusters/${encodeURIComponent(id)}`,
    clusterMembersById: (id: string) =>
      `/admin/clusters/${encodeURIComponent(id)}/members`,
    clusterMemberByUserId: (id: string, userId: string) =>
      `/admin/clusters/${encodeURIComponent(id)}/members/${encodeURIComponent(userId)}`,
    clusterWithdrawals: "/admin/clusters/withdrawals",
    clusterWithdrawalsById: (id: string) =>
      `/admin/clusters/${encodeURIComponent(id)}/withdrawals`,
    clusterWithdrawalForceRejectById: (id: string, requestId: string) =>
      `/admin/clusters/${encodeURIComponent(id)}/withdrawals/${encodeURIComponent(requestId)}/force-reject`,
    clustersAnalyticsOverview: "/admin/clusters/analytics/overview",
    clustersAnalyticsTopByBalance: "/admin/clusters/analytics/top-by-balance",
    clustersAnalyticsTopByActivity: "/admin/clusters/analytics/top-by-activity",
    clustersAnalyticsWithdrawalVolume:
      "/admin/clusters/analytics/withdrawal-volume",
    reengagementConfig: "/admin/reengagement/config",
    reengagementRun: "/admin/reengagement/run",
    reengagementNudges: "/admin/reengagement/nudges",
    reengagementSegments: "/admin/reengagement/segments",
    reengagementSegmentUsers: (campaign: string) =>
      `/admin/reengagement/segments/${encodeURIComponent(campaign)}/users`,
    reengagementBroadcast: "/admin/reengagement/broadcast",
    reengagementEmail: "/admin/reengagement/email",
    reengagementAudiences: "/admin/reengagement/audiences",
    kycNinReviews: "/admin/kyc/nin-reviews",
    kycNinReviewById: (id: string) =>
      `/admin/kyc/nin-reviews/${encodeURIComponent(id)}`,
    kycNinReviewApproveById: (id: string) =>
      `/admin/kyc/nin-reviews/${encodeURIComponent(id)}/approve`,
    kycNinReviewRejectById: (id: string) =>
      `/admin/kyc/nin-reviews/${encodeURIComponent(id)}/reject`,
  },
  uploads: {
    file: "/uploads/file",
    presign: "/uploads/presign",
  },
  wallet: {
    mainByUserId: (userId: string) =>
      `/wallet/main/${encodeURIComponent(userId)}`,
  },
  accountProviders: {
    fincraBvnResolution: "/account-providers/fincra/resolution/bvn",
  },
} as const
