import Link from 'next/link'
import { Compass, Mail, ShieldCheck, Lock, Award, Users } from 'lucide-react'
import { FEATURES } from '@/lib/features'

export function Footer() {
  const footerLinks = {
    main: {
      title: 'Navigation',
      links: [
        ...(FEATURES.ASSESSMENT ? [{ name: 'Ersteinschätzung', href: '/triage' }] : []),
        { name: 'Therapeut:innen', href: '/therapists' },
        { name: 'Für Therapeut:innen', href: '/for-therapists' },
        { name: 'FAQ', href: '/help' },
        { name: 'Kontakt', href: '/contact' },
      ],
    },
    legal: {
      title: 'Rechtliches',
      links: [
        { name: 'Datenschutz', href: '/privacy' },
        { name: 'Cookie-Richtlinie', href: '/cookies' },
        { name: 'Impressum', href: '/imprint' },
        { name: 'AGB', href: '/terms' },
      ],
    },
  }

  return (
    <footer
      className="relative mt-auto border-t border-divider bg-surface text-default"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-200/80 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand Section */}
          <div className="col-span-1" itemScope itemType="https://schema.org/Organization">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                <Compass className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-xl font-semibold" itemProp="name">
                FindMyTherapy
              </span>
            </div>
            <p className="mb-4 text-sm text-muted" itemProp="description">
              Der klare Weg zur richtigen Hilfe in Österreich.
            </p>
            <address className="not-italic">
              <div className="space-y-1 text-sm text-muted">
                <a
                  href="mailto:servus@findmytherapy.net"
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-link transition hover:bg-primary-50/80"
                  itemProp="email"
                >
                  <Mail className="h-4 w-4 text-primary-500" aria-hidden="true" />
                  <span>servus@findmytherapy.net</span>
                </a>
              </div>
            </address>
          </div>

          {/* Links Sections */}
          {Object.values(footerLinks).map((section) => (
            <nav key={section.title} className="col-span-1" aria-label={section.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="inline-flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-surface-2/60 hover:text-default"
                    >
                      {link.name}
                      <span aria-hidden className="text-xs text-subtle">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Trust Badges Section */}
        <section className="mt-12 rounded-3xl border border-divider bg-surface-1/70 p-6 shadow-soft" aria-label="Vertrauensindikatoren">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {/* Verified Therapists */}
            <article className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600" aria-hidden="true">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-default">Geprüfte Therapeut:innen</h4>
              <p className="text-xs text-muted">Alle Profile werden verifiziert</p>
            </article>

            {/* Data Protection */}
            <article className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600" aria-hidden="true">
                <Lock className="h-5 w-5" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-default">DSGVO-konform</h4>
              <p className="text-xs text-muted">Deine Daten sind sicher</p>
            </article>

            {/* Quality Standards */}
            <article className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600" aria-hidden="true">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-default">Qualitätsstandards</h4>
              <p className="text-xs text-muted">Höchste professionelle Standards</p>
            </article>

            {/* Austrian Focus */}
            <article className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600" aria-hidden="true">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-default">Österreich-Fokus</h4>
              <p className="text-xs text-muted">Spezialisiert auf den österreichischen Markt</p>
            </article>
          </div>
        </section>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-divider pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted md:flex-row md:text-left">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} FindMyTherapy. Der klare Weg zur richtigen Hilfe.
            </p>
            <div className="flex items-center gap-4">
              <span className="rounded-full bg-surface-2/70 px-3 py-1 text-sm text-default">🇦🇹 Österreich</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
