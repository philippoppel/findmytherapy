import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { austrianCities, getCityBySlug, getAllCitySlugs } from '@/lib/seo/cities';
import { prisma } from '@/lib/prisma';
import { CityPageContent } from './CityPageContent';

type CityPageProps = {
  params: {
    city: string;
  };
};

export function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const city = getCityBySlug(params.city);

  if (!city) {
    return {
      title: 'City not found | FindMyTherapy',
    };
  }

  return {
    title: `Psychotherapy ${city.name} – Find Therapists | FindMyTherapy`,
    description: city.metaDescription,
    keywords: city.keywords,
    alternates: {
      canonical: `https://findmytherapy.net/stadt/${city.slug}`,
      languages: {
        'de-AT': `https://findmytherapy.net/stadt/${city.slug}`,
        'en': `https://findmytherapy.net/stadt/${city.slug}`,
        'x-default': `https://findmytherapy.net/stadt/${city.slug}`,
      },
    },
    openGraph: {
      title: `Psychotherapy ${city.name} – Find Therapists`,
      description: city.metaDescription,
      type: 'website',
      locale: 'de_AT',
      alternateLocale: 'en',
      siteName: 'FindMyTherapy',
      url: `https://findmytherapy.net/stadt/${city.slug}`,
      images: [
        {
          url: 'https://findmytherapy.net/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Psychotherapy in ${city.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Psychotherapy ${city.name}`,
      description: city.metaDescription,
      images: ['https://findmytherapy.net/images/og-image.jpg'],
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const city = getCityBySlug(params.city);

  if (!city) {
    notFound();
  }

  // Fetch therapists in this city
  let therapistCount = 0;
  let featuredTherapists: Array<{
    id: string;
    displayName: string | null;
    title: string | null;
    profileImageUrl: string | null;
    specialties: string[];
    micrositeSlug: string | null;
  }> = [];

  try {
    const therapists = await prisma.therapistProfile.findMany({
      where: {
        status: 'VERIFIED',
        isPublic: true,
        deletedAt: null,
        city: {
          contains: city.name,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        displayName: true,
        title: true,
        profileImageUrl: true,
        specialties: true,
        micrositeSlug: true,
      },
      take: 6,
    });

    featuredTherapists = therapists;
    therapistCount = await prisma.therapistProfile.count({
      where: {
        status: 'VERIFIED',
        isPublic: true,
        deletedAt: null,
        city: {
          contains: city.name,
          mode: 'insensitive',
        },
      },
    });
  } catch (error) {
    console.warn('Could not fetch therapists for city page:', error);
  }

  // Schema.org structured data
  const citySchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: `Psychotherapy in ${city.name}`,
    description: city.metaDescription,
    url: `https://findmytherapy.net/stadt/${city.slug}`,
    about: {
      '@type': 'MedicalSpecialty',
      name: 'Psychotherapy',
    },
    audience: {
      '@type': 'PeopleAudience',
      geographicArea: {
        '@type': 'City',
        name: city.name,
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: city.state,
        },
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      name: `Psychotherapists in ${city.name}`,
      numberOfItems: therapistCount,
      itemListElement: featuredTherapists.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Person',
          name: t.displayName,
          jobTitle: t.title || 'Psychotherapist',
          url: t.micrositeSlug
            ? `https://findmytherapy.net/t/${t.micrositeSlug}`
            : `https://findmytherapy.net/therapists/${t.id}`,
        },
      })),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://findmytherapy.net',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Therapists',
        item: 'https://findmytherapy.net/therapists',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: city.name,
        item: `https://findmytherapy.net/stadt/${city.slug}`,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I find a psychotherapist in ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `At FindMyTherapy you can specifically search for therapists in ${city.name}. Use our filters for specializations, therapy types and availability.`,
        },
      },
      {
        '@type': 'Question',
        name: `What does psychotherapy cost in ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The cost of psychotherapy in ${city.name} varies. A session (50 min.) typically costs between €80 and €150.`,
        },
      },
    ],
  };

  const otherCities = austrianCities.filter((c) => c.slug !== city.slug);

  return (
    <CityPageContent
      city={city}
      therapistCount={therapistCount}
      featuredTherapists={featuredTherapists}
      otherCities={otherCities}
      structuredData={{ citySchema, breadcrumbSchema, faqSchema }}
    />
  );
}
