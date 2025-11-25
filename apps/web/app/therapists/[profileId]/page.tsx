import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Calendar,
  CalendarClock,
  CheckCircle2,
  Clock,
  Euro,
  GraduationCap,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  Users
} from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { Button } from '@mental-health/ui'
import { formatCurrencyInput } from '../../../lib/therapist/setcard'
import { BackButton } from './BackButton'
import { FEATURES } from '@/lib/features'

type TherapistProfilePageProps = {
  params: {
    profileId: string
  }
  searchParams?: {
    from?: string
  }
}

const formatCurrencyRange = (min?: number | null, max?: number | null) => {
  const formattedMin = formatCurrencyInput(min)
  const formattedMax = formatCurrencyInput(max)

  if (!formattedMin && !formattedMax) {
    return 'Auf Anfrage'
  }

  if (formattedMin && formattedMax) {
    return `${formattedMin} € – ${formattedMax} €`
  }

  return `${formattedMin || formattedMax} €`
}

const formatList = (values?: string[] | null) => {
  if (!values || values.length === 0) {
    return '–'
  }

  return values.join(', ')
}

export async function generateMetadata({ params }: TherapistProfilePageProps) {
  const profile = await prisma.therapistProfile.findUnique({
    where: { id: params.profileId },
    select: {
      displayName: true,
      headline: true,
      title: true,
      isPublic: true,
      profileImageUrl: true,
      city: true,
      country: true,
      specialties: true,
      modalities: true,
    },
  })

  if (!profile || !profile.isPublic) {
    return {
      title: 'Therapeut:in nicht gefunden',
    }
  }

  const title = `${profile.displayName ?? 'Therapeut:in'}${profile.title ? ` - ${profile.title}` : ''} | FindMyTherapy`
  const description = profile.headline
    ?? `Psychotherapeut:in ${profile.displayName} aus ${profile.city ?? profile.country ?? 'Österreich'}. Jetzt Erstgespräch vereinbaren.`

  const keywords = [
    'Psychotherapie',
    profile.city,
    profile.country,
    profile.displayName,
    ...(profile.specialties ?? []),
    ...(profile.modalities ?? []),
  ].filter(Boolean)

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: profile.displayName ?? 'Therapeut:in' }],
    alternates: {
      canonical: `https://findmytherapy.net/therapists/${params.profileId}`,
    },
    openGraph: {
      title,
      description,
      type: 'profile',
      locale: 'de_AT',
      siteName: 'FindMyTherapy',
      url: `https://findmytherapy.net/therapists/${params.profileId}`,
      images: profile.profileImageUrl
        ? [
            {
              url: profile.profileImageUrl,
              width: 400,
              height: 400,
              alt: `${profile.displayName} - Psychotherapeut:in`,
            },
          ]
        : [
            {
              url: 'https://findmytherapy.net/images/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'FindMyTherapy - Therapeut:innen finden',
            },
          ],
    },
    twitter: {
      card: profile.profileImageUrl ? 'summary' : 'summary_large_image',
      title,
      description,
      images: profile.profileImageUrl
        ? [profile.profileImageUrl]
        : ['https://findmytherapy.net/images/og-image.jpg'],
    },
  }
}

export default async function TherapistProfilePage({ params, searchParams }: TherapistProfilePageProps) {
  const profile = await prisma.therapistProfile.findUnique({
    where: { id: params.profileId },
    include: {
      user: {
        select: {
          email: true,
        },
      },
      courses: {
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
        },
      },
    },
  })

  if (!profile || !profile.isPublic) {
    notFound()
  }

  // Redirect to microsite if available and published (only for verified profiles)
  if (profile.micrositeSlug && profile.micrositeStatus === 'PUBLISHED' && profile.status === 'VERIFIED') {
    redirect(`/t/${profile.micrositeSlug}`)
  }

  const contactHref = profile.user?.email ? `mailto:${profile.user.email}` : '/contact'
  const experience = profile.yearsExperience ? `${profile.yearsExperience} Jahre` : undefined
  const fromTriage = searchParams?.from === 'triage'

  // Schema.org structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': ['Person', 'MedicalBusiness'],
    '@id': `https://findmytherapy.net/therapists/${params.profileId}`,
    name: profile.displayName,
    jobTitle: profile.title ?? 'Psychotherapeut:in',
    description: profile.headline ?? profile.about?.substring(0, 200),
    image: profile.profileImageUrl,
    url: `https://findmytherapy.net/therapists/${params.profileId}`,
    medicalSpecialty: 'Psychotherapy',
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.city,
      addressCountry: profile.country ?? 'AT',
    },
    areaServed: profile.online
      ? [{ '@type': 'Country', name: 'Österreich' }, 'Online']
      : { '@type': 'City', name: profile.city },
    knowsAbout: profile.specialties,
    knowsLanguage: profile.languages,
    priceRange: profile.priceMin || profile.priceMax
      ? `${profile.priceMin ?? '?'}€ - ${profile.priceMax ?? '?'}€`
      : undefined,
    availableService: (profile.modalities ?? []).map((modality) => ({
      '@type': 'MedicalTherapy',
      name: modality,
    })),
  }

  return (
    <>
      {/* Schema.org JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {fromTriage ? (
              <BackButton className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                ← Zurück zu deinen Empfehlungen
              </BackButton>
            ) : (
              <Link
                href="/therapists"
                prefetch={false}
                className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
              >
                ← Zurück zur Übersicht
              </Link>
            )}
            <Link
              href="/"
              prefetch={false}
              className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
            >
              Zur Startseite
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-1000/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            {/* Left: Main Info */}
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Profile Image */}
                <div className="relative">
                  <div className="relative h-32 w-32 md:h-40 md:w-40 overflow-hidden rounded-2xl border-4 border-white/20 shadow-2xl ring-4 ring-white/10">
                    {profile.profileImageUrl ? (
                      <Image
                        src={profile.profileImageUrl}
                        alt={`Portrait von ${profile.displayName ?? 'Therapeut:in'}`}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover object-center"
                        sizes="(max-width: 768px) 128px, 200px"
                        quality={95}
                      />
                    ) : (
                      <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-400 via-primary-600 to-primary-800 overflow-hidden">
                        {/* Decorative background pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full blur-2xl" />
                          <div className="absolute bottom-0 right-0 w-20 h-20 bg-white rounded-full blur-2xl" />
                        </div>
                        {/* Initial with professional styling */}
                        <div className="relative flex flex-col items-center justify-center">
                          <div className="text-5xl md:text-6xl font-bold text-white mb-1">
                            {profile.displayName?.charAt(0)?.toUpperCase() ?? 'T'}
                          </div>
                          {profile.title && (
                            <div className="text-[10px] md:text-xs text-white/80 font-medium uppercase tracking-wider">
                              Therapeut:in
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {profile.status === 'VERIFIED' && (
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                      <BadgeCheck className="h-6 w-6 text-primary-600" />
                    </div>
                  )}
                </div>

                {/* Name & Title */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-4xl md:text-5xl font-bold text-white">
                        {profile.displayName ?? 'Therapeut:in'}
                      </h1>
                      {profile.status === 'VERIFIED' && (
                        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                          <ShieldCheck className="h-4 w-4" />
                          Verifiziert
                        </div>
                      )}
                    </div>
                    <p className="text-lg md:text-xl text-primary-100 font-medium mb-3">
                      {profile.title ?? 'Psychotherapie'}
                    </p>
                    {profile.headline && (
                      <p className="text-base md:text-lg text-white/90 leading-relaxed">
                        {profile.headline}
                      </p>
                    )}
                  </div>

                  {/* Key Stats */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg">
                      <MapPin className="h-4 w-4 text-primary-200" />
                      <span className="text-white/90">
                        {profile.online ? `${profile.city ?? 'Online'} + Online` : profile.city ?? 'Vor Ort'}
                      </span>
                    </div>
                    {experience && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg">
                        <Briefcase className="h-4 w-4 text-primary-200" />
                        <span className="text-white/90">{experience} Erfahrung</span>
                      </div>
                    )}
                    {profile.rating && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white/90 font-semibold">
                          {profile.rating.toFixed(1)}
                        </span>
                        <span className="text-white/70">({profile.reviewCount ?? 0} Bewertungen)</span>
                      </div>
                    )}
                    {profile.acceptingClients && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-400/30">
                        <UserCheck className="h-4 w-4 text-green-300" />
                        <span className="text-white/90 font-medium">Nimmt neue Klient:innen an</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-primary-700 hover:bg-primary-50 font-semibold shadow-lg">
                  <Link href={contactHref} prefetch={false}>
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Termin anfragen
                  </Link>
                </Button>
                {FEATURES.ASSESSMENT && (
                  <Button asChild size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                    <Link href="/triage" prefetch={false}>
                      Ersteinschätzung starten
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Right: Quick Contact Card */}
            <div className="lg:flex lg:items-start lg:justify-end">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-2xl w-full lg:w-auto lg:min-w-[300px]">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Terminanfrage
                </h3>
                <div className="space-y-4">
                  <div className="text-sm text-white/90 space-y-2">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 shrink-0 text-primary-200" />
                      <span>{profile.responseTime ?? 'Antwort innerhalb von 48 Stunden'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Euro className="h-4 w-4 mt-0.5 shrink-0 text-primary-200" />
                      <span>{formatCurrencyRange(profile.priceMin, profile.priceMax)} pro Einheit</span>
                    </div>
                  </div>
                  <Button asChild className="w-full bg-white text-primary-700 hover:bg-primary-50 font-semibold">
                    <Link href={contactHref} prefetch={false}>
                      Jetzt Kontakt aufnehmen
                    </Link>
                  </Button>
                  <p className="text-xs text-white/70 text-center">
                    Erstgespräch unverbindlich
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Main Content Column */}
          <div className="space-y-8">
            {/* About Section */}
            {profile.about && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Heart className="h-6 w-6 text-primary-600" />
                  Über mich
                </h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">
                  {profile.about}
                </p>
              </section>
            )}

            {/* Approach & Experience */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary-600" />
                Mein therapeutischer Ansatz
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 text-primary-700" />
                    </div>
                    Therapeutischer Ansatz
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed pl-10">
                    {profile.approachSummary ?? 'Information folgt.'}
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary-200 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary-800" />
                    </div>
                    Zielgruppen & Erfahrung
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed pl-10">
                    {profile.experienceSummary ?? 'Information folgt.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Specialties & Modalities */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary-600" />
                Schwerpunkte & Methoden
              </h2>
              <div className="space-y-6">
                {(profile.specialties ?? []).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">
                      Schwerpunkte
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(profile.specialties ?? []).map((specialty) => (
                        <span
                          key={specialty}
                          className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-200"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {(profile.modalities ?? []).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">
                      Therapeutische Modalitäten
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(profile.modalities ?? []).map((modality) => (
                        <span
                          key={modality}
                          className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium border border-primary-300"
                        >
                          {modality}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Services */}
            {(profile.services ?? []).length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary-600" />
                  Angebotene Leistungen
                </h2>
                <ul className="grid gap-3 md:grid-cols-2">
                  {(profile.services ?? []).map((service) => (
                    <li key={service} className="flex items-start gap-3 text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Courses */}
            {profile.courses.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary-600" />
                  Programme & Kurse
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {profile.courses.map((course) => (
                    <article
                      key={course.id}
                      className="border border-slate-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-md transition-all"
                    >
                      <h3 className="font-bold text-slate-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-slate-600 mb-4">{course.description}</p>
                      <Button asChild variant="outline" size="sm" className="text-primary-600 border-primary-600 hover:bg-primary-50">
                        <Link href={`/courses/${course.slug}`} prefetch={false}>
                          Mehr erfahren →
                        </Link>
                      </Button>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Credentials Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary-600" />
                Qualifikationen
              </h3>
              <dl className="space-y-4 text-sm">
                {profile.licenseAuthority && (
                  <div>
                    <dt className="font-medium text-slate-500 mb-1">Lizenzierungsstelle</dt>
                    <dd className="text-slate-900">{profile.licenseAuthority}</dd>
                  </div>
                )}
                {profile.licenseId && (
                  <div>
                    <dt className="font-medium text-slate-500 mb-1">Lizenz-ID</dt>
                    <dd className="text-slate-900 font-mono text-xs">{profile.licenseId}</dd>
                  </div>
                )}
                {profile.yearsExperience && (
                  <div>
                    <dt className="font-medium text-slate-500 mb-1">Berufserfahrung</dt>
                    <dd className="text-slate-900">{profile.yearsExperience} Jahre</dd>
                  </div>
                )}
                {(profile.languages ?? []).length > 0 && (
                  <div>
                    <dt className="font-medium text-slate-500 mb-1">Sprachen</dt>
                    <dd className="text-slate-900">{formatList(profile.languages ?? [])}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Pricing & Availability */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border border-primary-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary-600" />
                Konditionen
              </h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Euro className="h-4 w-4 text-primary-600" />
                    Honorar pro Sitzung
                  </dt>
                  <dd className="text-slate-900 font-bold text-lg">
                    {formatCurrencyRange(profile.priceMin, profile.priceMax)}
                  </dd>
                  {profile.pricingNote && (
                    <dd className="text-xs text-slate-600 mt-1">{profile.pricingNote}</dd>
                  )}
                </div>
                <div>
                  <dt className="font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary-600" />
                    Antwortzeit
                  </dt>
                  <dd className="text-slate-900">{profile.responseTime ?? 'Innerhalb von 48 Stunden'}</dd>
                </div>
                {profile.availabilityNote && (
                  <div>
                    <dt className="font-medium text-slate-700 mb-1 flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-primary-600" />
                      Verfügbarkeit
                    </dt>
                    <dd className="text-slate-900">{profile.availabilityNote}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Bereit für den ersten Schritt?</h3>
              <p className="text-primary-100 text-sm mb-4">
                Kontaktieren Sie mich für ein unverbindliches Erstgespräch.
              </p>
              <Button asChild className="w-full bg-white text-primary-700 hover:bg-primary-50 font-semibold">
                <Link href={contactHref} prefetch={false}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Termin anfragen
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
    </>
  )
}
