import { Sparkles, Search, Users } from 'lucide-react'

import { TherapistDirectory } from '../../therapists/TherapistDirectorySimplified'
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

  // ItemList Structured Data for Therapist Directory
  const therapistListStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Verifizierte Therapeut:innen auf FindMyTherapy',
    description: 'Liste von verifizierten Psychotherapeut:innen in Österreich',
    numberOfItems: therapists.length,
    itemListElement: therapists.slice(0, 20).map((therapist, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: therapist.name,
        jobTitle: therapist.title || 'Psychotherapeut:in',
        description: therapist.focus.join(', '),
        address: therapist.city ? {
          '@type': 'PostalAddress',
          addressLocality: therapist.city,
          addressCountry: 'AT',
        } : undefined,
        url: `https://findmytherapy.net/therapists/${therapist.id}`,
      },
    })),
  }

  return (
    <section
      id="therapist-search"
      className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-neutral-950 to-black py-16 text-white sm:py-20 lg:py-24 xl:py-28"
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary-500/20 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute -right-16 bottom-10 h-96 w-96 rounded-full bg-secondary-400/20 blur-3xl sm:h-[28rem] sm:w-[28rem]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:gap-10 sm:px-6 lg:gap-12 lg:px-8 xl:px-12">
        {/* Header Section */}
        <Reveal className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/90 shadow-lg backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary-300" />
            Direkt hier suchen
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-8">
            <div className="space-y-4">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
                Passende Therapeut:innen ohne Seitenwechsel
              </h2>
              <p className="mx-auto max-w-3xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg lg:mx-0 lg:text-xl">
                Filtere nach Themen, Standort, Format oder Sprache – die komplette Suche reagiert in Echtzeit.
              </p>
            </div>

            <div className="mx-auto lg:mx-0 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 shadow-lg backdrop-blur-sm lg:mt-2">
              <div className="flex items-center gap-3 text-sm font-semibold text-white sm:text-base">
                <Search className="h-5 w-5 text-primary-300" />
                <span className="whitespace-nowrap">Keine neue Seite</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Stats Grid */}
        <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-white/15 bg-white/5 p-5 text-center shadow-lg backdrop-blur transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:shadow-xl sm:p-6 lg:rounded-3xl lg:p-7"
            >
              <p className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold text-white/80 sm:text-base lg:mt-3">{stat.label}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-white/50 sm:text-sm">
                {stat.description}
              </p>
            </div>
          ))}
        </Reveal>

        {/* Search Section */}
        <Reveal delay={150}>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur sm:p-5 lg:rounded-[32px] lg:p-6 xl:p-8">
            {/* Info Banner */}
            <div className="mb-6 flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 sm:flex-row sm:items-center sm:gap-4 lg:mb-8">
              <Users className="h-5 w-5 flex-shrink-0 text-primary-300" />
              <span className="leading-relaxed">
                Alle Profile aus unserem kuratierten Netzwerk. Filter aktualisieren die Ergebnisse in Echtzeit.
              </span>
            </div>

            {/* Directory Component */}
            <TherapistDirectory therapists={therapists} />
          </div>
        </Reveal>
      </div>

      {/* Structured Data for Therapist Directory */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(therapistListStructuredData) }}
      />
    </section>
  )
}
