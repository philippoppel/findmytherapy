import type { Metadata } from 'next'
import {
  earlyAccessContent,
  teamContent,
  contactCta,
  getHeroContent,
  getWhyContent,
  getClientBenefits,
  getTherapistBenefits,
  getFAQItems,
} from '../marketing-content'
import { MarketingHero } from '../components/marketing/MarketingHero'
import { WhySection } from '../components/marketing/WhySection'
import { EarlyAccessSection } from '../components/marketing/EarlyAccessSection'
import { TeamSection } from '../components/marketing/TeamSection'
import { FaqAccordion } from '../components/marketing/FaqAccordion'
import { ContactCta } from '../components/marketing/ContactCta'
import { AssessmentSection } from '../components/marketing/AssessmentSection'
import { TherapistSearchSection } from '../components/therapist-search/TherapistSearchSection'
import { ClientBenefits } from '../components/marketing/ClientBenefits'
import { TherapistBenefits } from '../components/marketing/TherapistBenefits'
import { FeatureGate } from '@/components/FeatureGate'
import { FEATURES } from '@/lib/features'

// Force dynamic rendering to prevent database access during build
// Homepage includes dynamic therapist data that requires database connection
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: FEATURES.ASSESSMENT
    ? 'FindMyTherapy – Digitale Ersteinschätzung & Therapeut:innen-Matching'
    : 'FindMyTherapy – Therapeut:innen-Matching & Kurse',
  description: FEATURES.ASSESSMENT
    ? 'Finde in wenigen Minuten heraus, welche Unterstützung dir guttut. Mit Ampel-Triage, persönlichen Empfehlungen, Kursen und einer Plattform für Therapeut:innen.'
    : 'Finde passende Therapeut:innen in Österreich. Mit verifizierten Profilen, persönlichen Empfehlungen und professionellen Kursen.',
  keywords: FEATURES.ASSESSMENT
    ? [
        'digitale Ersteinschätzung',
        'PHQ-9 Erklärung',
        'GAD-7 Erklärung',
        'Therapeut:in finden Österreich',
        'mentale Gesundheit Matching',
      ]
    : [
        'Therapeut:in finden Österreich',
        'mentale Gesundheit Matching',
        'Psychotherapie Österreich',
        'Online Therapie finden',
      ],
  openGraph: {
    title: 'FindMyTherapy – Klarheit ab dem ersten Klick.',
    description: FEATURES.ASSESSMENT
      ? 'Kostenlose Ersteinschätzung mit Ampel-System, persönliches Matching und begleitende Programme – entwickelt für Österreich.'
      : 'Finde passende Therapeut:innen in Österreich. Verifizierte Profile, persönliches Matching und begleitende Programme.',
    type: 'website',
    locale: 'de_AT',
    url: 'https://findmytherapy.net/',
  },
  alternates: {
    canonical: 'https://findmytherapy.net/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindMyTherapy – Digitale Orientierung für mentale Gesundheit',
    description: FEATURES.ASSESSMENT
      ? 'Starte die kostenlose Ersteinschätzung, finde passende Therapeut:innen oder sichere Hilfe in Notfällen.'
      : 'Finde passende Therapeut:innen in Österreich mit verifizierten Profilen und persönlichem Matching.',
    creator: '@findmytherapy',
  },
}

export default function HomePage() {
  // Get filtered content based on enabled features
  const heroContent = getHeroContent()
  const whyContent = getWhyContent()
  const clientBenefits = getClientBenefits()
  const therapistBenefits = getTherapistBenefits()
  const faqItems = getFAQItems()

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

  return (
    <div className="marketing-theme bg-surface text-default">
      <main className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
        <div className="px-3 pt-6 sm:px-4 sm:pt-10 lg:px-8">
          <MarketingHero content={heroContent} />
        </div>

        <FeatureGate feature="ASSESSMENT">
          <AssessmentSection />
        </FeatureGate>

        <ClientBenefits content={clientBenefits} />

        <TherapistSearchSection />

        <TherapistBenefits content={therapistBenefits} />

        <WhySection content={whyContent} />

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
