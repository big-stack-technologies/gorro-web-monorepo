import { ClusterDetailPage } from "@/features/clusters"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <ClusterDetailPage clusterId={id} />
}
