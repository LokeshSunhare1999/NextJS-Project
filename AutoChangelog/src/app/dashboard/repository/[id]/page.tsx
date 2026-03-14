import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import RepositoryDetailClient from '@/components/RepositoryDetailClient'

export default async function RepositoryDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/signin')
  }

  return <RepositoryDetailClient repositoryId={params.id} />
}
