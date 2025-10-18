'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User, LogOut, LayoutDashboard, Shield } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function AuthHeader() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (status === 'loading') {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-24 rounded bg-surface-2"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <>
        <Link
          href="/login"
          className="px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-primary"
        >
          Anmelden
        </Link>
        <Link
          href="/register"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Registrieren
        </Link>
      </>
    )
  }

  const role = session.user?.role
  const isAdmin = role === 'ADMIN'
  const isTherapist = role === 'THERAPIST'
  const isClient = role === 'CLIENT'
  const dashboardHref = isAdmin ? '/admin' : '/dashboard'
  const showSecurityLink = isTherapist || isAdmin
  const profileHref = isTherapist ? '/dashboard/profile' : isAdmin ? '/admin' : '/settings'
  const profileLabel = isTherapist ? 'Profil verwalten' : isAdmin ? 'Adminbereich' : 'Profil & Einstellungen'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <span className="text-sm font-medium hidden md:block">
          {session.user?.email?.split('@')[0]}
        </span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-divider bg-surface-1/95 py-1 shadow-lg backdrop-blur">
          <div className="border-b border-divider px-4 py-2">
            <p className="text-sm font-medium text-default">
              {session.user?.email}
            </p>
            <p className="text-xs text-subtle">
              {session.user?.role === 'ADMIN' 
                ? 'Administrator' 
                : session.user?.role === 'THERAPIST'
                ? 'Therapeut:in'
                : 'Klient:in'}
            </p>
          </div>

          {(isTherapist || isAdmin) && (
            <Link
              href={dashboardHref}
              className="flex items-center px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-2/80"
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          )}

          {isClient && (
            <Link
              href="/courses"
              className="flex items-center px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-2/80"
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Meine Kurse
            </Link>
          )}

          {showSecurityLink && (
            <Link
              href="/dashboard/security"
              className="flex items-center px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-2/80"
              onClick={() => setIsMenuOpen(false)}
            >
              <Shield className="h-4 w-4 mr-2" />
              Sicherheit
            </Link>
          )}

          <Link
            href={profileHref}
            className="flex items-center px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-2/80"
            onClick={() => setIsMenuOpen(false)}
          >
            <User className="h-4 w-4 mr-2" />
            {profileLabel}
          </Link>

          <button
            onClick={() => {
              setIsMenuOpen(false)
              signOut({ callbackUrl: '/' })
            }}
            className="flex w-full items-center border-t border-divider px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-2/80"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Abmelden
          </button>
        </div>
      )}
    </div>
  )
}
