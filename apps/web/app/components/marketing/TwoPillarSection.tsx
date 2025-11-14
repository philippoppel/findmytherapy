'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Reveal } from './Reveal'
import { KnowledgeHubSection } from './KnowledgeHubSection'
import { TherapistSEOShowcase } from './TherapistSEOShowcase'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

export function TwoPillarSection() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Parallax effects for background elements
  const y1 = useTransform(smoothProgress, [0, 1], ['0%', '20%'])
  const y2 = useTransform(smoothProgress, [0, 1], ['0%', '-20%'])
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-surface via-white to-surface py-20 sm:py-24 lg:py-32"
    >
      {/* Background decorations with parallax */}
      {!prefersReducedMotion ? (
        <>
          <motion.div
            aria-hidden
            style={{ y: y1, opacity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.08),_transparent_50%)]"
          />
          <motion.div
            aria-hidden
            style={{ y: y2, opacity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(236,72,153,0.08),_transparent_50%)]"
          />
          <motion.div
            aria-hidden
            style={{ scale }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-400/10 via-transparent to-secondary-400/10 blur-3xl"
          />
          {/* Floating gradient orbs */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/4 top-20 h-96 w-96 rounded-full bg-gradient-to-r from-primary-300/20 to-secondary-300/20 blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-gradient-to-l from-secondary-300/20 to-primary-300/20 blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      ) : (
        <>
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.05),_transparent_50%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(236,72,153,0.05),_transparent_50%)]"
          />
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal className="mb-16 text-center">
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 px-5 py-2.5 text-sm font-medium text-neutral-800 shadow-sm">
              <HeartIcon className="h-4 w-4 text-primary-600" />
              <span>Unsere Mission</span>
            </div>
          </div>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Zwei Wege zu mentaler Gesundheit
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 sm:text-xl">
            Ob sofortige Hilfe durch Expert:innen-Wissen oder professionelle Begleitung durch
            verifizierte Therapeut:innen – wir sind für dich da.
          </p>
        </Reveal>

        {/* Two Pillars Grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Pillar: Knowledge Hub */}
          <Reveal className="flex" delay={100}>
            <motion.div
              className="group flex-1 rounded-3xl border border-secondary-200/60 bg-gradient-to-br from-white via-secondary-50/20 to-white p-6 shadow-xl shadow-secondary-500/5 sm:p-8 lg:p-10"
              whileHover={
                !prefersReducedMotion
                  ? {
                      scale: 1.02,
                      rotateY: -2,
                      rotateX: 2,
                      z: 50,
                      boxShadow: '0 25px 50px -12px rgba(236, 72, 153, 0.15)',
                    }
                  : {}
              }
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <KnowledgeHubSection />
            </motion.div>
          </Reveal>

          {/* Right Pillar: Therapist SEO Showcase */}
          <Reveal className="flex" delay={200}>
            <motion.div
              className="group flex-1 rounded-3xl border border-primary-200/60 bg-gradient-to-br from-white via-primary-50/20 to-white p-6 shadow-xl shadow-primary-500/5 sm:p-8 lg:p-10"
              whileHover={
                !prefersReducedMotion
                  ? {
                      scale: 1.02,
                      rotateY: 2,
                      rotateX: -2,
                      z: 50,
                      boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.15)',
                    }
                  : {}
              }
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <TherapistSEOShowcase />
            </motion.div>
          </Reveal>
        </div>

        {/* Bottom CTA with enhanced animation */}
        <Reveal className="mt-16 flex justify-center" delay={300}>
          <motion.div
            className="inline-flex w-full max-w-4xl flex-col items-center gap-5 rounded-3xl border border-neutral-200/60 bg-white/80 p-8 shadow-lg backdrop-blur-sm sm:flex-row sm:gap-6 sm:p-10"
            whileHover={
              !prefersReducedMotion
                ? {
                    scale: 1.02,
                    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
                  }
                : {}
            }
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex-1 text-center sm:text-left"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="mb-2 text-xl font-semibold text-neutral-900">
                Bereit für den nächsten Schritt?
              </p>
              <p className="text-base text-neutral-600">
                Entdecke kostenlose Artikel oder finde deine:n Therapeut:in.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col gap-3 sm:flex-row sm:gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.a
                href="/blog"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-secondary-400/60 bg-white px-6 py-3 text-sm font-semibold text-secondary-700 transition-colors hover:border-secondary-500 hover:bg-secondary-50"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Wissen entdecken
              </motion.a>
              <motion.a
                href="#therapist-search"
                className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition-colors hover:bg-primary-700"
                whileHover={{ scale: 1.05, y: -2, boxShadow: '0 20px 40px -12px rgba(59, 130, 246, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                Therapie-Suche starten
                {!prefersReducedMotion && (
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    →
                  </motion.span>
                )}
              </motion.a>
            </motion.div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  )
}
