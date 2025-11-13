'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@mental-health/ui'
import type { teamContent } from '../../marketing-content'
import { Reveal } from './Reveal'

interface TeamSectionProps {
  content: typeof teamContent
}

export function TeamSection({ content }: TeamSectionProps) {
  return (
    <section id="team" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.03]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center sm:mb-16 lg:mb-20">
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-xs font-medium tracking-wide text-primary-800 sm:text-sm">
              Das Team
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-neutral-900 sm:mt-8 sm:text-4xl lg:text-5xl">
              {content.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-extra-relaxed text-neutral-700 sm:mt-6 sm:text-xl">
              {content.description}
            </p>
          </Reveal>
        </div>

        {/* Team Grid - 3 columns on large screens */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:mb-16 lg:grid-cols-3 lg:gap-8">
          {content.members.map((member, index) => (
            <Reveal
              key={member.name}
              delay={0.1 * index}
              className="group relative"
            >
              <div className="relative h-full overflow-hidden rounded-3xl border border-primary-200 bg-white shadow-soft-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-xl">
                {/* Image */}
                {member.image && (
                  <div className="relative aspect-square w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60" />
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Name overlay on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-white/90 sm:text-base">
                        {member.role}
                      </p>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <p className="text-sm leading-relaxed text-muted sm:text-base">
                    {member.focus}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Promise Section - Full width below team */}
        <Reveal delay={0.3}>
          <div className="mx-auto max-w-5xl rounded-3xl border border-primary-200 bg-gradient-to-br from-white via-white to-primary-50 p-8 shadow-soft-xl sm:p-10 lg:p-12">
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                Unser Versprechen
              </h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
              <div className="group relative overflow-hidden rounded-2xl border border-primary-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg">
                <div className="absolute left-0 top-0 h-1 w-12 bg-gradient-to-r from-primary-600 to-primary-300 transition-all duration-300 group-hover:w-full" />
                <p className="text-pretty text-sm leading-relaxed text-default sm:text-base">
                  Wir entwickeln Funktionen gemeinsam mit Therapeut:innen – nicht im stillen Kämmerchen.
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-primary-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg">
                <div className="absolute left-0 top-0 h-1 w-12 bg-gradient-to-r from-primary-600 to-primary-300 transition-all duration-300 group-hover:w-full" />
                <p className="text-pretty text-sm leading-relaxed text-neutral-900 sm:text-base">
                  Wir hören zu, iterieren wöchentlich und liefern sichtbare Verbesserungen auf Basis eures Feedbacks.
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-primary-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg">
                <div className="absolute left-0 top-0 h-1 w-12 bg-gradient-to-r from-primary-600 to-primary-300 transition-all duration-300 group-hover:w-full" />
                <p className="text-pretty text-sm leading-relaxed text-default sm:text-base">
                  Wir nehmen Datenschutz ernster als nur als Häkchen: Zero-Knowledge-Architektur, unabhängige Audits und Hosting in der EU.
                </p>
              </div>
            </div>

            {/* Feedback CTA */}
            <div className="mt-8 rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-6 shadow-soft sm:p-8">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                <div className="flex-1">
                  <p className="text-lg font-bold text-default sm:text-xl">
                    Feedback? Immer her damit!
                  </p>
                  <p className="mt-2 text-pretty text-sm text-muted sm:text-base">
                    Schreibe uns über das Produkt direkt im Interface oder an{' '}
                    <a
                      href="mailto:servus@findmytherapy.net"
                      className="font-semibold text-primary underline-offset-2 transition-colors hover:underline"
                    >
                      servus@findmytherapy.net
                    </a>
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 sm:flex-nowrap">
                  {content.ctas.map((cta) => (
                    <Button key={cta.href} asChild variant="outline" size="sm">
                      <Link href={cta.href}>
                        {cta.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
