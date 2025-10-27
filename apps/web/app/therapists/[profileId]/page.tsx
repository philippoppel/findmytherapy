import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarClock, CheckCircle2, Clock, Euro, Globe2, Languages, MapPin, Sparkles, Star } from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { Button } from '@mental-health/ui'
import { formatCurrencyInput } from '../../../lib/therapist/setcard'
import { BackButton } from './BackButton'

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
      isPublic: true,
    },
  })

  if (!profile || !profile.isPublic) {
    return {
      title: 'Therapeut:in nicht gefunden',
    }
  }

  return {
    title: `${profile.displayName ?? 'Therapeut:in'} – FindMyTherapy`,
    description: profile.headline ?? 'Individuelle psychologische Unterstützung mit FindMyTherapy.',
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

  const contactHref = profile.user?.email ? `mailto:${profile.user.email}` : '/contact'
  const experience = profile.yearsExperience ? `${profile.yearsExperience} Jahre Erfahrung` : undefined
  const fromTriage = searchParams?.from === 'triage'

  // Always use dark design
  const pageClassName = 'relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-950 via-cyan-950 to-blue-950 pb-16 pt-10'
  const cardClassName = 'space-y-8 rounded-3xl border border-white/10 bg-white/10 p-8 shadow-lg backdrop-blur'
  const asideClassName = 'space-y-6 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-lg backdrop-blur'
  const detailCardClass = 'rounded-2xl border border-white/10 bg-white/5 p-4'
  const textDefault = 'text-white'
  const textMuted = 'text-white/70'

  return (
    <div className={pageClassName}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-32 right-4 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" />
      </div>
      <div className="relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {fromTriage ? (
            <BackButton className="inline-flex items-center text-sm font-medium transition text-white/70 hover:text-white">
              ← Zurück zu deinen Empfehlungen
            </BackButton>
          ) : (
            <Link
              href="/therapists"
              prefetch={false}
              className="inline-flex items-center text-sm font-medium text-white/70 transition hover:text-white"
            >
              ← Zurück zur Übersicht
            </Link>
          )}
          <Link
            href="/"
            prefetch={false}
            className="text-sm font-medium transition text-white/70 hover:text-white"
          >
            Zur Startseite
          </Link>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section className={cardClassName}>
            <header className="flex flex-col gap-6 md:flex-row">
              <div className={`relative h-40 w-40 overflow-hidden rounded-3xl border ${fromTriage ? 'border-white/15 bg-white/10' : 'border-divider bg-surface-1'}`}>
                {profile.profileImageUrl ? (
                  <Image
                    src={profile.profileImageUrl}
                    alt={`Portrait von ${profile.displayName ?? 'Therapeut:in'}`}
                    width={256}
                    height={256}
                    className="h-full w-full object-cover object-center"
                    sizes="(max-width: 768px) 200px, 256px"
                    quality={95}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-teal-400/20 text-4xl font-semibold text-white">
                    {profile.displayName?.charAt(0) ?? 'T'}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className={`text-3xl font-bold ${textDefault}`}>{profile.displayName ?? 'Therapeut:in'}</h1>
                  <p className={`text-sm ${textMuted}`}>{profile.title ?? 'Psychotherapie'}</p>
                  {profile.headline ? (
                    <p className="mt-2 text-base text-white/80">
                      {profile.headline}
                    </p>
                  ) : null}
                </div>
                <div className={`flex flex-wrap items-center gap-3 text-sm ${textMuted}`}>
                  <span className="inline-flex items-center gap-1 text-teal-400">
                    <MapPin className="h-4 w-4" aria-hidden />
                    {profile.online ? `${profile.city ?? 'Online'} · Online` : profile.city ?? 'Vor Ort'}
                  </span>
                  <span aria-hidden>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Globe2 className="h-4 w-4" aria-hidden />
                    {profile.modalities.length ? profile.modalities.slice(0, 2).join(', ') : 'Modalität auf Anfrage'}
                  </span>
                  {experience ? (
                    <>
                      <span aria-hidden>•</span>
                      <span>{experience}</span>
                    </>
                  ) : null}
                  {profile.rating ? (
                    <>
                      <span aria-hidden>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" aria-hidden />
                        {profile.rating.toFixed(1)} ({profile.reviewCount ?? 0})
                      </span>
                    </>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="bg-teal-400 text-white hover:bg-teal-300">
                    <Link href={contactHref} prefetch={false}>
                      Termin anfragen
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                    <Link href="/triage" prefetch={false}>
                      Neue Ersteinschätzung
                    </Link>
                  </Button>
                </div>
              </div>
            </header>

            <section className="space-y-4">
              <h2 className={`text-xl font-semibold ${textDefault}`}>Über die Zusammenarbeit</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className={detailCardClass}>
                  <h3 className={`flex items-center gap-2 text-sm font-semibold ${textDefault}`}>
                    <Sparkles className="h-4 w-4 text-teal-400" aria-hidden />
                    Therapeutischer Ansatz
                  </h3>
                  <p className={`mt-2 text-sm ${textMuted}`}>{profile.approachSummary ?? 'Information folgt.'}</p>
                </div>
                <div className={detailCardClass}>
                  <h3 className={`flex items-center gap-2 text-sm font-semibold ${textDefault}`}>
                    <CheckCircle2 className="h-4 w-4 text-teal-400" aria-hidden />
                    Zielgruppen & Erfahrung
                  </h3>
                  <p className={`mt-2 text-sm ${textMuted}`}>{profile.experienceSummary ?? 'Information folgt.'}</p>
                </div>
              </div>
              {profile.services.length ? (
                <div className={detailCardClass}>
                  <h3 className={`flex items-center gap-2 text-sm font-semibold ${textDefault}`}>
                    <Sparkles className="h-4 w-4 text-teal-400" aria-hidden />
                    Leistungen
                  </h3>
                  <p className={`mt-2 text-sm ${textMuted}`}>{formatList(profile.services)}</p>
                </div>
              ) : null}
              {profile.about ? (
                <div className={detailCardClass}>
                  <h3 className={`text-sm font-semibold ${textDefault}`}>Über mich</h3>
                  <p className={`mt-2 whitespace-pre-wrap text-sm ${textMuted}`}>{profile.about}</p>
                </div>
              ) : null}
            </section>

            <section className="space-y-4">
              <h2 className={`text-xl font-semibold ${textDefault}`}>Fakten & Konditionen</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className={detailCardClass}>
                  <h3 className={`flex items-center gap-2 text-sm font-semibold ${textDefault}`}>
                    <Euro className="h-4 w-4 text-teal-400" aria-hidden />
                    Honorar je Einheit
                  </h3>
                  <p className={`mt-2 text-sm ${textMuted}`}>{formatCurrencyRange(profile.priceMin, profile.priceMax)}</p>
                  {profile.pricingNote ? (
                    <p className={`mt-1 text-xs ${textMuted}`}>{profile.pricingNote}</p>
                  ) : null}
                </div>
                <div className={detailCardClass}>
                  <h3 className={`flex items-center gap-2 text-sm font-semibold ${textDefault}`}>
                    <CalendarClock className="h-4 w-4 text-teal-400" aria-hidden />
                    Aktuelle Kapazität
                  </h3>
                  <p className={`mt-2 text-sm ${textMuted}`}>
                    {profile.availabilityNote ?? 'Kontakt für aktuelle Kapazitäten.'}
                  </p>
                </div>
                <div className={detailCardClass}>
                  <h3 className={`flex items-center gap-2 text-sm font-semibold ${textDefault}`}>
                    <Clock className="h-4 w-4 text-teal-400" aria-hidden />
                    Antwortzeit
                  </h3>
                  <p className={`mt-2 text-sm ${textMuted}`}>
                    {profile.responseTime ?? 'Rückmeldung innerhalb von 48 Stunden.'}
                  </p>
                  <p className={`mt-1 text-xs ${textMuted}`}>
                    {profile.acceptingClients === false ? 'Aktuell Warteliste' : 'Nimmt neue Klient:innen an'}
                  </p>
                </div>
                <div className={detailCardClass}>
                  <h3 className={`flex items-center gap-2 text-sm font-semibold ${textDefault}`}>
                    <Languages className="h-4 w-4 text-teal-400" aria-hidden />
                    Sprachen
                  </h3>
                  <p className={`mt-2 text-sm ${textMuted}`}>{formatList(profile.languages)}</p>
                </div>
              </div>
            </section>

            {profile.courses.length ? (
              <section className="space-y-4">
                <h2 className={`text-xl font-semibold ${textDefault}`}>Programme & Kurse</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {profile.courses.map((course) => (
                    <article key={course.id} className={detailCardClass}>
                      <h3 className={`text-sm font-semibold ${textDefault}`}>{course.title}</h3>
                      <p className={`mt-2 text-sm ${textMuted}`}>{course.description}</p>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="mt-3 text-white hover:bg-white/10"
                      >
                        <Link href={`/courses/${course.slug}`} prefetch={false}>
                          Zum Kurs
                        </Link>
                      </Button>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </section>

          <aside className={asideClassName}>
            <div className="space-y-3">
              <h2 className={`text-lg font-semibold ${textDefault}`}>Schnelle Fakten</h2>
              <div className={`flex flex-col gap-2 text-sm ${textMuted}`}>
                <span>Lizenz: {profile.licenseAuthority ?? 'Auf Anfrage'}</span>
                <span>ID: {profile.licenseId ?? 'Nicht angegeben'}</span>
                <span>Modalitäten: {formatList(profile.modalities)}</span>
                <span>Schwerpunkte: {formatList(profile.specialties)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h2 className={`text-lg font-semibold ${textDefault}`}>Kontakt</h2>
              <p className={`text-sm ${textMuted}`}>
                Unser Care-Team koordiniert gerne ein Erstgespräch oder beantwortet offene Fragen.
              </p>
              <div className="flex flex-col gap-3">
                <Button asChild size="lg" className="bg-teal-400 text-white hover:bg-teal-300">
                  <Link href={contactHref} prefetch={false}>
                    Nachricht senden
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  <Link href="/triage" prefetch={false}>
                    Neue Ersteinschätzung
                  </Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
      </div>
    </div>
  )
}
