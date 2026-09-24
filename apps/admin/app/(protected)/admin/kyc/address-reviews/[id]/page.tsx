import { AddressReviewDetailPage } from "@/features/kyc-reviews/ui"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <AddressReviewDetailPage reviewId={id} />
}
