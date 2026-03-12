'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Repository {
  id: string
  name: string
  fullName: string
  owner: string
  isPrivate: boolean
  _count: {
    releases: number
  }
}

export default function RepositoryList() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRepositories()
  }, [])

  const fetchRepositories = async () => {
    try {
      const response = await fetch('/api/repositories')
      if (response.ok) {
        const data = await response.json()
        setRepositories(data)
      }
    } catch (error) {
      console.error('Failed to fetch repositories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (repositories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No repositories connected</h3>
        <p className="text-gray-600">Connect your first repository to start generating changelogs</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repositories.map((repo) => (
        <div key={repo.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{repo.name}</h3>
              <p className="text-sm text-gray-600">{repo.fullName}</p>
            </div>
            {repo.isPrivate && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">Private</span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{repo._count.releases} releases</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/dashboard/repository/${repo.id}`}
              className="flex-1 text-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
            >
              View Details
            </Link>
            <Link
              href={`/changelog/${repo.fullName}`}
              target="_blank"
              className="flex-1 text-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              Public Page
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
