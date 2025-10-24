import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarClock, CheckCircle2, Clock, Euro, Globe2, Languages, MapPin, Sparkles, Star } from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { Button } from '@mental-health/ui'
import { formatCurrencyInput } from '../../../lib/therapist/setcard'

type TherapistProfilePageProps = {
  params: {
    profileId: string
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

export default async function TherapistProfilePage({ params }: TherapistProfilePageProps) {
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

  return (
    <div className="bg-surface pb-16 pt-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/therapists"
          className="inline-flex items-center text-sm font-medium text-muted hover:text-default"
        >
          ← Zurück zur Übersicht
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section className="space-y-8 rounded-3xl border border-divider bg-white p-8 shadow-lg">
            <header className="flex flex-col gap-6 md:flex-row">
              <div className="relative h-40 w-40 overflow-hidden rounded-3xl border border-divider bg-surface-1">
                {profile.profileImageUrl ? (
                  <Image
                    src={profile.profileImageUrl}
                    alt={`Portrait von ${profile.displayName ?? 'Therapeut:in'}`}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl font-semibold text-primary">
                    {profile.displayName?.charAt(0) ?? 'T'}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-950">{profile.displayName ?? 'Therapeut:in'}</h1>
                  <p className="text-sm text-muted">{profile.title ?? 'Psychotherapie'}</p>
                  {profile.headline ? (
                    <p className="mt-2 text-base text-neutral-800">{profile.headline}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                  <span className="inline-flex items-center gap-1">
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
                        <Star className="h-4 w-4 text-warning-500" aria-hidden />
                        {profile.rating.toFixed(1)} ({profile.reviewCount ?? 0})
                      </span>
                    </>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href="/triage">Ersteinschätzung starten</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href={contactHref}>Termin anfragen</Link>
                  </Button>
                </div>
              </div>
            </header>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-neutral-950">Über die Zusammenarbeit</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-divider bg-surface-1/80 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                    <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                    Therapeutischer Ansatz
                  </h3>
                  <p className="mt-2 text-sm text-muted">{profile.approachSummary ?? 'Information folgt.'}</p>
                </div>
                <div className="rounded-2xl border border-divider bg-surface-1/80 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                    <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden />
                    Zielgruppen & Erfahrung
                  </h3>
                  <p className="mt-2 text-sm text-muted">{profile.experienceSummary ?? 'Information folgt.'}</p>
                </div>
              </div>
              {profile.services.length ? (
                <div className="rounded-2xl border border-divider bg-surface-1/80 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                    <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                    Leistungen
                  </h3>
                  <p className="mt-2 text-sm text-muted">{formatList(profile.services)}</p>
                </div>
              ) : null}
              {profile.about ? (
                <div className="rounded-2xl border border-divider bg-surface-1/80 p-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Über mich</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{profile.about}</p>
                </div>
              ) : null}
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-neutral-950">Fakten & Konditionen</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-divider bg-surface-1/80 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                    <Languages className="h-4 w-4 text-primary" aria-hidden />
                    Sprachen
                  </h3>
                  <p className="mt-2 text-sm text-muted">{formatList(profile.languages)}</p>
                </div>
                <div className="rounded-2xl border border-divider bg-surface-1/80 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                    <CalendarClock className="h-4 w-4 text-primary" aria-hidden />
                    Verfügbarkeit
                  </h3>
                  <p className="mt-2 text-sm text-muted">{profile.availabilityNote ?? 'Termine nach Absprache.'}</p>
                </div>
                <div className="rounded-2xl border border-divider bg-surface-1/80 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                    <Euro className="h-4 w-4 text-primary" aria-hidden />
                    Honorar je Einheit
                  </h3>
                  <p className="mt-2 text-sm text-muted">{formatCurrencyRange(profile.priceMin, profile.priceMax)}</p>
                  {profile.pricingNote ? (
                    <p className="mt-1 text-xs text-muted">{profile.pricingNote}</p>
                  ) : null}
                </div>
                <div className="rounded-2xl border border-divider bg-surface-1/80 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                    <Clock className="h-4 w-4 text-primary" aria-hidden />
                    Antwortzeit
                  </h3>
                  <p className="mt-2 text-sm text-muted">{profile.responseTime ?? 'Rückmeldung innerhalb von 48 Stunden.'}</p>
                  <p className="mt-1 text-xs text-muted">
                    {profile.acceptingClients === false ? 'Aktuell Warteliste' : 'Nimmt neue Klient:innen an'}
                  </p>
                </div>
              </div>
            </section>

            {profile.courses.length > 0 ? (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-neutral-950">Programme & Kurse</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {profile.courses.map((course) => (
                    <article key={course.id} className="rounded-2xl border border-divider bg-surface-1/80 p-4">
                      <h3 className="text-sm font-semibold text-neutral-900">{course.title}</h3>
                      <p className="mt-1 text-sm text-muted">{course.description}</p>
                      <Button asChild variant="ghost" className="mt-3 px-0 text-sm font-semibold text-primary">
                        <Link href={`/courses/${course.slug}`}>Zum Kurs</Link>
                      </Button>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-divider bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-neutral-950">Kontakt aufnehmen</h2>
              <p className="mt-2 text-sm text-muted">
                Starte mit einer Ersteinschätzung oder melde dich direkt, um freie Termine zu klären.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Button asChild>
                  <Link href="/triage">Ersteinschätzung</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={contactHref}>Kontakt aufnehmen</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/therapists">Weitere Therapeut:innen</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-3xl border border-divider bg-white p-6 shadow">
              <h3 className="text-sm font-semibold text-neutral-900">Schwerpunkte</h3>
              <p className="mt-2 text-sm text-muted">{formatList(profile.specialties)}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
