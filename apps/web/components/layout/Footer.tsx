import Link from 'next/link'
import { Compass, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const footerLinks = {
    platform: {
      title: 'Plattform',
      links: [
        { name: 'Therapeut:innen finden', href: '/therapists' },
        { name: 'Kurse entdecken', href: '/courses' },
        { name: 'Blog & Insights', href: '/blog' },
        { name: 'Ersteinschätzung', href: '/triage' },
        { name: 'So funktioniert\'s', href: '/how-it-works' },
      ],
    },
    support: {
      title: 'Unterstützung',
      links: [
        { name: 'Hilfe & FAQ', href: '/help' },
        { name: 'Kontakt', href: '/contact' },
        { name: 'Für Therapeut:innen', href: '/for-therapists' },
        { name: 'Partner werden', href: '/partners' },
      ],
    },
    legal: {
      title: 'Rechtliches',
      links: [
        { name: 'Datenschutz', href: '/privacy' },
        { name: 'Impressum', href: '/imprint' },
        { name: 'AGB', href: '/terms' },
        { name: 'Cookie-Einstellungen', href: '/privacy#cookies' },
      ],
    },
  }

  return (
    <footer className="relative mt-auto border-t border-divider bg-gradient-to-br from-surface-2 via-surface-3 to-surface-1">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Compass className="h-6 w-6" aria-hidden />
              </span>
              <span className="text-xl font-semibold text-default">Klarthera</span>
            </div>
            <p className="text-sm text-subtle mb-4">
              Klarthera – Der klare Weg zur richtigen Hilfe. Wir verbinden Therapeut:innen, digitale Programme und Erstberatung in einer verlässlichen Plattform.
            </p>
            <div className="space-y-2 text-sm text-subtle">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>servus@klarthera.at</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+43 1 997 1212</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Wien, Österreich</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-sm font-semibold text-muted mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-subtle transition-colors hover:text-link"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-divider">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-subtle text-center md:text-left">
              © 2025 Klarthera. Der klare Weg zur richtigen Hilfe.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-subtle">🇦🇹 Österreich</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
