'use client'

import { Check, Rocket } from 'lucide-react'
import { Reveal } from './Reveal'
import type { earlyAccessContent } from '../../marketing-content'

interface EarlyAccessProps {
  content: typeof earlyAccessContent
}

export function EarlyAccessSection({ content }: EarlyAccessProps) {
  return (
    <section id="early-access" className="py-24" aria-labelledby="early-access-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left: Early Access Info */}
          <div className="space-y-10">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <Rocket className="h-3.5 w-3.5" />
                {content.eyebrow}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h2
                id="early-access-heading"
                className="mt-6 text-pretty text-3xl font-semibold tracking-tight text-default sm:text-4xl"
              >
                {content.title}
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted">
                {content.description}
              </p>
            </Reveal>

            <div className="space-y-6">
              {content.features.map((feature, index) => (
                <Reveal key={feature.title} delay={300 + index * 100}>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-default">{feature.title}</h3>
                      <p className="mt-1 text-pretty text-sm text-muted">{feature.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right: Mission Statement */}
          <div>
            <Reveal delay={200}>
              <div className="rounded-3xl border border-divider bg-surface-1 p-8 shadow-lg lg:p-10">
                <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-primary/10 p-4">
                  <svg
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-semibold text-default">
                  {content.mission.title}
                </h3>

                <p className="mt-4 text-pretty leading-relaxed text-muted">
                  {content.mission.description}
                </p>

                <div className="mt-8 space-y-4 border-t border-divider pt-6">
                  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="text-lg font-bold">6+</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-default text-pretty">Monate Wartezeit</p>
                      <p className="text-xs text-muted text-pretty">Durchschnitt in Österreich</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="text-lg font-bold">60%</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-default text-pretty">Unsicherheit</p>
                      <p className="text-xs text-muted text-pretty">Brauche ich überhaupt Hilfe?</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-default text-pretty">Früher Zugang</p>
                      <p className="text-xs text-muted text-pretty">Gemeinsam Versorgung verbessern</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
