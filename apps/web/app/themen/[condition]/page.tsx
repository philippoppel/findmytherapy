import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  mentalHealthConditions,
  getAllConditionSlugs,
  getConditionBySlug,
} from '@/lib/seo/conditions';
import { austrianCities } from '@/lib/seo/cities';
import { BackLink } from '@/app/components/BackLink';

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
      title: 'Thema nicht gefunden | FindMyTherapy',
    };
  }

  return {
    title: `${condition.name} – Hilfe & Therapie finden | FindMyTherapy`,
    description: condition.metaDescription,
    keywords: condition.keywords,
    alternates: {
      canonical: `https://findmytherapy.net/themen/${condition.slug}`,
    },
    openGraph: {
      title: `${condition.name} – Hilfe & Therapie finden`,
      description: condition.metaDescription,
      type: 'website',
      locale: 'de_AT',
      siteName: 'FindMyTherapy',
      url: `https://findmytherapy.net/themen/${condition.slug}`,
      images: [
        {
          url: 'https://findmytherapy.net/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${condition.name} Therapie finden`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${condition.name} – Hilfe & Therapie finden`,
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

  // Schema.org FAQPage for symptoms & treatments
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Was sind typische Symptome bei ${condition.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: condition.symptoms.join(', '),
        },
      },
      {
        '@type': 'Question',
        name: `Wie wird ${condition.name} behandelt?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${condition.name} kann mit verschiedenen Therapiemethoden behandelt werden: ${condition.treatments.join(', ')}. Ein:e spezialisierte:r Therapeut:in kann die beste Behandlung für Ihre individuelle Situation empfehlen.`,
        },
      },
      {
        '@type': 'Question',
        name: `Wo finde ich Hilfe bei ${condition.name} in Österreich?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Bei FindMyTherapy finden Sie spezialisierte Psychotherapeut:innen für ${condition.name} in ganz Österreich. Nutzen Sie unseren Matching-Service, um den passenden Therapeuten zu finden.`,
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
        name: 'Themen',
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <div className="mb-6">
            <BackLink variant="dark" />
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-medium text-primary-100 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/themen" className="hover:text-white transition-colors">
              Themen
            </Link>
            <span>/</span>
            <span className="text-white">{condition.name}</span>
          </nav>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">{condition.name}</h1>
          <p className="text-xl sm:text-2xl text-primary-100 max-w-3xl leading-relaxed">
            {condition.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/triage"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
            >
              Passende:n Therapeut:in finden
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
            <Link
              href="/therapists"
              className="inline-flex items-center px-8 py-4 bg-primary-700 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors border border-primary-500"
            >
              Alle Therapeut:innen ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* Symptoms Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Symptome bei {condition.name}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-3xl">
            {condition.name} kann sich durch verschiedene Symptome zeigen. Wenn mehrere dieser
            Anzeichen über längere Zeit auftreten, kann professionelle Hilfe sinnvoll sein.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {condition.symptoms.map((symptom, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary-600 dark:text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">{symptom}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatments Section */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Behandlungsmöglichkeiten
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-3xl">
            Es gibt verschiedene wissenschaftlich fundierte Therapiemethoden für {condition.name}.
            Die passende Behandlung wird individuell mit Ihrem Therapeuten abgestimmt.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {condition.treatments.map((treatment, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {treatment}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Therapists Section */}
      {therapists.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Spezialisierte Therapeut:innen
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Finden Sie Expert:innen für {condition.name} in Österreich
                </p>
              </div>
              <Link
                href={`/therapists?specialty=${encodeURIComponent(condition.name)}`}
                className="mt-4 sm:mt-0 inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Alle anzeigen
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {therapists.map((therapist) => (
                <Link
                  key={therapist.id}
                  href={`/therapists/${therapist.id}`}
                  className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow group"
                >
                  <div className="aspect-[4/3] relative bg-gray-100 dark:bg-gray-800">
                    {therapist.profileImageUrl ? (
                      <Image
                        src={therapist.profileImageUrl}
                        alt={therapist.displayName || 'Therapeut:in'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-gray-300 dark:text-gray-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {therapist.displayName || 'Therapeut:in'}
                    </h3>
                    {therapist.title && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {therapist.title}
                      </p>
                    )}
                    {therapist.city && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {therapist.city}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-10 text-center">
            Häufige Fragen zu {condition.name}
          </h2>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Was sind typische Symptome bei {condition.name}?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Typische Symptome sind: {condition.symptoms.slice(0, 5).join(', ')}. Diese können
                unterschiedlich stark ausgeprägt sein.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Wie wird {condition.name} behandelt?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {condition.name} kann mit verschiedenen Therapiemethoden behandelt werden:{' '}
                {condition.treatments.join(', ')}. Ein:e spezialisierte:r Therapeut:in kann die
                beste Behandlung für Ihre individuelle Situation empfehlen.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Wo finde ich Hilfe bei {condition.name} in Österreich?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bei FindMyTherapy finden Sie spezialisierte Psychotherapeut:innen für{' '}
                {condition.name} in ganz Österreich. Nutzen Sie unseren{' '}
                <Link
                  href="/triage"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Matching-Service
                </Link>
                , um den passenden Therapeuten zu finden.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Conditions */}
      {relatedConditions.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
              Verwandte Themen
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedConditions.map((related) => (
                <Link
                  key={related!.slug}
                  href={`/themen/${related!.slug}`}
                  className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {related!.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {related!.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* City Links for SEO */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            {condition.name} Therapie nach Stadt
          </h2>
          <div className="flex flex-wrap gap-3">
            {austrianCities.map((city) => (
              <Link
                key={city.slug}
                href={`/stadt/${city.slug}`}
                className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Conditions Links */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Alle Therapiethemen
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {mentalHealthConditions.map((c) => (
              <Link
                key={c.slug}
                href={`/themen/${c.slug}`}
                className={`px-4 py-3 rounded-lg border transition-colors ${
                  c.slug === condition.slug
                    ? 'bg-primary-100 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-300 font-semibold'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Bereit, den ersten Schritt zu machen?
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Finden Sie eine:n spezialisierte:n Therapeut:in für {condition.name}. Unser
            Matching-Service hilft Ihnen dabei, die passende Unterstützung zu finden.
          </p>
          <Link
            href="/triage"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors shadow-lg text-lg"
          >
            Jetzt Therapeut:in finden
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalConditionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </main>
  );
}
