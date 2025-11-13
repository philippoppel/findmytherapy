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
      className="relative mt-auto border-t border-primary-200/20 bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary-950 text-white"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="col-span-1" itemScope itemType="https://schema.org/Organization">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white">
                <Compass className="h-6 w-6" aria-hidden />
              </span>
              <span className="text-xl font-semibold text-white" itemProp="name">
                FindMyTherapy
              </span>
            </div>
            <p className="mb-4 text-sm text-white/70" itemProp="description">
              Der klare Weg zur richtigen Hilfe in Österreich.
            </p>
            <address className="not-italic">
              <div className="space-y-1 text-sm text-white/75">
                <a
                  href="mailto:servus@findmytherapy.net"
                  className="inline-flex items-center gap-2 transition hover:text-white"
                  itemProp="email"
                >
                  <Mail className="h-4 w-4 text-white/60" aria-hidden="true" />
                  <span>servus@findmytherapy.net</span>
                </a>
              </div>
            </address>
          </div>

          {/* Links Sections */}
          {Object.values(footerLinks).map((section) => (
            <nav key={section.title} className="col-span-1" aria-label={section.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="inline-block px-4 py-3 text-sm text-white/70 transition hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Trust Badges Section */}
        <section className="mt-12 border-t border-white/10 pt-8" aria-label="Vertrauensindikatoren">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {/* Verified Therapists */}
            <article className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/20 text-primary-300" aria-hidden="true">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-white">Geprüfte Therapeut:innen</h4>
              <p className="text-xs text-white/60">Alle Profile werden verifiziert</p>
            </article>

            {/* Data Protection */}
            <article className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/20 text-primary-300" aria-hidden="true">
                <Lock className="h-6 w-6" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-white">DSGVO-konform</h4>
              <p className="text-xs text-white/60">Deine Daten sind sicher</p>
            </article>

            {/* Quality Standards */}
            <article className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/20 text-primary-300" aria-hidden="true">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-white">Qualitätsstandards</h4>
              <p className="text-xs text-white/60">Höchste professionelle Standards</p>
            </article>

            {/* Austrian Focus */}
            <article className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/20 text-primary-300" aria-hidden="true">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-white">Österreich-Fokus</h4>
              <p className="text-xs text-white/60">Spezialisiert auf den österreichischen Markt</p>
            </article>
          </div>
        </section>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/60 md:flex-row md:text-left">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} FindMyTherapy. Der klare Weg zur richtigen Hilfe.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-white/70">🇦🇹 Österreich</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
