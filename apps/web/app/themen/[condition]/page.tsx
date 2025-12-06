import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  mentalHealthConditions,
  getAllConditionSlugs,
  getConditionBySlug,
} from '@/lib/seo/conditions';
import { austrianCities } from '@/lib/seo/cities';
import { ConditionPageContent } from './ConditionPageContent';

type ConditionPageProps = {
  params: {
    condition: string;
  };
};

export function generateStaticParams() {
  return getAllConditionSlugs().map((slug) => ({
    condition: slug,
  }));
}

export function generateMetadata({ params }: ConditionPageProps): Metadata {
  const condition = getConditionBySlug(params.condition);

  if (!condition) {
    return {
      title: 'Topic not found | FindMyTherapy',
    };
  }

  return {
    title: `${condition.name} – Find Help & Therapy | FindMyTherapy`,
    description: condition.metaDescription,
    keywords: condition.keywords,
    alternates: {
      canonical: `https://findmytherapy.net/themen/${condition.slug}`,
      languages: {
        'de-AT': `https://findmytherapy.net/themen/${condition.slug}`,
        'en': `https://findmytherapy.net/themen/${condition.slug}`,
        'x-default': `https://findmytherapy.net/themen/${condition.slug}`,
      },
    },
    openGraph: {
      title: `${condition.name} – Find Help & Therapy`,
      description: condition.metaDescription,
      type: 'website',
      locale: 'de_AT',
      alternateLocale: 'en',
      siteName: 'FindMyTherapy',
      url: `https://findmytherapy.net/themen/${condition.slug}`,
      images: [
        {
          url: 'https://findmytherapy.net/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${condition.name} Therapy`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${condition.name} – Find Help & Therapy`,
      description: condition.metaDescription,
      images: ['https://findmytherapy.net/images/og-image.jpg'],
    },
  };
}

export default async function ConditionPage({ params }: ConditionPageProps) {
  const condition = getConditionBySlug(params.condition);

  if (!condition) {
    notFound();
  }

  // Fetch therapists specializing in this condition
  let therapists: Array<{
    id: string;
    displayName: string | null;
    title: string | null;
    city: string | null;
    profileImageUrl: string | null;
    specialties: string[];
  }> = [];

  try {
    therapists = await prisma.therapistProfile.findMany({
      where: {
        status: 'VERIFIED',
        isPublic: true,
        deletedAt: null,
        specialties: {
          hasSome: [condition.name, condition.shortName, ...condition.keywords.slice(0, 3)],
        },
      },
      select: {
        id: true,
        displayName: true,
        title: true,
        city: true,
        profileImageUrl: true,
        specialties: true,
      },
      take: 12,
    });
  } catch (error) {
    console.warn('Could not fetch therapists for condition page:', error);
  }

  // Get related conditions
  const relatedConditions = condition.relatedConditions
    .map((slug) => getConditionBySlug(slug))
    .filter(Boolean);

  // Schema.org MedicalCondition
  const medicalConditionSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    '@id': `https://findmytherapy.net/themen/${condition.slug}#condition`,
    name: condition.name,
    description: condition.description,
    url: `https://findmytherapy.net/themen/${condition.slug}`,
    signOrSymptom: condition.symptoms.map((symptom) => ({
      '@type': 'MedicalSignOrSymptom',
      name: symptom,
    })),
    possibleTreatment: condition.treatments.map((treatment) => ({
      '@type': 'MedicalTherapy',
      name: treatment,
    })),
    relevantSpecialty: {
      '@type': 'MedicalSpecialty',
      name: 'Psychotherapy',
    },
  };

  // Schema.org FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What are typical symptoms of ${condition.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: condition.symptoms.join(', '),
        },
      },
      {
        '@type': 'Question',
        name: `How is ${condition.name} treated?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${condition.name} can be treated with various therapy methods: ${condition.treatments.join(', ')}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Where can I find help for ${condition.name} in Austria?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `At FindMyTherapy you can find specialized psychotherapists for ${condition.name} throughout Austria.`,
        },
      },
    ],
  };

  // Breadcrumb Schema
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
        name: 'Topics',
        item: 'https://findmytherapy.net/themen',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: condition.name,
        item: `https://findmytherapy.net/themen/${condition.slug}`,
      },
    ],
  };

  const allConditions = mentalHealthConditions.map((c) => ({
    name: c.name,
    slug: c.slug,
  }));

  const cities = austrianCities.map((c) => ({
    name: c.name,
    slug: c.slug,
  }));

  return (
    <ConditionPageContent
      condition={condition}
      therapists={therapists}
      relatedConditions={relatedConditions}
      allConditions={allConditions}
      cities={cities}
      structuredData={{ medicalConditionSchema, faqSchema, breadcrumbSchema }}
    />
  );
}
