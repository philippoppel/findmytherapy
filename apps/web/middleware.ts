import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecrypt } from 'jose'

// Middleware config - runs in Edge Runtime
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/therapists',
  '/courses',
  '/blog',
  '/triage',
  '/about',
  '/how-it-works',
  '/for-therapists',
  '/partners',
  '/help',
  '/contact',
  '/privacy',
  '/imprint',
  '/terms',
  '/api/auth',
  '/api/auth-custom',
  '/api/register',
  '/api/clients/register',
  '/api/access-request',
  '/api/triage',
]

const authRoutes = ['/login', '/register', '/signup']

const protectedRoutes = ['/dashboard', '/admin', '/settings', '/profile']

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1))
    }
    return pathname === route || pathname.startsWith(`${route}/`)
  })
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route))
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Try to get session token from cookie
  let token: any = null;
  const cookieName = process.env.NODE_ENV === 'production'
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token'

  const cookieValue = req.cookies.get(cookieName)?.value

  if (cookieValue && process.env.NEXTAUTH_SECRET) {
    try {
      // Use SHA-256 hash of secret to get exactly 32 bytes (Web Crypto API for Edge Runtime)
      const encoder = new TextEncoder()
      const secretBytes = encoder.encode(process.env.NEXTAUTH_SECRET)
      const hashBuffer = await crypto.subtle.digest('SHA-256', secretBytes)
      const secret = new Uint8Array(hashBuffer)

      const { payload } = await jwtDecrypt(cookieValue, secret)
      token = payload
    } catch (error) {
      // Token is invalid or expired - ignore and treat as not logged in
      console.error('[Middleware] Token decode error:', error)
    }
  }

  const isLoggedIn = !!token

  // Only log for non-API and non-static routes in development
  if (process.env.NODE_ENV === 'development' && !pathname.startsWith('/api/') && !pathname.startsWith('/_next')) {
    console.log('[Middleware]', pathname, { isLoggedIn })
  }

  // Allow public routes (static files, API routes, public pages)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('/api/auth') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isAuthRoute(pathname)) {
    console.log('[Middleware] Redirecting logged-in user from', pathname, 'to /dashboard')
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Redirect non-logged-in users from protected routes to login
  if (!isLoggedIn && isProtectedRoute(pathname)) {
    console.log('[Middleware] Redirecting non-logged-in user from', pathname, 'to /login')
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
