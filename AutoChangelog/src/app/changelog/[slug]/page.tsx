import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function PublicChangelog({
  params,
}: {
  params: { slug: string }
}) {
  const repository = await prisma.repository.findFirst({
    where: { fullName: params.slug },
    include: {
      releases: {
        where: { isPublished: true },
        include: { commits: true },
        orderBy: { publishedAt: 'desc' },
      },
    },
  })

  if (!repository) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">{repository.name} Changelog</h1>
      {repository.releases.map((release) => (
        <div key={release.id} className="mb-8">
          <h2 className="text-2xl font-semibold">{release.version}</h2>
          <p className="text-gray-600 mb-4">
            {release.publishedAt?.toLocaleDateString()}
          </p>
          {release.description && <p className="mb-4">{release.description}</p>}
        </div>
      ))}
    </div>
  )
}
