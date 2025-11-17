'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Button, cn } from '@mental-health/ui'
import { Reveal } from './Reveal'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

type JourneyStep = {
  phase: string
  title: string
  kicker: string
  description: string
  highlights: string[]
}

const journeySteps: JourneyStep[] = [
  {
    phase: '01',
    title: 'Digitale Ersteinschätzung',
    kicker: 'PHQ-9 · GAD-7 · WHO-5',
    description:
      'Validierte Fragebögen liefern in weniger als 5 Minuten ein Ampel-Ergebnis mit konkreten Empfehlungen für Österreich. Nutzer:innen behalten vollständige Kontrolle über ihre Daten.',
    highlights: [
      'Ampel-System plus Handlungsoptionen (Selbsthilfe, Termin, Soforthilfe)',
      'Verständliche Ergebnisgrafiken und medizinisch korrekte Texte',
      'DSGVO-konforme Speicherung auf europäischen Servern',
    ],
  },
  {
    phase: '02',
    title: 'Matching & Praxis-Workflow',
    kicker: 'Therapeut:innen in Österreich',
    description:
      'Wir gleichen Intake-Daten mit verifizierten Therapeut:innen-Profilen und aktuellen Verfügbarkeiten ab. Therapeut:innen erhalten Vorberichte – Termine starten fokussiert.',
    highlights: [
      'Feinsortierte Filter (Standort, Modalität, Versicherung, Sprache)',
      'Verifizierte Profile mit transparenten Preisen und Kapazitäten',
      'Direkte Anfrage oder Wartelisten-Slots mit Begleitung durch unser Team',
    ],
  },
  {
    phase: '03',
    title: 'Begleitung & Kurse',
    kicker: 'Programme von Therapeut:innen',
    description:
      'Personalisierte Inhalte, Übungen und Mini-Kurse unterstützen zwischen Sitzungen. Fortschritte lassen sich mit Therapeut:innen teilen – alles an einem Ort.',
    highlights: [
      'Freigeschaltete Selbsthilfe-Inhalte passend zur Triage',
      'Regelmäßige Check-ins sowie Erinnerungen an Termine',
      'Begleitender Support per Mail oder Chat bei Fragen & Krisen',
    ],
  },
]

export function JourneyShowcase() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 0.85])
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 sm:py-24 lg:py-32"
      aria-labelledby="journey-heading"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-white via-primary-50/35 to-surface-1"
      />
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-secondary-400/15 to-transparent blur-3xl"
          style={{ opacity: glowOpacity }}
        />
      )}

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:flex-row lg:items-start lg:gap-16 lg:px-8">
        <div className="lg:w-[320px] lg:flex-shrink-0">
          <Reveal>
            <div>
              <span className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-primary-800">
                So funktioniert FindMyTherapy
              </span>
              <h2
                id="journey-heading"
                className="mt-6 text-pretty text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl"
              >
                Ein fließender Ablauf – von Unsicherheit zu professioneller Hilfe.
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">
                Unsere Plattform verbindet digitale Ersteinschätzung, persönliches Matching und begleitende Programme.
                Alle Inhalte bleiben crawlbar und suchmaschinenfreundlich – SEO-optimiert ohne technische Spielereien.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-8 flex flex-col gap-4">
              <Button asChild size="lg">
                <Link href="/triage">
                  Ersteinschätzung testen
                </Link>
              </Button>
              <button
                type="button"
                className="inline-flex items-center justify-start gap-2 text-sm font-semibold text-primary transition hover:text-primary-600"
                onClick={() => {
                  document.getElementById('therapists')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Verified Therapists ansehen
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <motion.figure
              className="mt-10 overflow-hidden rounded-3xl border border-primary-100/70 bg-white/80 shadow-soft-lg"
              animate={
                prefersReducedMotion
                  ? undefined
                  : { y: [-4, 8, -4] }
              }
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src="/images/therapists/therapy-1.jpg"
                alt="Digitale Erstberatung und Therapiesitzung bei FindMyTherapy"
                width={640}
                height={480}
                className="h-full w-full object-cover"
                priority={false}
              />
              {!prefersReducedMotion && (
                <motion.div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-tr from-primary-600/10 via-transparent to-secondary-500/20 mix-blend-multiply"
                  animate={{ opacity: [0.55, 0.85, 0.55] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </motion.figure>
          </Reveal>
        </div>

        <div className="flex-1 space-y-6">
          {journeySteps.map((step, index) => (
            <JourneyStepCard
              key={step.phase}
              step={step}
              index={index}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface JourneyStepCardProps {
  step: JourneyStep
  index: number
  activeStep: number
  setActiveStep: (index: number) => void
  prefersReducedMotion: boolean
}

function JourneyStepCard({
  step,
  index,
  activeStep,
  setActiveStep,
  prefersReducedMotion,
}: JourneyStepCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const inView = useInView(cardRef, { amount: 0.5, margin: '-10% 0px -10% 0px' })

  useEffect(() => {
    if (inView) {
      setActiveStep(index)
    }
  }, [inView, index, setActiveStep])

  const isActive = activeStep === index

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      className={cn(
        'relative overflow-hidden rounded-3xl border bg-white/95 p-6 shadow-soft transition-colors sm:p-8',
        isActive ? 'border-primary-200 shadow-2xl' : 'border-white/40',
      )}
      onPointerEnter={() => setActiveStep(index)}
      whileHover={
        prefersReducedMotion
          ? undefined
          : { y: -8, scale: 1.01 }
      }
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
    >
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-100/0 via-primary-100/60 to-transparent opacity-0 transition-opacity duration-500"
          animate={{ opacity: isActive ? 1 : 0 }}
        />
      )}

      <div className="relative z-[1]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">
            {step.phase}
          </span>
          <span className="text-xs font-semibold text-primary/80">{step.kicker}</span>
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-neutral-900 sm:text-3xl">
          {step.title}
        </h3>
        <p className="mt-3 text-pretty text-base leading-relaxed text-muted">
          {step.description}
        </p>
        <ul className="mt-6 space-y-2 text-sm leading-relaxed text-neutral-900 sm:text-base">
          {step.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2 text-pretty">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 h-1 rounded-full bg-neutral-200/70">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400"
            animate={{ width: isActive ? '100%' : '35%' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.article>
  )
}
