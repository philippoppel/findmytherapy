'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Compass, Menu, X } from 'lucide-react'
import { marketingNavigation } from '../../app/marketing-content'
import { AuthHeader } from './AuthHeader'

const appNavigation = [
  { label: 'Therapeut:innen', href: '/therapists' },
  { label: 'Kurse', href: '/courses' },
  { label: 'Blog', href: '/blog' },
  { label: 'Ersteinschätzung', href: '/triage' },
  { label: 'Über uns', href: '/about' },
]

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isHome = pathname === '/'
  const navigation = isHome ? marketingNavigation : appNavigation

  // Auf der Homepage nur die wichtigsten Links zeigen
  const desktopNavigation = isHome
    ? [
        { label: 'Ersteinschätzung', href: '/triage' },
        { label: 'Therapeut:innen', href: '#therapists' },
        { label: 'Angebote', href: '#features' },
        { label: 'FAQ', href: '#faq' },
      ]
    : navigation

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-teal-950 via-cyan-900 to-blue-950 text-white backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-transform hover:scale-105"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/40">
              <Compass className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-base font-semibold leading-tight text-white">
                FindMyTherapy
              </span>
              <span className="text-[10px] font-medium text-teal-200/90">
                Mentale Orientierung
              </span>
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {desktopNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-950"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <AuthHeader />
            {!isHome && (
              <Link
                href="/triage"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-teal-400 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:-translate-y-0.5 hover:bg-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-950"
              >
                Kostenlose Ersteinschätzung
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="rounded-xl p-2 text-white/80 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Menü öffnen"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="mb-4 mt-2 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/85 shadow-lg backdrop-blur md:hidden">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 font-medium transition hover:bg-white/10 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="space-y-2 border-t border-white/10 pt-3">
              <AuthHeader />
              <Link
                href="/triage"
                className="block rounded-xl bg-teal-400 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-teal-900/30 transition hover:bg-teal-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Kostenlose Ersteinschätzung
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
