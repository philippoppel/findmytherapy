'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { LayoutDashboard, LogOut, Shield, User } from 'lucide-react'

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
    return <div className="h-9 w-28 animate-pulse rounded-full bg-white/20" />
  }

  if (!session) {
    return (
      <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:flex-nowrap">
        <Link
          href="/login"
          className="w-full rounded-full border border-white/25 px-4 py-2 text-center text-sm font-medium text-white/80 transition hover:border-white/45 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-950 md:w-auto"
        >
          Anmelden
        </Link>
        <Link
          href="/register"
          className="w-full rounded-full bg-white/20 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm shadow-white/15 transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-950 md:w-auto"
        >
          Registrieren
        </Link>
      </div>
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
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-white/20 px-2 py-1.5 text-sm font-medium text-white/85 transition hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-950"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
          <User className="h-4 w-4 text-white" aria-hidden />
        </div>
        <span className="hidden md:block">
          {session.user?.email?.split('@')[0]}
        </span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 z-50 mt-3 w-60 rounded-2xl border border-white/10 bg-teal-950/90 py-3 shadow-xl backdrop-blur-lg">
          <div className="border-b border-white/10 px-5 pb-3">
            <p className="text-sm font-semibold text-white">
              {session.user?.email}
            </p>
            <p className="text-xs text-white/65">
              {isAdmin ? 'Administrator' : isTherapist ? 'Therapeut:in' : 'Klient:in'}
            </p>
          </div>

          {(isTherapist || isAdmin) && (
            <HeaderMenuLink href={dashboardHref} label="Dashboard" icon={<LayoutDashboard className="h-4 w-4" />} onClick={() => setIsMenuOpen(false)} />
          )}

          {isClient && (
            <HeaderMenuLink href="/courses" label="Meine Kurse" icon={<LayoutDashboard className="h-4 w-4" />} onClick={() => setIsMenuOpen(false)} />
          )}

          {showSecurityLink && (
            <HeaderMenuLink href="/dashboard/security" label="Sicherheit" icon={<Shield className="h-4 w-4" />} onClick={() => setIsMenuOpen(false)} />
          )}

          <HeaderMenuLink href={profileHref} label={profileLabel} icon={<User className="h-4 w-4" />} onClick={() => setIsMenuOpen(false)} />

          <button
            onClick={() => {
              setIsMenuOpen(false)
              signOut({ callbackUrl: '/' })
            }}
            className="mt-2 flex w-full items-center justify-start gap-2 border-t border-white/10 px-5 pt-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Abmelden
          </button>
        </div>
      )}
    </div>
  )
}

function HeaderMenuLink({ href, label, icon, onClick }: { href: string; label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-5 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
      onClick={onClick}
    >
      <span className="text-white/70">{icon}</span>
      {label}
    </Link>
  )
}
