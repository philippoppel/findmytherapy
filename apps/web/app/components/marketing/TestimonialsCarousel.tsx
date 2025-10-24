'use client'

import { useMemo, useState } from 'react'
import { Button, cn } from '@mental-health/ui'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import type { testimonialList } from '../../marketing-content'
import { Reveal } from './Reveal'

interface TestimonialsCarouselProps {
  testimonials: typeof testimonialList
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const total = testimonials.length

  const orderedTestimonials = useMemo(() => {
    if (total <= 2) {
      return testimonials
    }
    const current = testimonials[activeIndex]
    const next = testimonials[(activeIndex + 1) % total]
    const prev = testimonials[(activeIndex + total - 1) % total]
    return [prev, current, next]
  }, [activeIndex, testimonials, total])

  const goNext = () => setActiveIndex((index) => (index + 1) % total)
  const goPrev = () => setActiveIndex((index) => (index + total - 1) % total)

  return (
    <section id="voices" className="py-24" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Stimmen aus der Praxis
              </span>
              <h2 id="testimonials-heading" className="mt-4 text-pretty text-3xl font-semibold tracking-tight text-default sm:text-4xl">
                Was Nutzer:innen &amp; Therapeut:innen berichten
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-muted">
                Ob persönliche Begleitung, Kursmodule oder Praxis-Insights – hier zeigen echte Stimmen, wie FindMyTherapy unterstützt.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Vorheriges Testimonial"
                onClick={goPrev}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Nächstes Testimonial"
                onClick={goNext}
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </Button>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {orderedTestimonials.map((testimonial, idx) => {
              const isActive = idx === 1 || total <= 2
              return (
                <Reveal
                  key={`${testimonial.author}-${testimonial.role}`}
                  delay={idx * 120}
                >
                  <figure
                    className={cn(
                      'relative flex h-full flex-col gap-6 rounded-3xl border border-divider bg-white p-8 shadow-lg shadow-secondary/10 transition-all duration-300',
                      isActive
                        ? 'scale-[1.02] border-primary/30 shadow-xl shadow-primary/20'
                        : 'opacity-70',
                    )}
                  >
                    <div className="flex items-center gap-1 text-primary">
                      {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                        <Star key={starIndex} className="h-4 w-4 fill-current" aria-hidden />
                      ))}
                    </div>
                    <blockquote className="text-base leading-relaxed text-default">
                      “{testimonial.quote}”
                    </blockquote>
                    <figcaption className="mt-auto">
                      <p className="text-sm font-semibold text-default">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-muted">
                        {testimonial.role}
                      </p>
                    </figcaption>
                  </figure>
                </Reveal>
              )
            })}
          </div>

          <Reveal className="flex justify-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  'h-2 w-10 rounded-full transition-colors duration-150',
                  activeIndex === idx ? 'bg-primary' : 'bg-divider hover:bg-primary/40',
                )}
                aria-label={`Testimonial ${idx + 1} anzeigen`}
                aria-current={activeIndex === idx}
              />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
