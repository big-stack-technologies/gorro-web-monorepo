import { TransactionDetailPage } from "@/features/transactions/ui/transaction-detail.page"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <TransactionDetailPage transactionId={id} />
}
