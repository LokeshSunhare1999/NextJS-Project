import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GitHubService } from '@/lib/github'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accessToken = (session as any).accessToken

  if (!accessToken) {
    return NextResponse.json({ error: 'No GitHub token found. Please sign out and sign in again.' }, { status: 400 })
  }

  try {
    const github = new GitHubService(accessToken)
    const repositories = await github.getRepositories()
    return NextResponse.json(repositories)
  } catch (error) {
    console.error('Failed to fetch GitHub repositories:', error)
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}
