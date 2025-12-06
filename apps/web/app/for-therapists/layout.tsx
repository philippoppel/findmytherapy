import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Für Therapeut:innen – FindMyTherapy',
  description:
    'Professionelle Microsite für Ihre Praxis. SEO-optimiert für maximale Sichtbarkeit. Kostenlos starten.',
  openGraph: {
    title: 'Für Therapeut:innen – FindMyTherapy',
    description:
      'Professionelle Microsite für Ihre Praxis. SEO-optimiert für maximale Sichtbarkeit.',
    type: 'website',
    url: 'https://findmytherapy.net/for-therapists',
    locale: 'de_AT',
    alternateLocale: 'en',
    siteName: 'FindMyTherapy',
  },
  alternates: {
    canonical: 'https://findmytherapy.net/for-therapists',
    languages: {
      'de-AT': 'https://findmytherapy.net/for-therapists',
      'en': 'https://findmytherapy.net/for-therapists',
      'x-default': 'https://findmytherapy.net/for-therapists',
    },
  },
};

// Service structured data for SEO
const serviceStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'FindMyTherapy Therapeuten-Microsite',
  description:
    'Professionelle, SEO-optimierte Microsite für Psychotherapeut:innen. Erhöhen Sie Ihre Online-Sichtbarkeit und gewinnen Sie neue Klient:innen.',
  provider: {
    '@type': 'Organization',
    name: 'FindMyTherapy',
    url: 'https://findmytherapy.net',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Österreich',
  },
  serviceType: 'Digital Marketing für Therapeuten',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
    description: 'Kostenlos starten',
  },
  url: 'https://findmytherapy.net/for-therapists',
};

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://findmytherapy.net' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Für Therapeut:innen',
      item: 'https://findmytherapy.net/for-therapists',
    },
  ],
};

export default function ForTherapistsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
    </>
  );
}
