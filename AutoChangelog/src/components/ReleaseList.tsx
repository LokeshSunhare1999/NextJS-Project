'use client'

import { useEffect, useState } from 'react'

interface Release {
  id: string
  version: string
  title: string
  description: string | null
  isPublished: boolean
  publishedAt: string | null
  createdAt: string
}

export default function ReleaseList({ repositoryId }: { repositoryId: string }) {
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReleases()
  }, [repositoryId])

  const fetchReleases = async () => {
    try {
      const response = await fetch(`/api/releases?repositoryId=${repositoryId}`)
      if (response.ok) {
        const data = await response.json()
        setReleases(data)
      }
    } catch (error) {
      console.error('Failed to fetch releases:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (releases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No releases yet</p>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
          Create First Release
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {releases.map((release) => (
        <div key={release.id} className="border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{release.version}</h3>
              <p className="text-gray-600">{release.title}</p>
            </div>
            <span className={`px-3 py-1 rounded text-sm ${
              release.isPublished 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {release.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
          
          {release.description && (
            <p className="text-gray-700 mb-4">{release.description}</p>
          )}
          
          <div className="text-sm text-gray-600">
            {release.isPublished && release.publishedAt
              ? `Published on ${new Date(release.publishedAt).toLocaleDateString()}`
              : `Created on ${new Date(release.createdAt).toLocaleDateString()}`
            }
          </div>
        </div>
      ))}
    </div>
  )
}
