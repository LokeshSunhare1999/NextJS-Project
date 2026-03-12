'use client'

import { useEffect, useState } from 'react'

interface Commit {
  id: string
  sha: string
  message: string
  author: string
  date: string
  category: string | null
}

export default function CommitList({ repositoryId }: { repositoryId: string }) {
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCommits()
  }, [repositoryId])

  const fetchCommits = async () => {
    try {
      const response = await fetch(`/api/commits?repositoryId=${repositoryId}`)
      if (response.ok) {
        const data = await response.json()
        setCommits(data)
      }
    } catch (error) {
      console.error('Failed to fetch commits:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryBadge = (category: string | null) => {
    const styles: Record<string, string> = {
      FEATURE: 'bg-green-100 text-green-800',
      FIX: 'bg-red-100 text-red-800',
      PERFORMANCE: 'bg-blue-100 text-blue-800',
      DOCS: 'bg-yellow-100 text-yellow-800',
      REFACTOR: 'bg-purple-100 text-purple-800',
      CHORE: 'bg-gray-100 text-gray-800',
    }

    if (!category) return null

    return (
      <span className={`text-xs px-2 py-1 rounded ${styles[category] || 'bg-gray-100 text-gray-800'}`}>
        {category.toLowerCase()}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (commits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No commits found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {commits.map((commit) => (
        <div key={commit.id} className="border-l-4 border-indigo-600 pl-4 py-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{commit.message}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                <span>{commit.author}</span>
                <span>•</span>
                <span>{new Date(commit.date).toLocaleDateString()}</span>
                <span>•</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{commit.sha.substring(0, 7)}</code>
              </div>
            </div>
            {getCategoryBadge(commit.category)}
          </div>
        </div>
      ))}
    </div>
  )
}
