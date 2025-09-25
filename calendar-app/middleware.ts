import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /calendar, /login)
  const path = request.nextUrl.pathname

  // Define paths that require authentication
  const protectedPaths = ["/calendar"]

  // Define public paths that should redirect to calendar if user is authenticated
  const publicPaths = ["/login", "/signup"]

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((protectedPath) => path.startsWith(protectedPath))

  // Check if the current path is public
  const isPublicPath = publicPaths.includes(path)

  // For protected paths, we'll handle authentication check on the client side
  // This middleware just ensures the routes exist
  if (isProtectedPath) {
    return NextResponse.next()
  }

  // For public paths, continue normally
  if (isPublicPath) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
