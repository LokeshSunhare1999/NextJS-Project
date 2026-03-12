import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GitHubService } from '@/lib/github'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get access token from session
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'github',
      },
    })

    if (!account?.access_token) {
      return NextResponse.json({ error: 'No GitHub token found' }, { status: 400 })
    }

    const github = new GitHubService(account.access_token)
    const repositories = await github.getRepositories()

    return NextResponse.json(repositories)
  } catch (error) {
    console.error('Failed to fetch GitHub repositories:', error)
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}
