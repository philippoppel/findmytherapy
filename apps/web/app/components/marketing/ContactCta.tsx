'use client'

import Link from 'next/link'
import { Button } from '@mental-health/ui'
import type { contactCta } from '../../marketing-content'
import { Reveal } from './Reveal'

interface ContactCtaProps {
  content: typeof contactCta
}

export function ContactCta({ content }: ContactCtaProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-white to-primary/5 p-10 text-center shadow-2xl shadow-primary/20 md:p-14" variant="scale">
          <div className="absolute -left-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" aria-hidden />
          <div className="absolute -right-12 top-8 h-32 w-32 rounded-full bg-secondary-500/20 blur-3xl" aria-hidden />
          <div className="relative">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Bereit für den nächsten Schritt?
            </span>
            <h2 className="mt-6 text-pretty text-3xl font-semibold tracking-tight text-default sm:text-4xl">
              {content.heading}
            </h2>
            <p className="mt-3 text-pretty text-lg leading-relaxed text-muted">
              {content.subheading}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href={content.primaryCta.href}>
                  {content.primaryCta.label}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={content.secondaryCta.href}>
                  {content.secondaryCta.label}
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
