import { Sparkles, Users } from 'lucide-react';

import { TherapistDirectory } from '../../therapists/TherapistDirectorySimplified';
import { getTherapistCards } from '../../therapists/getTherapistCards';
import { TherapistSearchChoice } from '../../therapists/components/TherapistSearchChoice';
// import type { TherapistCard } from '../../therapists/types'
import { Reveal } from './Reveal';
import { MatchingSection } from '../matching/MatchingSection';

// Commented out for now - can be used later for stats display
/* import type { TherapistCard } from '../../therapists/types'
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
} */

export async function TherapistFinderSection() {
  // Load all therapists for proper filtering
  const { therapists, total } = await getTherapistCards();

  if (!therapists.length) {
    return null;
  }

  // const stats = buildStats(therapists) // TODO: Use stats for display if needed

  // ItemList Structured Data for Therapist Directory
  const therapistListStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Verifizierte Therapeut:innen auf FindMyTherapy',
    description: 'Liste von verifizierten Psychotherapeut:innen in Österreich',
    numberOfItems: total,
    itemListElement: therapists.slice(0, 20).map((therapist, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: therapist.name,
        jobTitle: therapist.title || 'Psychotherapeut:in',
        description: therapist.focus.join(', '),
        address: therapist.city
          ? {
              '@type': 'PostalAddress',
              addressLocality: therapist.city,
              addressCountry: 'AT',
            }
          : undefined,
        url: `https://findmytherapy.net/therapists/${therapist.id}`,
      },
    })),
  };

  return (
    <div id="therapist-directory">
      {/* Choice Section - Matching vs Browse */}
      <TherapistSearchChoice />

      {/* Matching Wizard & Results - Inline Expansion */}
      <MatchingSection />

      {/* Browse All Section */}
      <section
        id="therapist-list"
        className="relative overflow-hidden bg-gradient-to-b from-primary-800 via-neutral-800 to-neutral-900 py-16 text-white sm:py-20 lg:py-24 xl:py-28"
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
              Alle durchsuchen
            </div>

            <div className="space-y-4">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
                Passende Therapeut:innen finden
              </h2>
              <p className="mx-auto max-w-3xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg lg:mx-0 lg:text-xl">
                Filtere nach Themen, Standort, Format oder Sprache – volle Kontrolle über deine
                Suche
              </p>
            </div>
          </Reveal>

          {/* Search Section */}
          <Reveal delay={150}>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur sm:p-5 lg:rounded-[32px] lg:p-6 xl:p-8">
              {/* Info Banner */}
              <div className="mb-6 flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 sm:flex-row sm:items-center sm:gap-4 lg:mb-8">
                <Users className="h-5 w-5 flex-shrink-0 text-primary-300" />
                <span className="leading-relaxed">
                  Alle Profile aus unserem kuratierten Netzwerk. Filter aktualisieren die Ergebnisse
                  in Echtzeit.
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
    </div>
  );
}
