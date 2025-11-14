'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Reveal } from './Reveal'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'
import { teamContent } from '../../marketing-content'

export function AboutSection() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Verifizierte Expert:innen',
      description: 'Alle Therapeut:innen werden sorgfältig geprüft und verifiziert.',
      color: 'primary',
    },
    {
      icon: HeartIcon,
      title: 'Mit Empathie entwickelt',
      description: 'Von Menschen für Menschen - mit echtem Verständnis für mentale Gesundheit.',
      color: 'secondary',
    },
    {
      icon: LockIcon,
      title: 'DSGVO-konform',
      description: 'Deine Daten bleiben in der EU. Volle Transparenz und Kontrolle.',
      color: 'primary',
    },
    {
      icon: SparklesIcon,
      title: 'Wissenschaftlich fundiert',
      description: 'Basierend auf evidenzbasierten Methoden und aktueller Forschung.',
      color: 'secondary',
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-neutral-50 to-white py-20 sm:py-24 lg:py-32"
    >
      {/* Background decorations */}
      {!prefersReducedMotion ? (
        <>
          <motion.div
            aria-hidden
            style={{ y, opacity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.05),_transparent_60%)]"
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/3 top-20 h-72 w-72 rounded-full bg-gradient-to-r from-primary-200/30 to-secondary-200/30 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.05),_transparent_60%)]"
        />
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="mb-16 text-center">
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 px-5 py-2.5 text-sm font-medium text-neutral-800 shadow-sm">
              <UsersIcon className="h-4 w-4 text-primary-600" />
              <span>Über uns</span>
            </div>
          </div>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            {teamContent.heading}
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 sm:text-xl">
            {teamContent.description}
          </p>
        </Reveal>

        {/* Team Members */}
        <div className="mb-20 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-16">
          <Reveal delay={100}>
            <div className="grid gap-6 sm:grid-cols-2">
              {teamContent.members.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="group rounded-3xl border border-neutral-200/60 bg-white/95 p-4 shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={!prefersReducedMotion ? { translateY: -6, scale: 1.02 } : {}}
                >
                  <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100">
                    <Image
                      src={member.image}
                      alt={`Portrait von ${member.name}, ${member.role} bei FindMyTherapy`}
                      fill
                      className="object-cover object-top"
                      sizes="(min-width: 1024px) 240px, (min-width: 640px) 50vw, 100vw"
                      priority={index === 0}
                    />
                    {!prefersReducedMotion && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                        initial={{ opacity: 0.4 }}
                        whileHover={{ opacity: 0.6 }}
                        transition={{ duration: 0.4 }}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
                      Founder Team
                    </p>
                    <p className="mt-2 text-xl font-bold text-neutral-900">{member.name}</p>
                    <p className="text-sm font-medium text-neutral-600">{member.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-600">{member.focus}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="mb-4 text-2xl font-bold text-neutral-900 sm:text-3xl">
                  Unsere Mission
                </h3>
                <p className="mb-4 text-lg leading-relaxed text-neutral-600">
                  Wir glauben, dass jede:r Zugang zu qualifizierter psychologischer Unterstützung
                  haben sollte - transparent, sicher und auf Augenhöhe.
                </p>
                <p className="text-lg leading-relaxed text-neutral-600">
                  Deshalb verbinden wir evidenzbasiertes Wissen mit modernster Technologie, um die
                  Suche nach dem:der richtigen Therapeut:in zu vereinfachen.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {[
                  { label: 'Verifizierte Therapeut:innen', icon: '✓' },
                  { label: 'EU-Datenschutz', icon: '🔒' },
                  { label: 'Wissenschaftlich fundiert', icon: '📚' },
                ].map((badge, index) => (
                  <motion.div
                    key={badge.label}
                    className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/50 px-4 py-2 text-sm font-medium text-primary-800"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + index * 0.1,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Reveal>
        </div>

        {/* Values Grid */}
        <Reveal delay={300}>
          <h3 className="mb-12 text-center text-3xl font-bold text-neutral-900">
            Unsere Werte
          </h3>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="group rounded-2xl border border-neutral-200/60 bg-white/80 p-6 backdrop-blur-sm transition-all hover:border-primary-200 hover:shadow-xl hover:shadow-primary-100/50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={!prefersReducedMotion ? { y: -8, scale: 1.02 } : {}}
            >
              <motion.div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                  value.color === 'primary' ? 'bg-primary-100' : 'bg-secondary-100'
                } group-hover:${value.color === 'primary' ? 'bg-primary-200' : 'bg-secondary-200'}`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <value.icon
                  className={`h-6 w-6 ${
                    value.color === 'primary' ? 'text-primary-600' : 'text-secondary-600'
                  }`}
                />
              </motion.div>
              <h4 className="mb-2 text-lg font-semibold text-neutral-900">{value.title}</h4>
              <p className="text-sm leading-relaxed text-neutral-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  )
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  )
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  )
}
