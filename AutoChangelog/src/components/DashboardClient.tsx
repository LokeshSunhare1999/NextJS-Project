'use client'

import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { Session } from 'next-auth'
import Navbar from './Navbar'
import RepositoryList from './RepositoryList'
import ConnectRepositoryModal from './ConnectRepositoryModal'

interface DashboardClientProps {
  session: Session
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRepositoryConnected = () => {
    setShowConnectModal(false)
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={session.user} 
        onSignOut={() => signOut({ callbackUrl: '/' })}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Repositories</h1>
            <p className="text-gray-600 mt-1">Manage your connected repositories and changelogs</p>
          </div>
          <button
            onClick={() => setShowConnectModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            + Connect Repository
          </button>
        </div>

        <RepositoryList key={refreshKey} />
      </main>

      {showConnectModal && (
        <ConnectRepositoryModal
          onClose={() => setShowConnectModal(false)}
          onConnected={handleRepositoryConnected}
        />
      )}
    </div>
  )
}
