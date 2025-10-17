'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpenCheck, CalendarClock, ChevronDown, ChevronUp, Layers3, Play } from 'lucide-react'

import { Button, cn } from '@mental-health/ui'

export type CourseCard = {
  slug: string
  title: string
  shortDescription: string
  description: string
  focus: string
  duration: string
  intensity: string
  format: string
  outcomes: string[]
  price: number
  currency: string
  lessons: number
}

type Props = {
  courses: CourseCard[]
}

const formatPrice = (amount: number, currency: string) =>
  new Intl.NumberFormat('de-AT', { style: 'currency', currency }).format(amount / 100)

export function CourseCatalog({ courses }: Props) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {courses.map((course) => {
        const isExpanded = expandedSlug === course.slug

        return (
          <article
            key={course.slug}
            className={cn(
              'flex h-full flex-col justify-between rounded-3xl border border-divider bg-white/85 p-6 shadow-sm shadow-primary/5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/15',
              isExpanded && 'border-primary/40 shadow-primary/20',
            )}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary-600">
                  <Layers3 className="h-4 w-4" />
                  {course.focus}
                </div>
                <h3 className="text-2xl font-semibold text-neutral-900">{course.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{course.shortDescription}</p>
              </div>
              <dl className="grid grid-cols-1 gap-3 rounded-xl border border-divider bg-surface-1/90 p-4 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  <div>
                    <dt className="font-medium text-neutral-900">Dauer</dt>
                    <dd>{course.duration}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpenCheck className="h-4 w-4 text-primary" />
                  <div>
                    <dt className="font-medium text-neutral-900">Intensität</dt>
                    <dd>{course.intensity}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-primary" />
                  <div>
                    <dt className="font-medium text-neutral-900">Format</dt>
                    <dd>{course.format}</dd>
                  </div>
                </div>
              </dl>
              <div className="rounded-xl border border-divider bg-white/70 p-4 text-sm text-muted">
                <p className="font-medium text-neutral-900">In dieser Demo enthalten</p>
                <ul className="mt-2 space-y-2">
                  {course.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-primary" aria-hidden />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 space-y-4 border-t border-divider pt-4">
              <div className="flex items-center justify-between text-sm text-neutral-900">
                <span className="font-semibold">{formatPrice(course.price, course.currency)}</span>
                <span className="text-xs text-muted">{course.lessons} Lektionen in der Demo</span>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => setExpandedSlug(isExpanded ? null : course.slug)}
                  className="inline-flex items-center justify-center gap-2"
                  aria-expanded={isExpanded}
                  aria-controls={`course-${course.slug}`}
                >
                  {isExpanded ? (
                    <>
                      Weniger Details
                      <ChevronUp className="h-4 w-4" aria-hidden />
                    </>
                  ) : (
                    <>
                      Mehr Details
                      <ChevronDown className="h-4 w-4" aria-hidden />
                    </>
                  )}
                </Button>
                <Button asChild>
                  <Link href="/triage">Passenden Kurs empfehlen lassen</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/contact">Demo-Termin vereinbaren</Link>
                </Button>
              </div>

              {isExpanded && (
                <div
                  id={`course-${course.slug}`}
                  className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-primary-900"
                >
                  <p className="font-medium text-primary-950">So funktioniert das Programm</p>
                  <p className="mt-2">{course.description}</p>
                </div>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
