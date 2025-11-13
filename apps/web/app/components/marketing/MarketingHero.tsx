'use client'

import Link from 'next/link'
import { Button } from '@mental-health/ui'
import type { heroContent } from '../../marketing-content'
import { Reveal } from './Reveal'

interface HeroProps {
  content: typeof heroContent
}

export function MarketingHero({ content }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl shadow-soft-xl"
      aria-labelledby="hero-heading"
    >
      {/* Fullscreen Video Background - All Devices */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/therapists/therapy-1.jpg"
          className="h-full w-full object-cover"
          title="FindMyTherapy – Professionelle Therapiesitzung, Mentale Gesundheit in Österreich"
          aria-label="Hintergrundvideo zeigt eine professionelle Therapiesitzung"
        >
          <source src="/videos/hero-therapy.mp4" type="video/mp4" />
          Ihr Browser unterstützt keine HTML5-Videos. Besuchen Sie FindMyTherapy für digitale
          Ersteinschätzung und Therapeuten-Matching.
        </video>
        {/* Overlay for text readability - warm gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/75 via-neutral-900/60 to-primary-900/70 backdrop-blur-[2px]" />
      </div>

      {/* Content over video */}
      <div className="relative z-10 px-6 py-20 text-white sm:px-8 sm:py-28 md:py-36 lg:px-12 lg:py-44">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal delay={100}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium tracking-wide text-white backdrop-blur-md sm:gap-3 sm:px-6 sm:py-3">
              {content.eyebrow}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h1
              id="hero-heading"
              className="mt-8 text-balance text-5xl font-semibold leading-tight tracking-tight text-white sm:mt-10 sm:text-6xl lg:text-7xl"
            >
              {content.title}
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="mx-auto mt-8 max-w-3xl text-pretty text-xl leading-extra-relaxed text-white/90 sm:mt-10 sm:text-2xl">
              {content.highlight}
            </p>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row sm:gap-5">
              <Button
                asChild
                size="lg"
                variant="primary"
                className="w-full shadow-soft-xl transition hover:-translate-y-0.5 hover:shadow-soft-xl sm:w-auto sm:px-10 sm:py-6 sm:text-lg"
              >
                <Link href={content.primaryCta.href}>
                  {content.primaryCta.label}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="w-full border-2 border-white/30 bg-white/10 text-white shadow-soft backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-soft-lg sm:w-auto sm:px-10 sm:py-6 sm:text-lg"
              >
                <Link href={content.secondaryCta.href}>
                  {content.secondaryCta.label}
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={500}>
            <dl className="mt-16 grid gap-8 sm:mt-20 sm:grid-cols-3 sm:gap-10">
              {content.metrics.map((metric, _index) => (
                <div key={metric.label} className="text-center">
                  <dt className="text-sm font-medium tracking-wide text-white/70 sm:text-base">
                    {metric.label}
                  </dt>
                  <dd className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
