'use client'

import { useState, useEffect } from 'react'

interface ConnectRepositoryModalProps {
  onClose: () => void
  onConnected: () => void
}

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  private: boolean
  owner: {
    login: string
  }
  default_branch: string
}

export default function ConnectRepositoryModal({ onClose, onConnected }: ConnectRepositoryModalProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)

  useEffect(() => {
    fetchGitHubRepos()
  }, [])

  const fetchGitHubRepos = async () => {
    try {
      const response = await fetch('/api/github/repositories')
      if (response.ok) {
        const data = await response.json()
        setRepos(data)
      }
    } catch (error) {
      console.error('Failed to fetch GitHub repos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    if (!selectedRepo) return

    setConnecting(true)
    try {
      const response = await fetch('/api/repositories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubId: selectedRepo.id,
          name: selectedRepo.name,
          fullName: selectedRepo.full_name,
          owner: selectedRepo.owner.login,
          isPrivate: selectedRepo.private,
          defaultBranch: selectedRepo.default_branch,
        }),
      })

      if (response.ok) {
        onConnected()
      }
    } catch (error) {
      console.error('Failed to connect repository:', error)
    } finally {
      setConnecting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Connect Repository</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  onClick={() => setSelectedRepo(repo)}
                  className={`p-4 border rounded-lg cursor-pointer transition ${
                    selectedRepo?.id === repo.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{repo.name}</h3>
                      <p className="text-sm text-gray-600">{repo.full_name}</p>
                    </div>
                    {repo.private && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        Private
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConnect}
            disabled={!selectedRepo || connecting}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {connecting ? 'Connecting...' : 'Connect Repository'}
          </button>
        </div>
      </div>
    </div>
  )
}
