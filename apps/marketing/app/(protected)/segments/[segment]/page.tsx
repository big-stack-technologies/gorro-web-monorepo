import { SegmentDetailPage } from "@/features/segments"

type PageProps = {
  params: Promise<{ segment: string }>
}

export default async function Page({ params }: PageProps) {
  const { segment } = await params
  return <SegmentDetailPage segmentKey={segment} />
}
