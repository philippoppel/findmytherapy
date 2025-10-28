'use client'

import Link from 'next/link'
import { Button } from '@mental-health/ui'
import type { teamContent } from '../../marketing-content'
import { Reveal } from './Reveal'

interface TeamSectionProps {
  content: typeof teamContent
}

export function TeamSection({ content }: TeamSectionProps) {
  return (
    <section id="team" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[2.5rem] border border-divider bg-white p-6 shadow-xl shadow-secondary/10 sm:gap-10 sm:p-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)] lg:gap-12 lg:p-14">
          <Reveal className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Das Team
            </span>
            <h2 className="text-pretty text-3xl font-semibold tracking-tight text-default sm:text-4xl">
              {content.heading}
            </h2>
            <p className="text-pretty text-lg leading-relaxed text-muted">
              {content.description}
            </p>

            <ul className="space-y-5">
              {content.members.map((member) => (
                <li
                  key={member.name}
                  className="flex flex-col gap-1 rounded-2xl border border-divider bg-surface-1 px-5 py-4 shadow-sm"
                >
                  <p className="text-base font-semibold text-default">
                    {member.name}
                  </p>
                  <p className="text-sm text-muted">
                    {member.role}
                  </p>
                  <p className="text-sm text-pretty text-subtle">
                    {member.focus}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              {content.ctas.map((cta) => (
                <Button key={cta.href} asChild variant="outline">
                  <Link href={cta.href}>
                    {cta.label}
                  </Link>
                </Button>
              ))}
            </div>
          </Reveal>

          <Reveal className="flex flex-col gap-5 rounded-3xl border border-primary/15 bg-white/90 p-5 shadow-lg shadow-primary/10 sm:gap-6 sm:p-6 lg:p-8" variant="scale">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
              Unser Versprechen
            </h3>
            <ul className="space-y-3 text-sm leading-relaxed text-default sm:space-y-4">
              <li>
                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3 text-pretty shadow-sm sm:p-4">
                  Wir entwickeln Funktionen gemeinsam mit Therapeut:innen – nicht im stillen Kämmerchen.
                </div>
              </li>
              <li>
                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3 text-pretty shadow-sm sm:p-4">
                  Wir hören zu, iterieren wöchentlich und liefern sichtbare Verbesserungen auf Basis eures Feedbacks.
                </div>
              </li>
              <li>
                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3 text-pretty shadow-sm sm:p-4">
                  Wir nehmen Datenschutz ernster als nur als Häkchen: Zero-Knowledge-Architektur, unabhängige Audits und Hosting in der EU.
                </div>
              </li>
            </ul>
            <div className="rounded-2xl border border-primary/20 bg-white p-5 text-sm text-muted shadow-sm">
              <p className="font-semibold text-default text-pretty">Feedback? Immer her damit!</p>
              <p className="mt-2 text-pretty">
                Schreibe uns über das Produkt direkt im Interface oder an{' '}
                <a
                  href="mailto:servus@findmytherapy.net"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  servus@findmytherapy.net
                </a>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
