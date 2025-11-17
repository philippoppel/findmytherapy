'use client'

import Link from 'next/link'
import { Button } from '@mental-health/ui'
import { Sparkles, Users, Video, CheckCircle2 } from 'lucide-react'
import type { clientBenefits } from '../../marketing-content'
import { Reveal } from './Reveal'
import { InteractiveCard } from '../InteractiveCard'

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
        <Reveal className="mb-14 text-center sm:mb-16">
          <span className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-xs font-medium tracking-wide text-primary-800 sm:text-sm">
            {content.eyebrow}
          </span>
          <h2 className="mt-6 text-pretty text-3xl font-semibold tracking-tight text-neutral-900 sm:mt-8 sm:text-4xl lg:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-extra-relaxed text-neutral-700 sm:mt-6 sm:text-xl">
            {content.description}
          </p>
        </Reveal>

        <div className="grid gap-10 lg:gap-12">
          {content.benefits.map((benefit, index) => {
            const IconComponent = ICON_MAP[benefit.icon]

            return (
              <Reveal
                key={benefit.title}
                as={InteractiveCard}
                className="grid gap-8 border border-primary-100/60 bg-white/95 p-8 sm:gap-10 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-12"
              >
                {/* Content Side */}
                <div className="space-y-6">
                  <div className="flex items-start gap-5">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 shadow-soft">
                      <IconComponent className="h-8 w-8" aria-hidden />
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

                  <p className="text-pretty text-base leading-extra-relaxed text-muted sm:text-lg">
                    {benefit.description}
                  </p>

                  {index === 0 && (
                    <div className="rounded-xl border border-primary-200 bg-primary-50 p-5 shadow-soft">
                      <p className="text-sm font-semibold text-primary-800 sm:text-base">
                        ✨ Wissenschaftlich fundiert & DSGVO-konform
                      </p>
                      <p className="mt-2.5 text-sm leading-relaxed text-neutral-700 sm:text-base">
                        Alle Daten werden verschlüsselt auf EU-Servern gespeichert. Du behältst die
                        volle Kontrolle.
                      </p>
                    </div>
                  )}
                </div>

                {/* Highlights Side */}
                <div className="rounded-xl border border-primary-200 bg-gradient-to-br from-primary-50 via-white to-transparent p-7 shadow-soft sm:p-8">
                  <h4 className="mb-5 text-sm font-medium tracking-wide text-neutral-700 sm:text-base">
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
