'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Compass, Menu, X } from 'lucide-react'
import { getMarketingNavigation } from '../../app/marketing-content'
import { AuthHeader } from './AuthHeader'
import { FEATURES } from '@/lib/features'
import { filterNavigationItems } from '@/lib/content-filters'
import { useAnchorNavigation } from '@/app/components/useAnchorNavigation'

const baseAppNavigation = [
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
  const handleAnchorNavigation = useAnchorNavigation()

  // Get filtered navigation based on enabled features
  const marketingNavigation = getMarketingNavigation()
  const appNavigation = filterNavigationItems(baseAppNavigation)
  const navigation = isHome ? marketingNavigation : appNavigation

  // Auf der Homepage nur die wichtigsten Links zeigen
  const baseDesktopNavigation = [
    ...(FEATURES.ASSESSMENT ? [{ label: 'Ersteinschätzung', href: '/triage' }] : []),
    { label: 'Therapeut:innen', href: '#therapist-search' },
    { label: 'Team', href: '#team' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQ', href: '#faq' },
  ]

  const desktopNavigation = isHome ? baseDesktopNavigation : navigation

  return (
    <header className="sticky top-0 z-50 border-b border-primary-200/50 bg-white/95 text-neutral-900 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-xl border border-transparent p-1.5 transition-transform hover:scale-105 focus-visible:border-primary-300 focus-visible:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-400 focus-visible:outline-offset-2"
            aria-label="FindMyTherapy Startseite"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-soft">
              <Compass className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold leading-tight text-neutral-900">
                FindMyTherapy
              </span>
              <span className="hidden text-xs font-medium text-neutral-600 sm:block">
                Mentale Orientierung
              </span>
            </div>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-1.5 lg:flex">
            {desktopNavigation.map((item) => {
              const isAnchor = item.href.startsWith('#')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(event) => isAnchor && handleAnchorNavigation(event, item.href)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:bg-primary-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <AuthHeader />
            {!isHome && FEATURES.ASSESSMENT && (
              <Link
                href="/triage"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
              >
                Kostenlose Ersteinschätzung
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-700 transition hover:bg-primary-50 hover:text-neutral-900 lg:hidden"
            aria-label="Menü öffnen"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="mb-4 mt-2 space-y-4 rounded-2xl border border-primary-200 bg-white/95 p-5 text-sm text-neutral-900 shadow-soft-lg backdrop-blur lg:hidden">
            <div className="space-y-1.5">
              {navigation.map((item) => {
                const isAnchor = item.href.startsWith('#')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-4 py-2.5 font-medium transition hover:bg-primary-50 hover:text-neutral-900"
                    onClick={(event) => {
                      if (isAnchor) {
                        handleAnchorNavigation(event, item.href)
                      }
                      setIsMenuOpen(false)
                    }}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
            <div className="space-y-3 border-t border-primary-200 pt-4">
              <AuthHeader />
              {FEATURES.ASSESSMENT && (
                <Link
                  href="/triage"
                  className="block rounded-xl bg-primary-600 px-4 py-3 text-center text-sm font-medium text-white shadow-soft transition hover:bg-primary-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kostenlose Ersteinschätzung
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
