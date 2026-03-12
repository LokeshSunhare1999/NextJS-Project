import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { commitQueue } from '@/workers/commit-fetcher'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const repositories = await prisma.repository.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { releases: true } } },
  })

  return NextResponse.json(repositories)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { githubId, name, fullName, owner, isPrivate, defaultBranch } = body

    // Get GitHub access token
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'github',
      },
    })

    if (!account?.access_token) {
      return NextResponse.json({ error: 'No GitHub token found' }, { status: 400 })
    }

    // Create repository
    const repository = await prisma.repository.create({
      data: {
        userId: session.user.id,
        githubId,
        name,
        fullName,
        owner,
        isPrivate,
        defaultBranch: defaultBranch || 'main',
        accessToken: account.access_token,
      },
    })

    // Queue commit fetch job
    await commitQueue.add('fetch-commits', {
      repositoryId: repository.id,
    })

    return NextResponse.json(repository)
  } catch (error) {
    console.error('Failed to connect repository:', error)
    return NextResponse.json({ error: 'Failed to connect repository' }, { status: 500 })
  }
}
