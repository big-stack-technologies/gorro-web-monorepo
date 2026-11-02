import { CircleDetailPage } from "@/features/circles"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <CircleDetailPage circleId={id} />
}
