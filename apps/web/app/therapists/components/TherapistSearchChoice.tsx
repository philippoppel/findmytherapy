'use client'

import { motion } from 'framer-motion'
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
              <SearchIcon className="h-4 w-4 text-primary-600" />
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
                  <SparklesIcon className="h-3.5 w-3.5" />
                  Empfohlen
                </div>

                {/* Icon */}
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30">
                  <TargetIcon className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="mb-3 text-2xl font-bold text-neutral-900">
                  Geführte Suche
                </h3>
                <p className="mb-5 text-base leading-relaxed text-muted">
                  Beantworte ein paar Fragen über deine Bedürfnisse und erhalte personalisierte Therapeuten-Empfehlungen mit Passungs-Scores.
                </p>

                {/* Features List */}
                <ul className="mb-6 space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm text-neutral-700">4-Schritt-Wizard mit intelligenten Fragen</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm text-neutral-700">Matches sortiert nach Passungs-Score</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
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
                  <GridIcon className="h-7 w-7 text-white" />
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
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-neutral-600" />
                    <span className="text-sm text-neutral-700">Alle Profile auf einen Blick</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-neutral-600" />
                    <span className="text-sm text-neutral-700">Erweiterte Filter & Suchfunktion</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-neutral-600" />
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

// Icons
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  )
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  )
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  )
}
