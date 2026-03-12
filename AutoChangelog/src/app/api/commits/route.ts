import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const repositoryId = searchParams.get('repositoryId')

  if (!repositoryId) {
    return NextResponse.json({ error: 'Repository ID required' }, { status: 400 })
  }

  const commits = await prisma.commit.findMany({
    where: { repositoryId },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(commits)
}
