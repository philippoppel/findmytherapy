'use client'

import { cn } from '@mental-health/ui'
import type { impactStats } from '../../marketing-content'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'

interface ImpactStatsProps {
  stats: typeof impactStats
  eyebrow?: string
  title?: string
  description?: string
  id?: string
  className?: string
}

export function ImpactStats({
  stats,
  eyebrow,
  title,
  description,
  id,
  className,
}: ImpactStatsProps) {
  return (
    <section
      id={id}
      className={cn('py-20', className)}
      aria-labelledby={title ? `${id ?? 'impact'}-heading` : undefined}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {(title || description || eyebrow) ? (
          <Reveal>
            <SectionHeading
              eyebrow={eyebrow}
              title={title ?? ''}
              description={description}
              className="mb-10"
            />
          </Reveal>
        ) : null}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.value}
              delay={index * 120}
            >
              <article className="group relative h-full overflow-hidden rounded-3xl border border-divider bg-white shadow-lg shadow-secondary/10 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <div className="relative flex h-full flex-col gap-3 px-4 py-6 sm:px-6 sm:py-8">
                  <span className="text-4xl font-semibold text-primary text-balance">
                    {stat.value}
                  </span>
                  <h3 className="text-lg font-semibold text-default text-pretty">
                    {stat.emphasis}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted text-pretty">
                    {stat.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
