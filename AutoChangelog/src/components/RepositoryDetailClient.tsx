'use client'

import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import Navbar from './Navbar'
import CommitList from './CommitList'
import ReleaseList from './ReleaseList'

interface RepositoryDetailClientProps {
  repositoryId: string
}

export default function RepositoryDetailClient({ repositoryId }: RepositoryDetailClientProps) {
  const { data: session } = useSession()
  const [repository, setRepository] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'commits' | 'releases'>('commits')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRepository()
  }, [repositoryId])

  const fetchRepository = async () => {
    try {
      const response = await fetch(`/api/repositories/${repositoryId}`)
      if (response.ok) {
        const data = await response.json()
        setRepository(data)
      }
    } catch (error) {
      console.error('Failed to fetch repository:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!repository) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Repository not found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={session?.user} 
        onSignOut={() => signOut({ callbackUrl: '/' })}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{repository.name}</h1>
          <p className="text-gray-600 mt-1">{repository.fullName}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('commits')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'commits'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Commits
              </button>
              <button
                onClick={() => setActiveTab('releases')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'releases'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Releases
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'commits' && <CommitList repositoryId={repositoryId} />}
            {activeTab === 'releases' && <ReleaseList repositoryId={repositoryId} />}
          </div>
        </div>
      </main>
    </div>
  )
}
