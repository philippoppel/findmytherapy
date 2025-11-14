'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { Button } from '@mental-health/ui'
import type { heroContent } from '../../marketing-content'
import { Reveal } from './Reveal'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface HeroProps {
  content: typeof heroContent
}

export function MarketingHero({ content }: HeroProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const heroRef = useRef<HTMLDivElement | null>(null)
  const mouseX = useMotionValue(50)
  const mouseY = useMotionValue(50)
  const smoothX = useSpring(mouseX, { stiffness: 110, damping: 26, mass: 0.6 })
  const smoothY = useSpring(mouseY, { stiffness: 110, damping: 26, mass: 0.6 })
  const spotlight = useMotionTemplate`radial-gradient(circle at ${smoothX}% ${smoothY}%, rgba(255,255,255,0.28), transparent 60%)`
  const accentGlow = useMotionTemplate`radial-gradient(circle at ${smoothX}% ${smoothY}%, rgba(56,189,248,0.28), transparent 65%)`

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return
    const bounds = heroRef.current?.getBoundingClientRect()
    if (!bounds) return
    const relativeX = ((event.clientX - bounds.left) / bounds.width) * 100
    const relativeY = ((event.clientY - bounds.top) / bounds.height) * 100
    mouseX.set(relativeX)
    mouseY.set(relativeY)
  }

  const resetPointer = () => {
    mouseX.set(50)
    mouseY.set(50)
  }

  const floatingInsights = [
    {
      title: 'Validierte Tests',
      value: content.metrics[0]?.value ?? 'PHQ-9 & GAD-7',
      position: 'top-12 right-8',
      delay: 0,
    },
    {
      title: 'Ergebnis in Minuten',
      value: content.metrics[1]?.value ?? '< 5 Min.',
      position: 'bottom-16 left-10',
      delay: 0.7,
    },
  ]

  const floatingOrbs = [
    { position: 'top-[-10%] left-1/4 h-56 w-56 bg-primary-500/25', duration: 16, delay: 0 },
    { position: 'bottom-[-18%] right-1/4 h-64 w-64 bg-secondary-400/20', duration: 18, delay: 0.4 },
  ]

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden rounded-2xl shadow-soft-xl"
      aria-labelledby="hero-heading"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
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
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/80 via-neutral-900/70 to-primary-900/75 backdrop-blur-[2px]" />
      </div>

      {!prefersReducedMotion && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] opacity-60"
            style={{ background: accentGlow }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[2] opacity-80 mix-blend-screen"
            style={{ background: spotlight }}
          />
          {floatingOrbs.map((orb) => (
            <motion.span
              key={orb.position}
              aria-hidden
              className={`pointer-events-none absolute z-[3] rounded-full blur-3xl ${orb.position}`}
              animate={{ opacity: [0.35, 0.6, 0.35], scale: [0.9, 1.1, 0.9], y: [0, -14, 0] }}
              transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
          {floatingInsights.map((badge) => (
            <motion.div
              key={badge.title}
              aria-hidden
              className={`pointer-events-none absolute z-[4] hidden rounded-2xl border border-white/30 bg-white/10 px-6 py-4 text-left text-white backdrop-blur-md lg:block ${badge.position}`}
              animate={{ y: [0, -12, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 10, delay: badge.delay, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">{badge.title}</p>
              <p className="mt-1 text-xl font-bold">{badge.value}</p>
            </motion.div>
          ))}
        </>
      )}

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
            <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:mt-14 sm:gap-6">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
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

              {/* Emergency CTA - Prominent for immediate help */}
              {content.emergencyCta && (
                <div className="w-full sm:w-auto">
                  <Button
                    asChild
                    size="lg"
                    className="w-full border-2 border-red-400/60 bg-red-500/20 text-white shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 hover:scale-105 hover:border-red-400/80 hover:bg-red-500/30 hover:shadow-2xl sm:px-10 sm:py-6 sm:text-lg"
                  >
                    <Link href={content.emergencyCta.href} className="flex items-center justify-center gap-2">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      {content.emergencyCta.label}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={500}>
            <div className="mt-20 sm:mt-24">
              <dl className="mx-auto flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-10 lg:gap-12">
                {content.metrics.map((metric) => (
                  <motion.div
                    key={metric.label}
                    className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-white/20 bg-white/10 px-8 py-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur"
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : { y: -8, scale: 1.03 }
                    }
                    transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                  >
                    <dd className="text-4xl font-bold text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
                      {metric.value}
                    </dd>
                    <dt className="mt-3 text-base font-medium tracking-wide text-white/85 sm:text-lg">
                      {metric.label}
                    </dt>
                  </motion.div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
