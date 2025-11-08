'use client'

import Link from 'next/link'
import { Button } from '@mental-health/ui'
import { Sparkles, Users, Video, CheckCircle2 } from 'lucide-react'
import type { clientBenefits } from '../../marketing-content'
import { Reveal } from './Reveal'

interface ClientBenefitsProps {
  content: typeof clientBenefits
}

const ICON_MAP = {
  sparkles: Sparkles,
  users: Users,
  video: Video,
} as const

export function ClientBenefits({ content }: ClientBenefitsProps) {
  return (
    <section id={content.id} className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            {content.eyebrow}
          </span>
          <h2 className="mt-4 text-pretty text-3xl font-semibold tracking-tight text-default sm:text-4xl lg:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
            {content.description}
          </p>
        </Reveal>

        <div className="grid gap-8 lg:gap-10">
          {content.benefits.map((benefit, index) => {
            const IconComponent = ICON_MAP[benefit.icon]
            const isEven = index % 2 === 0

            return (
              <Reveal
                key={benefit.title}
                className={`grid gap-6 rounded-[2.5rem] border border-divider bg-white p-6 shadow-xl shadow-secondary/10 sm:gap-8 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-12 ${
                  isEven ? '' : 'lg:grid-flow-dense'
                }`}
              >
                {/* Content Side */}
                <div className={`space-y-6 ${isEven ? '' : 'lg:col-start-2'}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <IconComponent className="h-7 w-7" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-balance text-2xl font-semibold text-default sm:text-3xl">
                        {benefit.title}
                      </h3>
                      <p className="mt-1 text-pretty text-sm font-medium text-primary sm:text-base">
                        {benefit.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
                    {benefit.description}
                  </p>

                  {index === 0 && (
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                      <p className="text-sm font-semibold text-primary">
                        ✨ Wissenschaftlich fundiert & DSGVO-konform
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-default">
                        Alle Daten werden verschlüsselt auf EU-Servern gespeichert. Du behältst die
                        volle Kontrolle.
                      </p>
                    </div>
                  )}
                </div>

                {/* Highlights Side */}
                <div
                  className={`rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-inner shadow-primary/10 ${
                    isEven ? '' : 'lg:col-start-1 lg:row-start-1'
                  }`}
                >
                  <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80 sm:text-sm">
                    Die Vorteile im Überblick
                  </h4>
                  <ul className="space-y-3">
                    {benefit.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1 text-pretty text-sm leading-relaxed text-default sm:text-base">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href={content.cta.primary.href}>{content.cta.primary.label}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={content.cta.secondary.href}>{content.cta.secondary.label}</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
