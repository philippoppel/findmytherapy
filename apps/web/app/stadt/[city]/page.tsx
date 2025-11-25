import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MapPin, Users, Phone, ArrowRight, CheckCircle2, Shield, Clock } from 'lucide-react'
import { austrianCities, getCityBySlug, getAllCitySlugs } from '@/lib/seo/cities'
import { prisma } from '@/lib/prisma'
import { Button } from '@mental-health/ui'

type CityPageProps = {
  params: {
    city: string
  }
}

export function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({ city }))
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const city = getCityBySlug(params.city)

  if (!city) {
    return {
      title: 'Stadt nicht gefunden | FindMyTherapy',
    }
  }

  return {
    title: `Psychotherapie ${city.name} – Therapeut:innen finden | FindMyTherapy`,
    description: city.metaDescription,
    keywords: city.keywords,
    alternates: {
      canonical: `https://findmytherapy.net/stadt/${city.slug}`,
    },
    openGraph: {
      title: `Psychotherapie ${city.name} – Therapeut:innen finden`,
      description: city.metaDescription,
      type: 'website',
      locale: 'de_AT',
      siteName: 'FindMyTherapy',
      url: `https://findmytherapy.net/stadt/${city.slug}`,
      images: [
        {
          url: 'https://findmytherapy.net/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Psychotherapie in ${city.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Psychotherapie ${city.name}`,
      description: city.metaDescription,
      images: ['https://findmytherapy.net/images/og-image.jpg'],
    },
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const city = getCityBySlug(params.city)

  if (!city) {
    notFound()
  }

  // Fetch therapists in this city
  let therapistCount = 0
  let featuredTherapists: Array<{
    id: string
    displayName: string | null
    title: string | null
    profileImageUrl: string | null
    specialties: string[]
    micrositeSlug: string | null
  }> = []

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
    })

    featuredTherapists = therapists
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
    })
  } catch (error) {
    console.warn('Could not fetch therapists for city page:', error)
  }

  // Common specialties for this city
  const commonSpecialties = [
    'Depression',
    'Angststörungen',
    'Burnout',
    'Trauma & PTBS',
    'Beziehungsprobleme',
    'Essstörungen',
  ]

  // Schema.org structured data
  const citySchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: `Psychotherapie in ${city.name}`,
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
      name: `Psychotherapeut:innen in ${city.name}`,
      numberOfItems: therapistCount,
      itemListElement: featuredTherapists.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Person',
          name: t.displayName,
          jobTitle: t.title || 'Psychotherapeut:in',
          url: t.micrositeSlug
            ? `https://findmytherapy.net/t/${t.micrositeSlug}`
            : `https://findmytherapy.net/therapists/${t.id}`,
        },
      })),
    },
  }

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
        name: 'Therapeut:innen',
        item: 'https://findmytherapy.net/therapists',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: city.name,
        item: `https://findmytherapy.net/stadt/${city.slug}`,
      },
    ],
  }

  // FAQ data for this city
  const faqItems = [
    {
      question: `Wie finde ich eine:n Psychotherapeut:in in ${city.name}?`,
      answer: `Bei FindMyTherapy kannst du gezielt nach Therapeut:innen in ${city.name} suchen. Nutze unsere Filter für Spezialisierungen, Therapieformen und Verfügbarkeit. Du kannst auch unsere digitale Ersteinschätzung machen, um passende Empfehlungen zu erhalten.`,
    },
    {
      question: `Was kostet Psychotherapie in ${city.name}?`,
      answer: `Die Kosten für Psychotherapie in ${city.name} variieren je nach Therapeut:in und Setting. Eine Einheit (50 Min.) kostet typischerweise zwischen 80€ und 150€. Mit Kassenplatz oder Kostenzuschuss der ÖGK können die Kosten deutlich reduziert werden.`,
    },
    {
      question: `Gibt es Kassenplätze für Psychotherapie in ${city.name}?`,
      answer: `Ja, in ${city.name} gibt es Kassenplätze für Psychotherapie. Die Anzahl ist begrenzt und es kann Wartezeiten geben. Alternativ bieten viele Krankenkassen Kostenzuschüsse für Wahlärzt:innen. Bei FindMyTherapy siehst du, welche Therapeut:innen Kassenplätze anbieten.`,
    },
    {
      question: `Bieten Therapeut:innen in ${city.name} auch Online-Therapie an?`,
      answer: `Ja, viele Therapeut:innen in ${city.name} bieten auch Online-Sitzungen per Video an. Das ermöglicht flexible Termine und spart Anfahrtszeit. Bei FindMyTherapy kannst du gezielt nach Online-Angeboten filtern.`,
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(citySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm text-primary-200">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/therapists" className="hover:text-white transition-colors">
                    Therapeut:innen
                  </Link>
                </li>
                <li>/</li>
                <li className="text-white font-medium">{city.name}</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary-300" />
                <span className="text-primary-200">{city.state}, Österreich</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Psychotherapeut:innen in {city.name} finden
              </h1>

              <p className="text-xl text-primary-100 mb-8">{city.description}</p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary-300" />
                  <span>
                    {therapistCount > 0 ? `${therapistCount} Therapeut:innen` : 'Therapeut:innen verfügbar'}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary-300" />
                  <span>Verifizierte Profile</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary-300" />
                  <span>Online & vor Ort</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                  <Link href={`/therapists?city=${encodeURIComponent(city.name)}`}>
                    Therapeut:innen in {city.name} finden
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Link href="/triage">Ersteinschätzung starten</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Specialties Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Häufige Therapiebereiche in {city.name}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Unsere Therapeut:innen in {city.name} sind auf verschiedene Bereiche spezialisiert:
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {commonSpecialties.map((specialty) => (
                <Link
                  key={specialty}
                  href={`/therapists?city=${encodeURIComponent(city.name)}&specialty=${encodeURIComponent(specialty)}`}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <span className="font-medium text-gray-900">{specialty}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Therapists */}
        {featuredTherapists.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Therapeut:innen in {city.name}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Entdecke qualifizierte Psychotherapeut:innen in deiner Nähe:
              </p>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredTherapists.map((therapist) => (
                  <Link
                    key={therapist.id}
                    href={
                      therapist.micrositeSlug
                        ? `/t/${therapist.micrositeSlug}`
                        : `/therapists/${therapist.id}`
                    }
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {therapist.profileImageUrl ? (
                          <Image
                            src={therapist.profileImageUrl}
                            alt={therapist.displayName || 'Therapeut:in'}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-primary-600">
                            {therapist.displayName?.charAt(0) || 'T'}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {therapist.displayName || 'Therapeut:in'}
                        </h3>
                        <p className="text-sm text-gray-600">{therapist.title || 'Psychotherapeut:in'}</p>
                        {therapist.specialties?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {therapist.specialties.slice(0, 2).map((s) => (
                              <span
                                key={s}
                                className="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button asChild variant="outline">
                  <Link href={`/therapists?city=${encodeURIComponent(city.name)}`}>
                    Alle Therapeut:innen in {city.name} anzeigen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Häufige Fragen zu Psychotherapie in {city.name}
            </h2>

            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Cities */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Psychotherapie in anderen Städten
            </h2>

            <div className="flex flex-wrap gap-3">
              {austrianCities
                .filter((c) => c.slug !== city.slug)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/stadt/${c.slug}`}
                    className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary-300 hover:text-primary-700 transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bereit für den ersten Schritt?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Finde jetzt die passende therapeutische Unterstützung in {city.name}. Unsere digitale
              Ersteinschätzung hilft dir, den richtigen Ansatz zu finden.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                <Link href="/triage">
                  <Phone className="mr-2 h-5 w-5" />
                  Ersteinschätzung starten
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Link href={`/therapists?city=${encodeURIComponent(city.name)}`}>
                  Therapeut:innen durchsuchen
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
