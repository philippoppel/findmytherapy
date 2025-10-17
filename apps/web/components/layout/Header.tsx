'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Compass } from 'lucide-react'
import { AuthHeader } from './AuthHeader'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Therapeut:innen', href: '/therapists' },
    { name: 'Kurse', href: '/courses' },
    { name: 'Blog', href: '/blog' },
    { name: 'Ersteinschätzung', href: '/triage' },
    { name: 'Über uns', href: '/about' },
  ]

  return (
    <header className="bg-surface-1/80 border-b border-divider backdrop-blur">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="group flex items-center gap-3 rounded-xl px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary-700 transition-colors duration-200 group-hover:bg-primary/20">
                <Compass className="h-6 w-6" aria-hidden />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-xl font-semibold text-neutral-900">
                  Klarthera
                </span>
                <span className="hidden text-xs font-medium text-primary-700 sm:block">
                  Der klare Weg zur richtigen Hilfe.
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6 text-base">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-lg px-3 py-2 text-base font-semibold text-muted transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <AuthHeader />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              aria-label="Menu öffnen"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-divider pt-2 pb-3 space-y-1 text-base">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-3 font-medium text-muted transition-colors hover:bg-surface-2 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-2 border-t border-divider pt-2">
              <Link
                href="/login"
                className="block rounded-lg px-3 py-3 font-medium text-muted transition-colors hover:bg-surface-2 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                onClick={() => setIsMenuOpen(false)}
              >
                Anmelden
              </Link>
              <Link
                href="/register"
                className="block rounded-lg px-3 py-3 font-medium text-muted transition-colors hover:bg-surface-2 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrieren
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
