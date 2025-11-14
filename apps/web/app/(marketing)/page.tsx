import type { Metadata } from 'next'
import { getHeroContent, getFAQItems, getContactCta, teamContent } from '../marketing-content'
import { MarketingHero } from '../components/marketing/MarketingHero'
import { FaqAccordion } from '../components/marketing/FaqAccordion'
import { ContactCta } from '../components/marketing/ContactCta'
import { TwoPillarSection } from '../components/marketing/TwoPillarSection'
import { AboutSection } from '../components/marketing/AboutSection'
import { TherapistFinderSection } from '../components/marketing/TherapistFinderSection'

// Force dynamic rendering to prevent database access during build
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'FindMyTherapy – SEO-optimierte Therapeuten-Profile & Expert:innen-Wissen',
  description:
    'Entdecke gratis Wissen von anerkannten Psychotherapeut:innen für Soforthilfe. Finde verifizierte Therapeut:innen mit SEO-optimierten Profilen. Zwei Wege zu mentaler Gesundheit.',
  keywords: [
    'Therapeut:in finden Österreich',
    'Psychotherapeut SEO',
    'mentale Gesundheit Wissen',
    'Psychotherapie Artikel',
    'Therapeuten-Microsite',
    'Online Therapie Österreich',
    'Psychotherapeut Profil',
    'Therapeutensuche',
    'Psychologie Ratgeber',
  ],
  openGraph: {
    title: 'FindMyTherapy – Expert:innen-Wissen & SEO-optimierte Therapeuten-Profile',
    description:
      'Gratis Wissen von Psychotherapeut:innen für Soforthilfe. Verifizierte Therapeut:innen mit professionellen, SEO-optimierten Microsites.',
    type: 'website',
    locale: 'de_AT',
    url: 'https://findmytherapy.net/',
    siteName: 'FindMyTherapy',
    images: [
      {
        url: 'https://findmytherapy.net/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FindMyTherapy – Expert:innen-Wissen & SEO-optimierte Therapeuten-Profile für Österreich',
      },
    ],
  },
  alternates: {
    canonical: 'https://findmytherapy.net/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindMyTherapy – Wissen & Therapeut:innen-Matching',
    description:
      'Gratis Expert:innen-Wissen für Soforthilfe. Finde verifizierte Therapeut:innen mit SEO-optimierten Profilen.',
    creator: '@findmytherapy',
    site: '@findmytherapy',
    images: ['https://findmytherapy.net/images/og-image.jpg'],
  },
}

export default function HomePage() {
  // Get content for simplified homepage
  const heroContent = getHeroContent()
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
      'FindMyTherapy ist eine evidenzbasierte Plattform für mentale Gesundheit in Österreich. Wir bieten gratis Wissen von anerkannten Psychotherapeut:innen und SEO-optimierte Therapeuten-Profile mit individuellen Microsites.',
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
      'Expert:innen-Wissen & SEO-optimierte Therapeuten-Profile für mentale Gesundheit in Österreich',
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
    name: 'FindMyTherapy – Expert:innen-Wissen & Therapeuten-Matching',
    description:
      'Gratis Wissen von anerkannten Psychotherapeut:innen für Soforthilfe. Finde verifizierte Therapeut:innen mit SEO-optimierten Profilen und individuellen Microsites.',
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
      'Entdecke FindMyTherapy: Die Plattform für Expert:innen-Wissen und Therapeuten-Matching in Österreich. Mit gratis Ratgebern von anerkannten Psychotherapeut:innen.',
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

  // Team Members Person Structured Data
  const teamMembersStructuredData = teamContent.members.map((member) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.role,
    description: member.focus,
    image: `https://findmytherapy.net${member.image}`,
    worksFor: {
      '@type': 'Organization',
      name: 'FindMyTherapy',
      url: 'https://findmytherapy.net',
    },
    url: 'https://findmytherapy.net',
  }))

  return (
    <div className="marketing-theme bg-surface text-default">
      <main className="flex flex-col">
        {/* Hero Section */}
        <div className="px-3 pt-6 sm:px-4 sm:pt-10 lg:px-8">
          <MarketingHero content={heroContent} />
        </div>

        {/* Two Pillar Section - Knowledge Hub & Therapist SEO Showcase */}
        <TwoPillarSection />

        {/* About Section - Who we are & Trust */}
        <AboutSection />

        {/* On-page Therapist Directory */}
        <TherapistFinderSection />

        {/* FAQ Section */}
        <div className="px-4 sm:px-6 lg:px-8">
          <FaqAccordion items={faqItems} />
        </div>

        {/* Contact CTA */}
        <div className="px-4 sm:px-6 lg:px-8">
          <ContactCta content={contactCta} />
        </div>
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
      {/* Team Members Person Schemas */}
      {teamMembersStructuredData.map((member, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(member) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </div>
  )
}
