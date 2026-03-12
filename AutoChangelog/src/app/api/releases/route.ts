import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const repositoryId = searchParams.get('repositoryId')

  if (!repositoryId) {
    return NextResponse.json({ error: 'Repository ID required' }, { status: 400 })
  }

  const releases = await prisma.release.findMany({
    where: { repositoryId },
    include: { commits: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(releases)
}
