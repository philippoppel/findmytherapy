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
        { name: 'Über uns', href: '/about' },
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
    <footer className="relative mt-auto border-t border-white/10 bg-gradient-to-br from-teal-950 via-cyan-900 to-blue-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white">
                <Compass className="h-6 w-6" aria-hidden />
              </span>
              <span className="text-xl font-semibold text-white">
                FindMyTherapy
              </span>
            </div>
            <p className="mb-6 text-sm text-white/70">
              FindMyTherapy – Der klare Weg zur richtigen Hilfe. Wir verbinden Therapeut:innen,
              digitale Programme und Erstberatung in einer verlässlichen Plattform.
            </p>
            <div className="space-y-2 text-sm text-white/75">
              <a
                href="mailto:servus@findmytherapy.net"
                className="inline-flex h-12 items-center gap-2 px-3 transition hover:text-white"
              >
                <Mail className="h-4 w-4 text-white/60" />
                <span>servus@findmytherapy.net</span>
              </a>
              <div className="flex items-center gap-2 py-3">
                <Phone className="h-4 w-4 text-white/60" />
                <span>+43 X XXX</span>
              </div>
              <div className="flex items-center gap-2 py-3">
                <MapPin className="h-4 w-4 text-white/60" />
                <span>Wien, Österreich</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="inline-block px-2 py-3 text-sm text-white/70 transition hover:text-white"
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
