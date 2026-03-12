import { Queue, Worker } from 'bullmq'
import { prisma } from '@/lib/prisma'
import { GitHubService } from '@/lib/github'
import { classifyCommit } from '@/lib/commit-classifier'

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
}

export const commitQueue = new Queue('commit-fetcher', { connection })

export const commitWorker = new Worker(
  'commit-fetcher',
  async (job) => {
    const { repositoryId } = job.data

    const repository = await prisma.repository.findUnique({
      where: { id: repositoryId },
    })

    if (!repository) return

    const github = new GitHubService(repository.accessToken)
    const commits = await github.getCommits(repository.owner, repository.name)

    for (const commit of commits) {
      await prisma.commit.upsert({
        where: {
          repositoryId_sha: {
            repositoryId: repository.id,
            sha: commit.sha,
          },
        },
        update: {},
        create: {
          repositoryId: repository.id,
          sha: commit.sha,
          message: commit.commit.message,
          author: commit.commit.author.name,
          authorEmail: commit.commit.author.email,
          date: new Date(commit.commit.author.date),
          category: classifyCommit(commit.commit.message),
        },
      })
    }
  },
  { connection }
)
