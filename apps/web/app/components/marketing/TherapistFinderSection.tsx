import { getTherapistCards } from '../../therapists/getTherapistCards';
import { TherapistSearchChoice } from '../../therapists/components/TherapistSearchChoice';
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

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(therapistListStructuredData) }}
      />
    </div>
  );
}
