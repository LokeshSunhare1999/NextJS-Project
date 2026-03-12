'use client'

interface NavbarProps {
  user: any
  onSignOut: () => void
}

export default function Navbar({ user, onSignOut }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold text-indigo-600">AutoChangelog</span>
            <div className="hidden md:flex gap-6">
              <a href="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium">
                Dashboard
              </a>
              <a href="/dashboard/releases" className="text-gray-700 hover:text-indigo-600 font-medium">
                Releases
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user?.image && (
                <img 
                  src={user.image} 
                  alt={user.name || 'User'} 
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
            <button
              onClick={onSignOut}
              className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
