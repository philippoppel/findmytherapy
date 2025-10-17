import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, Target } from 'lucide-react'

import { demoCourses } from '@mental-health/db'
import { CourseCatalog, type CourseCard } from './CourseCatalog'

export const metadata: Metadata = {
  title: 'Programme & Kurse – Klarthera',
  description:
    'Geführte digitale Programme, Live-Workshops und Hybridformate von Klarthera. Demo-Inhalte zeigen, wie das Kursangebot präsentiert wird.',
}

export default function CoursesPage() {
  const courses: CourseCard[] = demoCourses
    .filter((course) => course.status === 'PUBLISHED')
    .map((course) => ({
      slug: course.slug,
      title: course.title,
      shortDescription: course.shortDescription,
      description: course.description,
      focus: course.focus,
      duration: course.duration,
      intensity: course.intensity,
      format: course.format,
      outcomes: course.outcomes,
      price: course.price,
      currency: course.currency,
      lessons: course.lessons.length,
    }))

  return (
    <div className="bg-surface">
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary-50 via-surface-1 to-surface-1 py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-[-6rem] h-80 w-80 rounded-full bg-secondary-200/30 blur-3xl" />
          <div className="absolute bottom-[-8rem] left-[-3rem] h-72 w-72 rounded-full bg-primary-200/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-center">
            <span className="inline-flex items-center rounded-full bg-secondary-100 px-4 py-1 text-sm font-semibold text-secondary-700 shadow-sm">
              Klarthera Programme - Demo-Inhalte
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
              Digitale Programme, die dich zwischen den Sessions tragen
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
              Unsere Demo zeigt, wie Kurse und Hybridprogramme aufgebaut sind: klare Ziele, modulare Struktur, transparente Dauer und Integration ins Klarthera-Sicherheitsnetz.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/triage"
                className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <Target className="mr-2 h-4 w-4" /> Empfehlung via Ersteinschätzung
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Beratung zu passenden Programmen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl font-semibold text-neutral-900">
                Demo: Strukturierte Kursübersicht
              </h2>
              <p className="text-base text-muted">
                Alle Programme folgen einem klaren Aufbau. Menschen sehen auf einen Blick Ziel, Umfang, Intensität und was sie konkret erwartet.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-divider bg-white/70 px-4 py-2 text-sm text-muted">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Demo-Daten. Austausch jederzeit möglich.</span>
            </div>
          </div>

          <CourseCatalog courses={courses} />
        </div>
      </section>
    </div>
  )
}
