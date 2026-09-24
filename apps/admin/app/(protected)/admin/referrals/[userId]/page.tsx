import { ReferralDetailPage } from "@/features/referrals/ui"

type PageProps = {
  params: Promise<{ userId: string }>
}

export default async function Page({ params }: PageProps) {
  const { userId } = await params
  return <ReferralDetailPage userId={userId} />
}
