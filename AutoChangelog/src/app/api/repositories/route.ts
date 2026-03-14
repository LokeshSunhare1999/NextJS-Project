import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const repositories = await prisma.repository.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { releases: true } } },
    orderBy: { createdAt: 'desc' },
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

    const accessToken = (session as any).accessToken

    if (!accessToken) {
      return NextResponse.json({ error: 'No GitHub token found. Please sign out and sign in again.' }, { status: 400 })
    }

    // Check if already connected
    const existing = await prisma.repository.findFirst({
      where: { githubId, userId: session.user.id },
    })

    if (existing) {
      return NextResponse.json({ error: 'Repository already connected' }, { status: 409 })
    }

    const repository = await prisma.repository.create({
      data: {
        userId: session.user.id,
        githubId,
        name,
        fullName,
        owner,
        isPrivate,
        defaultBranch: defaultBranch || 'main',
        accessToken,
      },
    })

    return NextResponse.json(repository)
  } catch (error) {
    console.error('Failed to connect repository:', error)
    return NextResponse.json({ error: 'Failed to connect repository' }, { status: 500 })
  }
}
