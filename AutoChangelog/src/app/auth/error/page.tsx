'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, { title: string; description: string; solution: string }> = {
    Configuration: {
      title: 'Configuration Error',
      description: 'There is a problem with the server configuration.',
      solution: 'Check your environment variables (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, NEXTAUTH_SECRET)',
    },
    AccessDenied: {
      title: 'Access Denied',
      description: 'You do not have permission to sign in.',
      solution: 'Make sure you have authorized the application on GitHub.',
    },
    Verification: {
      title: 'Verification Error',
      description: 'The verification token has expired or has already been used.',
      solution: 'Try signing in again.',
    },
    Callback: {
      title: 'Database Connection Error',
      description: 'Unable to connect to the database or save your session.',
      solution: 'Make sure PostgreSQL is running and the database is set up correctly. Run: npm run db:push',
    },
    OAuthSignin: {
      title: 'OAuth Sign In Error',
      description: 'Error occurred during GitHub OAuth sign in.',
      solution: 'Check your GitHub OAuth app configuration and credentials.',
    },
    OAuthCallback: {
      title: 'OAuth Callback Error',
      description: 'Error occurred during the OAuth callback.',
      solution: 'Verify your callback URL is set to: http://localhost:3000/api/auth/callback/github',
    },
    OAuthCreateAccount: {
      title: 'Account Creation Error',
      description: 'Could not create user account in the database.',
      solution: 'Check database connection and run: npm run db:push',
    },
    EmailCreateAccount: {
      title: 'Email Account Error',
      description: 'Could not create email account.',
      solution: 'Contact support.',
    },
    SessionRequired: {
      title: 'Session Required',
      description: 'You must be signed in to access this page.',
      solution: 'Please sign in to continue.',
    },
    Default: {
      title: 'Authentication Error',
      description: 'An unexpected error occurred during authentication.',
      solution: 'Please try again or contact support if the problem persists.',
    },
  }

  const errorInfo = errorMessages[error || 'Default'] || errorMessages.Default

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {errorInfo.title}
          </h1>
          
          <p className="text-gray-600 text-center mb-4">
            {errorInfo.description}
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Solution:</strong> {errorInfo.solution}
            </p>
          </div>

          {error === 'Callback' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 font-semibold mb-2">
                Quick Fix Steps:
              </p>
              <ol className="text-sm text-yellow-800 list-decimal list-inside space-y-1">
                <li>Make sure PostgreSQL is running</li>
                <li>Run: <code className="bg-yellow-100 px-1 rounded">npm run db:push</code></li>
                <li>Restart your dev server</li>
                <li>Try signing in again</li>
              </ol>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Back to Home
            </Link>
            
            <Link
              href="/docs/troubleshooting"
              className="block w-full text-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              View Troubleshooting Guide
            </Link>
          </div>

          {error && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-gray-500 text-center">
                Error Code: <code className="bg-gray-100 px-2 py-1 rounded">{error}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}
