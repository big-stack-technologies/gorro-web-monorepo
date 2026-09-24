/** Standard envelope for admin analytics JSON responses. */
export type AnalyticsApiEnvelope<TData> = {
  success: boolean
  data: TData
  message: string
  timestamp: string
}
