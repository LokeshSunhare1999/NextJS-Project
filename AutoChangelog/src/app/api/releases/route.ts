import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const repositoryId = searchParams.get('repositoryId')

  if (!repositoryId) {
    return NextResponse.json({ error: 'Repository ID required' }, { status: 400 })
  }

  // Verify user owns this repository
  const repository = await prisma.repository.findFirst({
    where: { id: repositoryId, userId: session.user.id },
  })

  if (!repository) {
    return NextResponse.json({ error: 'Repository not found' }, { status: 404 })
  }

  const releases = await prisma.release.findMany({
    where: { repositoryId },
    include: { commits: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(releases)
}
