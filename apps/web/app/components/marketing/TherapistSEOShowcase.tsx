'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { InteractiveCard } from '../InteractiveCard'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

export function TherapistSEOShowcase() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-800">
            <SparklesIcon />
            <span>Für Therapeut:innen</span>
          </div>
        </div>
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          SEO-optimierte Präsenz
        </h2>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-neutral-600 sm:text-lg">
          Professionelle Microsites für jede:n Therapeut:in. Von SEO-Expert:innen
          optimiert für maximale Sichtbarkeit.
        </p>
      </div>

      {/* Microsite Preview Example with enhanced animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <InteractiveCard className="group mb-6 border border-primary-100/60 bg-white/95 p-6 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-200/30">
          <motion.div
            className="mb-4 flex items-center gap-3"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 group-hover:bg-primary-200"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <GlobeIcon className="h-6 w-6 text-primary-600" />
            </motion.div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-600">Deine persönliche Microsite</p>
              <p className="text-lg font-semibold text-primary-600">
                findmytherapy.com/t/<span className="text-neutral-400">[dein-name]</span>
              </p>
            </div>
          </motion.div>
          <motion.div
            className="relative overflow-hidden rounded-xl border-2 border-dashed border-primary-200 bg-primary-50/30 p-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              className="mb-3 flex items-center justify-between"
              initial={{ x: -10, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="h-10 w-10 rounded-full bg-primary-200"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div>
                  <motion.div
                    className="mb-1 h-3 w-24 rounded bg-primary-200"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="h-2 w-16 rounded bg-primary-100" />
                </div>
              </div>
              <div className="h-6 w-16 rounded-full bg-primary-200" />
            </motion.div>
            <div className="space-y-2">
              {[1, 0.83, 0.66].map((width, i) => (
                <motion.div
                  key={i}
                  className="h-2 rounded bg-primary-100"
                  style={{ width: `${width * 100}%` }}
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                />
              ))}
            </div>
            {!prefersReducedMotion && (
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-primary-300/40 to-transparent"
                animate={{ x: [-300, 300] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              />
            )}
          </motion.div>
          <motion.p
            className="mt-4 text-center text-sm text-neutral-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Vollständig anpassbar und für Suchmaschinen optimiert
          </motion.p>
        </InteractiveCard>
      </motion.div>

      {/* SEO Features Grid with stagger */}
      <div className="mb-6 space-y-3">
        {[
          {
            icon: SearchIcon,
            title: 'Von SEO-Expert:innen optimiert',
            description: 'Dein Profil wird bei Google gefunden – ohne dass du selbst Hand anlegen musst.',
            delay: 0.2,
          },
          {
            icon: UserGroupIcon,
            title: 'Professionelle Präsentation',
            description: 'Showcase deiner Expertise, Methoden, Erfahrung und Spezialisierungen.',
            delay: 0.3,
          },
          {
            icon: ChartIcon,
            title: 'Maximale Sichtbarkeit',
            description: 'Erreiche Patient:innen genau dann, wenn sie nach Unterstützung suchen.',
            delay: 0.4,
          },
          {
            icon: ShieldCheckIcon,
            title: 'Verifizierte Profile',
            description: 'Authentizität durch Verifizierung – schaffe Vertrauen bei Patient:innen.',
            delay: 0.5,
          },
        ].map((feature) => (
          <motion.div
            key={feature.title}
            className="group flex items-start gap-3 rounded-2xl border border-primary-100/60 bg-white/95 p-4 transition-all hover:border-primary-200 hover:shadow-lg hover:shadow-primary-200/30"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: feature.delay }}
            whileHover={{ scale: 1.02, x: 4 }}
          >
            <motion.div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 group-hover:bg-primary-200"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <feature.icon className="h-5 w-5 text-primary-600" />
            </motion.div>
            <div className="flex-1">
              <h3 className="mb-1 text-base font-semibold text-neutral-900">{feature.title}</h3>
              <p className="text-sm text-neutral-600">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats with stagger animation */}
      <motion.div
        className="mb-6 grid grid-cols-2 gap-4 rounded-2xl bg-primary-50/50 p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {[
          { value: '95%', label: 'Finden durch Google', delay: 0.7 },
          { value: '24/7', label: 'Sichtbar & erreichbar', delay: 0.8 },
          { value: '100%', label: 'SEO-optimiert', delay: 0.9 },
          { value: '0€', label: 'Setup-Kosten', delay: 1.0 },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: stat.delay,
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
            whileHover={{ scale: 1.1, y: -4 }}
          >
            <motion.p
              className="mb-1 text-2xl font-bold text-primary-700"
              initial={{ y: -10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: stat.delay + 0.1 }}
            >
              {stat.value}
            </motion.p>
            <p className="text-xs leading-snug text-neutral-600">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA with enhanced animation */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.1, type: 'spring', stiffness: 150 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/for-therapists"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary-600/30 transition-all hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/40"
          >
            Als Therapeut:in registrieren
            <motion.span
              className="inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowIcon />
            </motion.span>
          </Link>
        </motion.div>
        <motion.p
          className="mt-3 text-center text-xs text-neutral-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          Kostenlose Registrierung. Keine versteckten Kosten.
        </motion.p>
      </motion.div>
    </div>
  )
}

function SparklesIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  )
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
      />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )
}

function UserGroupIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  )
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
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

function ArrowIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}
