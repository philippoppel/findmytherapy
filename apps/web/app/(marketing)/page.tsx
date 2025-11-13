import type { Metadata } from 'next'
import {
  getHeroContent,
  getClientBenefits,
  getTherapistBenefits,
  getFAQItems,
  getContactCta,
} from '../marketing-content'
import { MarketingHero } from '../components/marketing/MarketingHero'
import { FaqAccordion } from '../components/marketing/FaqAccordion'
import { ContactCta } from '../components/marketing/ContactCta'
import { AssessmentSection } from '../components/marketing/AssessmentSection'
import { TherapistSearchSection } from '../components/therapist-search/TherapistSearchSection'
import { ClientBenefits } from '../components/marketing/ClientBenefits'
import { TherapistBenefits } from '../components/marketing/TherapistBenefits'
import { BlogFeatureSection } from '../components/blog/BlogFeatureSection'
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
        'Psychotherapeut Wien',
        'Online Therapie Österreich',
        'Depression Test',
        'Angststörung Test',
        'Therapeutensuche',
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
    siteName: 'FindMyTherapy',
    images: [
      {
        url: 'https://findmytherapy.net/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FindMyTherapy – Digitale Ersteinschätzung & Therapeut:innen-Matching für Österreich',
      },
    ],
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
    site: '@findmytherapy',
    images: ['https://findmytherapy.net/images/og-image.jpg'],
  },
}

export default function HomePage() {
  // Get filtered content based on enabled features
  const heroContent = getHeroContent()
  const clientBenefits = getClientBenefits()
  const therapistBenefits = getTherapistBenefits()
  const faqItems = getFAQItems()
  const contactCta = getContactCta()

  // Structured Data for SEO
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

  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FindMyTherapy',
    url: 'https://findmytherapy.net',
    logo: 'https://findmytherapy.net/images/logo.png',
    description:
      'FindMyTherapy ist eine evidenzbasierte Plattform für mentale Gesundheit in Österreich. Wir bieten digitale Ersteinschätzung mit validierten Fragebögen (PHQ-9, GAD-7), Therapeuten-Matching und therapeutisch fundierte Online-Kurse.',
    foundingDate: '2024',
    areaServed: {
      '@type': 'Country',
      name: 'Österreich',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'hello@findmytherapy.net',
      availableLanguage: ['de', 'de-AT'],
    },
    sameAs: [
      'https://www.linkedin.com/company/findmytherapy',
      'https://www.instagram.com/findmytherapy',
    ],
  }

  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FindMyTherapy',
    url: 'https://findmytherapy.net',
    description:
      'Digitale Ersteinschätzung & Therapeut:innen-Matching für mentale Gesundheit in Österreich',
    inLanguage: 'de-AT',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://findmytherapy.net/therapists?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const medicalWebPageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: 'FindMyTherapy – Digitale Ersteinschätzung & Therapeut:innen-Matching',
    description:
      'Kostenlose Ersteinschätzung mit validierten Fragebögen (PHQ-9, GAD-7), Therapeuten-Vermittlung und therapeutisch fundierte Online-Kurse für mentale Gesundheit in Österreich.',
    url: 'https://findmytherapy.net',
    inLanguage: 'de-AT',
    isPartOf: {
      '@type': 'WebSite',
      url: 'https://findmytherapy.net',
    },
    about: {
      '@type': 'MedicalCondition',
      name: 'Mental Health',
    },
    audience: {
      '@type': 'PeopleAudience',
      geographicArea: {
        '@type': 'Country',
        name: 'Österreich',
      },
    },
    specialty: 'Psychotherapy',
  }

  const videoObjectStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'FindMyTherapy – Professionelle Therapiesitzung',
    description:
      'Entdecke FindMyTherapy: Die Plattform für digitale Ersteinschätzung und Therapeuten-Matching in Österreich. Mit validierten Fragebögen und professioneller Unterstützung.',
    thumbnailUrl: 'https://findmytherapy.net/images/therapists/therapy-1.jpg',
    contentUrl: 'https://findmytherapy.net/videos/hero-therapy.mp4',
    uploadDate: '2024-01-01',
    duration: 'PT30S',
    inLanguage: 'de-AT',
    about: 'Mentale Gesundheit und Psychotherapie in Österreich',
  }

  const breadcrumbListStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://findmytherapy.net',
      },
    ],
  }

  return (
    <div className="marketing-theme bg-surface text-default">
      <main className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
        <div className="px-3 pt-6 sm:px-4 sm:pt-10 lg:px-8">
          <MarketingHero content={heroContent} />
        </div>

        {/* Blog Feature Section - Verified knowledge from experts */}
        <BlogFeatureSection />

        <FeatureGate feature="ASSESSMENT">
          <AssessmentSection />
        </FeatureGate>

        <ClientBenefits content={clientBenefits} />

        <TherapistSearchSection />

        <TherapistBenefits content={therapistBenefits} />

        <FaqAccordion items={faqItems} />

        <ContactCta content={contactCta} />
      </main>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </div>
  )
}
