import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const repository = await prisma.repository.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      _count: {
        select: {
          commits: true,
          releases: true,
        },
      },
    },
  })

  if (!repository) {
    return NextResponse.json({ error: 'Repository not found' }, { status: 404 })
  }

  return NextResponse.json(repository)
}
