import type { Metadata } from 'next'
import {
  heroContent,
  impactStats,
  whyContent,
  featureTabs,
  earlyAccessContent,
  teamContent,
  faqItems,
  contactCta,
} from '../marketing-content'
import { MarketingHero } from '../components/marketing/MarketingHero'
import { ImpactStats } from '../components/marketing/ImpactStats'
import { WhySection } from '../components/marketing/WhySection'
import { FeatureTabs } from '../components/marketing/FeatureTabs'
import { EarlyAccessSection } from '../components/marketing/EarlyAccessSection'
import { TeamSection } from '../components/marketing/TeamSection'
import { FaqAccordion } from '../components/marketing/FaqAccordion'
import { ContactCta } from '../components/marketing/ContactCta'
import { AssessmentSection } from '../components/marketing/AssessmentSection'
import { AssessmentExplainer } from '../components/marketing/AssessmentExplainer'
import { TherapistSearch } from '../components/marketing/TherapistSearch'

// Force dynamic rendering to prevent database access during build
// Homepage includes dynamic therapist data that requires database connection
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'FindMyTherapy – Digitale Ersteinschätzung & Therapeut:innen-Matching',
  description:
    'Finde in wenigen Minuten heraus, welche Unterstützung dir guttut. Mit Ampel-Triage, persönlichen Empfehlungen, Kursen und einer Plattform für Therapeut:innen.',
  keywords: [
    'digitale Ersteinschätzung',
    'PHQ-9 Erklärung',
    'GAD-7 Erklärung',
    'Therapeut:in finden Österreich',
    'mentale Gesundheit Matching',
  ],
  openGraph: {
    title: 'FindMyTherapy – Klarheit ab dem ersten Klick.',
    description:
      'Kostenlose Ersteinschätzung mit Ampel-System, persönliches Matching und begleitende Programme – entwickelt für Österreich.',
    type: 'website',
    locale: 'de_AT',
    url: 'https://findmytherapy.health/',
  },
  alternates: {
    canonical: 'https://findmytherapy.health/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindMyTherapy – Digitale Orientierung für mentale Gesundheit',
    description:
      'Starte die kostenlose Ersteinschätzung, finde passende Therapeut:innen oder sichere Hilfe in Notfällen.',
    creator: '@findmytherapy',
  },
}

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

export default function HomePage() {
  return (
    <div className="marketing-theme bg-surface text-default">
      <main className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
        <div className="px-3 pt-6 sm:px-4 sm:pt-10 lg:px-8">
          <MarketingHero content={heroContent} />
        </div>

        <ImpactStats
          id="impact"
          stats={impactStats}
          eyebrow="Wissenschaftlich fundiert"
          title="Transparenz und Qualität von Anfang an"
          description="FindMyTherapy basiert auf evidenzbasierten Methoden und wird in enger Zusammenarbeit mit Psychotherapeut:innen entwickelt."
        />

        <AssessmentSection />

        <TherapistSearch />

        <WhySection content={whyContent} />

        <FeatureTabs tabs={featureTabs} />

        <AssessmentExplainer />

        <EarlyAccessSection content={earlyAccessContent} />

        <TeamSection content={teamContent} />

        <FaqAccordion items={faqItems} />

        <ContactCta content={contactCta} />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </div>
  )
}
