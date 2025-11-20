import type { Metadata } from 'next'
import Link from 'next/link'
import { Compass, Sparkles } from 'lucide-react'

import { TherapistDirectory } from './TherapistDirectorySimplified'
import { TherapistSearchChoice } from './components/TherapistSearchChoice'
import { FEATURES } from '@/lib/features'
import { getTherapistCards } from './getTherapistCards'

// Force dynamic rendering to prevent database access during build
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Therapeut:innen finden in Österreich – FindMyTherapy',
  description:
    'Finde zertifizierte Psychotherapeut:innen in Österreich mit klarer Spezialisierung, verfügbaren Terminen und transparenten Therapieschwerpunkten. Verifizierte Profile, Online und Vor-Ort-Termine.',
  keywords: [
    'Therapeut finden Österreich',
    'Psychotherapeut Wien',
    'Online Therapie Österreich',
    'Psychotherapie Termine',
    'Therapeutensuche',
    'Kassenplatz Therapie',
    'verifizierte Therapeuten',
  ],
  openGraph: {
    title: 'Therapeut:innen finden in Österreich – Verifizierte Profile',
    description:
      'Entdecke zertifizierte Psychotherapeut:innen mit verfügbaren Terminen. Online und vor Ort in Wien, Graz, Linz und ganz Österreich.',
    type: 'website',
    url: 'https://findmytherapy.net/therapists',
    locale: 'de_AT',
    siteName: 'FindMyTherapy',
  },
  alternates: {
    canonical: 'https://findmytherapy.net/therapists',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Therapeut:innen finden in Österreich',
    description:
      'Zertifizierte Psychotherapeut:innen mit verfügbaren Terminen. Transparent, verifiziert, DSGVO-konform.',
  },
}

export default async function TherapistsPage() {
  const therapists = await getTherapistCards()

  return (
    <div className="marketing-theme bg-surface text-default">
      <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-100/40 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-64 w-64 rounded-full bg-secondary-100/50 blur-3xl" />
        </div>
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
          <div className="flex justify-end">
            <Link href="/" className="text-sm font-medium text-link transition hover:underline">
              Zur Startseite
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-divider bg-surface-1/95 p-8 shadow-soft-xl sm:p-12">
            <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
              <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-primary-200/60 blur-3xl" />
              <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-secondary-200/60 blur-3xl" />
            </div>
            <div className="relative space-y-8 text-center md:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-800">
                <Sparkles className="h-4 w-4" />
                Kuratiertes Pilotnetzwerk
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
                  Finde die Therapeut:in, die zu deinem Bedarf passt
                </h1>
                <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted md:mx-0">
                  Unser Care-Team validiert Qualifikationen, Schwerpunktsetzung und Kapazitäten. Starte mit einer Ersteinschätzung und erhalte Vorschläge, die zu deinen Antworten passen.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-start">
                {FEATURES.ASSESSMENT && (
                  <Link
                    href="/triage"
                    prefetch={false}
                    className="inline-flex items-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-soft-lg transition hover:-translate-y-0.5 hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    <Compass className="mr-2 h-4 w-4" /> Ersteinschätzung starten
                  </Link>
                )}
                <Link
                  href="/contact"
                  prefetch={false}
                  className="text-sm font-semibold text-link transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Persönliche Beratung anfordern
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TherapistSearchChoice />

      <section id="therapist-directory" className="relative pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="theme-dark relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-950 via-primary-950 to-neutral-900 p-8 shadow-soft-xl sm:p-10">
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute left-0 top-0 h-40 w-40 -translate-x-1/3 -translate-y-1/3 rounded-full bg-primary-400/40 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-48 w-48 translate-x-1/3 translate-y-1/3 rounded-full bg-secondary-400/40 blur-3xl" />
            </div>
            <div className="relative flex flex-wrap items-center justify-between gap-6 pb-8">
              <div className="max-w-2xl space-y-3">
                <h2 className="text-3xl font-semibold text-white">Ausgewählte Pilot-Therapeut:innen</h2>
                <p className="text-base text-white/80">
                  Transparente Profile mit Fokus, Verfügbarkeit und Praxisdetails – abgestimmt auf unsere Ersteinschätzung.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80">
                <Sparkles className="h-4 w-4 text-primary-200" />
                Kuratiertes Netzwerk
              </div>
            </div>
            <div className="relative">
              <TherapistDirectory therapists={therapists} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
