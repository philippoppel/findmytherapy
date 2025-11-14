import { Sparkles, Search, Users } from 'lucide-react'

import { TherapistDirectory } from '../../therapists/TherapistDirectory'
import { getTherapistCards } from '../../therapists/getTherapistCards'
import type { TherapistCard } from '../../therapists/types'
import { Reveal } from './Reveal'

function buildStats(therapists: TherapistCard[]) {
  const accepting = therapists.filter((therapist) =>
    therapist.availabilityRank <= 2 || therapist.availability.toLowerCase().includes('frei')
  ).length
  const cities = new Set(therapists.map((therapist) => therapist.city).filter(Boolean))
  const online = therapists.filter((therapist) => therapist.formatTags.includes('online')).length

  return [
    {
      label: 'Verifizierte Profile',
      value: therapists.length.toString(),
      description: 'Von unserem Team geprüft',
    },
    {
      label: 'Sofort freie Kapazität',
      value: accepting.toString(),
      description: 'Neue Patient:innen möglich',
    },
    {
      label: 'Regionen & Online',
      value: `${cities.size} Städte · ${online} online`,
      description: 'Suche vor Ort oder remote',
    },
  ]
}

export async function TherapistFinderSection() {
  const therapists = await getTherapistCards()

  if (!therapists.length) {
    return null
  }

  const stats = buildStats(therapists)

  return (
    <section
      id="therapist-search"
      className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-neutral-950 to-black py-20 text-white sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -right-12 bottom-10 h-80 w-80 rounded-full bg-secondary-400/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
            <Sparkles className="h-4 w-4" />
            Direkt hier suchen
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Passende Therapeut:innen ohne Seitenwechsel
              </h2>
              <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-white/75">
                Filtere nach Themen, Standort, Format oder Sprache – die komplette Suche lädt direkt
                auf dieser Seite und reagiert in Echtzeit.
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-primary-900/30">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5" />
                <span>Sofort loslegen, keine neue Seite</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/15 bg-white/5 p-5 text-center shadow-lg shadow-primary-900/20"
            >
              <p className="text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-white/70">{stat.label}</p>
              <p className="mt-2 text-xs uppercase tracking-wider text-white/50">{stat.description}</p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={150}>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              <Users className="h-4 w-4" />
              <span>
                Alle Profile kommen aus unserem kuratierten Netzwerk. Jede Filtereingabe aktualisiert
                die Ergebnisse ohne Seitenwechsel.
              </span>
            </div>
            <TherapistDirectory therapists={therapists} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
