import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Users,
  Calendar,
  TrendingUp,
  FileText,
  Video,
  Award,
  Download,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Mail,
  BarChart3,
  Shield,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Für Therapeut:innen – FindMyTherapy',
  description:
    'Digitale Praxis-Tools, qualifizierte Klient:innen und administrative Entlastung. Starte kostenlos und erreiche Menschen, die aktiv nach Unterstützung suchen.',
}

const benefits = [
  {
    icon: Users,
    title: 'Qualifizierte Klient:innen',
    description:
      'Erreiche Menschen mit validierter Ersteinschätzung (PHQ-9/GAD-7), die aktiv Hilfe suchen – regional und online.',
  },
  {
    icon: FileText,
    title: 'Vorberichte fürs Erstgespräch',
    description:
      'Strukturierte Screening-Ergebnisse und Präferenzen helfen dir, direkt ins Thema zu kommen.',
  },
  {
    icon: Calendar,
    title: 'Administrative Entlastung',
    description:
      'Unser Care-Team unterstützt bei Erstkontakten, Terminvorbereitung und Matching-Empfehlungen.',
  },
  {
    icon: Video,
    title: 'Kostenlose Praxis-Webseite',
    description:
      'Professionelle Mikro-Webseite mit deinem Profil, Schwerpunkten und Verfügbarkeit – automatisch gepflegt.',
  },
  {
    icon: BarChart3,
    title: 'Digitale Verlängerung',
    description:
      'Nutze Übungen, Fortschrittsverläufe und strukturierte Programme zur Sitzungsbegleitung.',
  },
  {
    icon: Shield,
    title: 'DSGVO-konform & sicher',
    description:
      'Alle Daten bleiben in der EU. Höchste Datenschutz-Standards für dich und deine Klient:innen.',
  },
]

const features = [
  {
    title: 'Matching-Algorithmus',
    description: 'Automatische Empfehlungen basierend auf Symptomen, Präferenzen und Verfügbarkeit.',
  },
  {
    title: 'Praxis-Dashboard',
    description: 'Übersicht über Anfragen, Termine und Klient:innen-Pipeline.',
  },
  {
    title: 'Digitale Werkzeuge',
    description: 'Übungsbibliothek, Fortschrittstracking und Ressourcen für Zwischen-Sitzungen.',
  },
  {
    title: 'Flexible Integration',
    description: 'Funktioniert neben deiner bestehenden Praxis-Software – kein Systemwechsel nötig.',
  },
]

const pricingTiers = [
  {
    name: 'Free',
    price: '0€',
    period: 'dauerhaft',
    features: [
      'Profil-Eintrag im Verzeichnis',
      'Kostenlose Mikro-Webseite',
      'Basis-Matching',
      'Anfragen-Verwaltung',
      'Community-Support',
    ],
    cta: 'Kostenlos starten',
    href: 'mailto:therapists@findmytherapy.net',
    highlighted: false,
  },
  {
    name: 'PRO',
    price: '49€',
    period: 'pro Monat',
    features: [
      'Alles aus Free',
      'Top-Platzierung in Suchergebnissen',
      'Video-Profil & erweiterte Galerie',
      'Priority-Matching',
      'Analytics & Insights',
      'Premium-Support',
    ],
    cta: 'PRO-Plan wählen',
    href: 'mailto:therapists@findmytherapy.net?subject=PRO%20Plan%20Interesse',
    highlighted: true,
  },
]

const stats = [
  { value: '100%', label: 'DSGVO-konform' },
  { value: 'PHQ-9/GAD-7', label: 'Validierte Tests' },
  { value: '< 5 Min', label: 'Matching-Zeit' },
  { value: 'EU-Server', label: 'Datenspeicherung' },
]

export default function ForTherapistsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-950 via-cyan-950 to-blue-950">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-32 right-4 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex justify-end">
            <Link href="/" className="text-sm font-medium text-white/70 transition hover:text-white">
              Zur Startseite
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur sm:p-12">
            <div className="mx-auto max-w-4xl space-y-8 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80">
                <Sparkles className="h-4 w-4" />
                Für Therapeut:innen
              </span>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Deine Praxis. Digital verlängert.
              </h1>

              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/85 sm:text-xl">
                Erreiche qualifizierte Klient:innen mit validierter Ersteinschätzung, spare Zeit durch administrative
                Entlastung und nutze digitale Tools für nachhaltige Therapieerfolge.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="mailto:therapists@findmytherapy.net?subject=Erstgespräch%20vereinbaren"
                  className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                >
                  <Mail className="h-5 w-5" />
                  Erstgespräch vereinbaren
                </a>
                <a
                  href="/downloads/findmytherapy-infopaket.pdf"
                  download
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 bg-white/10 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:border-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                >
                  <Download className="h-5 w-5" />
                  Infopaket herunterladen
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-8 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-2xl font-bold text-teal-300">{stat.value}</div>
                    <div className="mt-1 text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Warum FindMyTherapy?</h2>
            <p className="mt-4 text-lg text-white/80">
              Mehr Zeit für Therapie, weniger Zeit für Akquise und Administration.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/20">
                  <benefit.icon className="h-6 w-6 text-teal-300" />
                </div>
                <h3 className="text-xl font-semibold text-white">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infopaket Download - Prominent */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border-2 border-teal-400/50 bg-gradient-to-br from-teal-900/80 to-cyan-900/80 p-8 shadow-2xl backdrop-blur sm:p-12">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-400/20 ring-2 ring-teal-400/30">
                <Download className="h-8 w-8 text-teal-300" />
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Alles Wichtige auf einen Blick
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-white/85">
                Lade unser Infopaket herunter und erfahre im Detail, wie FindMyTherapy deine Praxis unterstützt:
                Matching-Prozess, Pricing, Tools und rechtliche Rahmenbedingungen.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="/downloads/findmytherapy-infopaket.pdf"
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-teal-900 shadow-lg transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                >
                  <Download className="h-5 w-5" />
                  PDF herunterladen (2.4 MB)
                </a>
                <a
                  href="/downloads/findmytherapy-infopaket.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 bg-white/10 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:border-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                >
                  <FileText className="h-5 w-5" />
                  Online ansehen
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Tools & Features</h2>
            <p className="mt-4 text-lg text-white/80">
              Digitale Werkzeuge, die deine Praxis nahtlos ergänzen.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-500/20">
                    <CheckCircle2 className="h-5 w-5 text-teal-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm text-white/70">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Transparente Preise</h2>
            <p className="mt-4 text-lg text-white/80">
              Starte kostenlos und upgrade, wenn du mehr erreichen willst.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-3xl border p-8 shadow-2xl backdrop-blur ${
                  tier.highlighted
                    ? 'border-teal-400/50 bg-white/15 ring-2 ring-teal-400/20'
                    : 'border-white/10 bg-white/10'
                }`}
              >
                {tier.highlighted && (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-300">
                    <Award className="h-4 w-4" />
                    Empfohlen
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">{tier.price}</span>
                  <span className="text-lg text-white/70">{tier.period}</span>
                </div>

                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-teal-400" />
                      <span className="text-sm text-white/85">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={tier.href}
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ${
                    tier.highlighted
                      ? 'bg-teal-600 text-white hover:bg-teal-500'
                      : 'border-2 border-white/60 bg-white/10 text-white hover:border-white hover:bg-white/20'
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur sm:p-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Bereit, deine Praxis zu erweitern?
            </h2>
            <p className="mt-4 text-lg text-white/85">
              Vereinbare ein unverbindliches 30-Minuten Gespräch. Wir zeigen dir, wie Matching funktioniert und
              beantworten all deine Fragen.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="mailto:therapists@findmytherapy.net?subject=Erstgespräch%20vereinbaren"
                className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                <Mail className="h-5 w-5" />
                therapists@findmytherapy.net
              </a>
            </div>
            <p className="mt-6 text-sm text-white/70">
              Antwortzeit: 24-48 Stunden · Keine Verkaufsanrufe · DSGVO-konform
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
