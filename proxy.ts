// proxy.ts

import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─────────────────────────────────────────────
// ROUTE DEFINITIONS
// ─────────────────────────────────────────────
const PUBLIC_ROUTES  = ['/', '/login', '/register']
const AUTH_ROUTES    = ['/login', '/register']
const ADMIN_ROUTES   = ['/admin']

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route)
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route))
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route))
}

// ─────────────────────────────────────────────
// PROXY
// ─────────────────────────────────────────────
export default auth(function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  // @ts-expect-error — auth() injects session onto request
  const session = request.auth as { user?: { role?: string } } | null

  const isLoggedIn = !!session?.user

  // Redirect logged-in users away from auth pages
  if (isAuthRoute(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect all non-public routes
  if (!isPublicRoute(pathname) && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Protect admin routes — only ADMIN role
  if (isAdminRoute(pathname) && session?.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}