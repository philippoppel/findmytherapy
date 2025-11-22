'use client'

import { motion } from 'framer-motion'
import { Search, Target, Grid3x3, Sparkles, Check } from 'lucide-react'
import { usePrefersReducedMotion } from '@/app/components/usePrefersReducedMotion'
import { MatchingLink } from '@/app/components/matching/MatchingLink'

export function TherapistSearchChoice() {
  const prefersReducedMotion = usePrefersReducedMotion()

  const handleScrollToSearch = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.getElementById('therapist-directory')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-surface/30 to-white py-12 sm:py-16">
      {/* Background decorations */}
      {!prefersReducedMotion ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/4 top-10 h-64 w-64 rounded-full bg-gradient-to-r from-primary-300/10 to-secondary-300/10 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -25, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-gradient-to-l from-secondary-300/10 to-primary-300/10 blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 25, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      ) : (
        <>
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.04),_transparent_40%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.04),_transparent_40%)]"
          />
        </>
      )}

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-10 text-center sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm">
              <Search className="h-4 w-4 text-primary-600" />
              <span>Finde deine:n Therapeut:in</span>
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Wie möchtest du suchen?
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Wähle zwischen einer geführten Suche mit personalisierten Empfehlungen oder durchsuche alle Profile selbst.
          </p>
        </motion.div>

        {/* Two Options Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Guided Matching Option */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <MatchingLink href="/match" className="block h-full">
              <motion.div
                className="group relative h-full overflow-hidden rounded-3xl border-2 border-primary-200/60 bg-gradient-to-br from-white via-primary-50/20 to-white p-6 shadow-xl shadow-primary-500/5 transition-all hover:border-primary-300 hover:shadow-2xl hover:shadow-primary-500/10 sm:p-8"
                whileHover={
                  !prefersReducedMotion
                    ? {
                        scale: 1.02,
                        y: -4,
                      }
                    : {}
                }
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                {/* Badge */}
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Empfohlen
                </div>

                {/* Icon */}
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30">
                  <Target className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="mb-3 text-2xl font-bold text-neutral-900">
                  Geführte Suche
                </h3>
                <p className="mb-5 text-base leading-relaxed text-muted">
                  Beantworte ein paar Fragen und erhalte personalisierte Empfehlungen mit Match-Prozenten – sortiert nach Passgenauigkeit.
                </p>

                {/* Features List */}
                <ul className="mb-6 space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm text-neutral-700">4-Schritt-Wizard mit intelligenten Fragen</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm text-neutral-700">Ergebnisse sortiert nach Match-Prozent</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm text-neutral-700">Detaillierte Erklärungen für jedes Match</span>
                  </li>
                </ul>

                {/* CTA */}
                <div className="flex items-center gap-2 text-primary-700 font-semibold group-hover:gap-3 transition-all">
                  Matching starten
                  <motion.span
                    className="text-xl"
                    animate={!prefersReducedMotion ? { x: [0, 4, 0] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    →
                  </motion.span>
                </div>

                {/* Hover gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-500/0 via-primary-500/0 to-primary-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>
            </MatchingLink>
          </motion.div>

          {/* Browse All Option */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a
              href="#therapist-directory"
              onClick={handleScrollToSearch}
              className="block h-full"
            >
              <motion.div
                className="group relative h-full overflow-hidden rounded-3xl border-2 border-neutral-200/60 bg-gradient-to-br from-white via-neutral-50/20 to-white p-6 shadow-xl shadow-neutral-500/5 transition-all hover:border-neutral-300 hover:shadow-2xl hover:shadow-neutral-500/10 sm:p-8"
                whileHover={
                  !prefersReducedMotion
                    ? {
                        scale: 1.02,
                        y: -4,
                      }
                    : {}
                }
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                {/* Icon */}
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 shadow-lg shadow-neutral-500/30">
                  <Grid3x3 className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="mb-3 text-2xl font-bold text-neutral-900">
                  Alle durchsuchen
                </h3>
                <p className="mb-5 text-base leading-relaxed text-muted">
                  Durchsuche und filtere alle verifizierten Therapeut:innen nach Standort, Spezialgebieten, Format und mehr. Volle Kontrolle.
                </p>

                {/* Features List */}
                <ul className="mb-6 space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-neutral-600" />
                    <span className="text-sm text-neutral-700">Alle Profile auf einen Blick</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-neutral-600" />
                    <span className="text-sm text-neutral-700">Erweiterte Filter & Suchfunktion</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-neutral-600" />
                    <span className="text-sm text-neutral-700">Frei durch alle Therapeut:innen scrollen</span>
                  </li>
                </ul>

                {/* CTA */}
                <div className="flex items-center gap-2 text-neutral-700 font-semibold group-hover:gap-3 transition-all">
                  Jetzt durchsuchen
                  <motion.span
                    className="text-xl"
                    animate={!prefersReducedMotion ? { x: [0, 4, 0] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    →
                  </motion.span>
                </div>

                {/* Hover gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-neutral-500/0 via-neutral-500/0 to-neutral-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>
            </a>
          </motion.div>
        </div>

        {/* Info text below */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-sm text-subtle">
            💡 Tipp: Die geführte Suche hilft dir, die passendsten Therapeut:innen basierend auf deinen spezifischen Bedürfnissen zu finden.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
