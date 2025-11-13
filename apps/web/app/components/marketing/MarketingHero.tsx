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
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/80 via-neutral-900/70 to-primary-900/75 backdrop-blur-sm" />
      </div>

      {/* Content over video */}
      <div className="relative z-10 px-6 py-24 text-white sm:px-8 sm:py-32 md:py-40 lg:px-12 lg:py-52">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal delay={100}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-lg backdrop-blur-md sm:gap-3 sm:px-7 sm:py-3.5 sm:text-base">
              {content.eyebrow}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h1
              id="hero-heading"
              className="mt-10 text-balance text-5xl font-bold leading-tight tracking-tight text-white drop-shadow-lg sm:mt-12 sm:text-7xl lg:text-8xl"
            >
              {content.title}
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="mx-auto mt-10 max-w-3xl text-pretty text-xl leading-relaxed text-white drop-shadow-md sm:mt-12 sm:text-2xl lg:text-3xl">
              {content.highlight}
            </p>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:mt-14 sm:flex-row sm:gap-6">
              <Button
                asChild
                size="lg"
                variant="primary"
                className="w-full shadow-2xl transition-all hover:-translate-y-1 hover:scale-105 hover:shadow-2xl sm:w-auto sm:px-12 sm:py-7 sm:text-xl"
              >
                <Link href={content.primaryCta.href}>
                  {content.primaryCta.label}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="w-full border-2 border-white/40 bg-white/15 text-white shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 hover:scale-105 hover:border-white/50 hover:bg-white/25 hover:shadow-2xl sm:w-auto sm:px-12 sm:py-7 sm:text-xl"
              >
                <Link href={content.secondaryCta.href}>
                  {content.secondaryCta.label}
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={500}>
            <div className="mt-20 sm:mt-24">
              <dl className="mx-auto flex flex-col items-center justify-center gap-12 sm:flex-row sm:gap-16 lg:gap-20">
                {content.metrics.map((metric, _index) => (
                  <div key={metric.label} className="flex flex-col items-center text-center">
                    <dd className="text-5xl font-bold text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
                      {metric.value}
                    </dd>
                    <dt className="mt-4 text-base font-medium tracking-wide text-white/90 sm:text-lg">
                      {metric.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
