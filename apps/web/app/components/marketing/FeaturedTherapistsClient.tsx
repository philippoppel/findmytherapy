'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Star, MapPin, CheckCircle2 } from 'lucide-react'
import { Reveal } from './Reveal'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'
import { PlaceholderImage } from '../therapist-search/PlaceholderImage'
import type { TherapistWithListing } from '../therapist-search/types'

interface FeaturedTherapistsClientProps {
  therapists: TherapistWithListing[]
  stats: {
    total: number
    accepting: number
    online: number
  }
}

function formatLocation(city?: string | null, online?: boolean) {
  const parts: string[] = []
  if (city) parts.push(city)
  if (online) parts.push('Online')
  if (parts.length === 0) return 'Standort auf Anfrage'
  return parts.join(' & ')
}

export function FeaturedTherapistsClient({ therapists, stats }: FeaturedTherapistsClientProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const safeTherapists = Array.isArray(therapists) ? therapists : []
  const hasTherapists = safeTherapists.length > 0

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  if (!hasTherapists) {
    return null
  }

  return (
    <section ref={sectionRef} className="relative">
      {/* Background decorations */}
      {!prefersReducedMotion ? (
        <>
          <motion.div
            aria-hidden
            style={{ y, opacity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.08),_transparent_50%)]"
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-gradient-to-l from-teal-200/30 to-primary-200/30 blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.08),_transparent_50%)]"
        />
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="mb-16 text-center">
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-100 to-primary-100 px-5 py-2.5 text-sm font-medium text-neutral-800 shadow-sm">
              <UsersIcon className="h-4 w-4 text-teal-600" />
              <span>Verifizierte Therapeut:innen</span>
            </div>
          </div>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Professionelle Unterstützung finden
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 sm:text-xl">
            Alle Therapeut:innen sind verifiziert, haben transparente Profile und eigene
            SEO-optimierte Microsites für maximale Auffindbarkeit.
          </p>
        </Reveal>

        {/* Stats */}
        <Reveal delay={100}>
          <div className="mb-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                value: stats.total,
                label: 'Verifizierte Therapeut:innen',
                icon: '✓',
                color: 'teal',
              },
              {
                value: stats.accepting,
                label: 'Nehmen neue Patient:innen',
                icon: '👋',
                color: 'primary',
              },
              {
                value: stats.online,
                label: 'Bieten Online-Sitzungen',
                icon: '💻',
                color: 'secondary',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="rounded-2xl border border-neutral-200/60 bg-white/80 p-6 text-center backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 150,
                }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <motion.div
                  className="mb-2 text-3xl"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1 + 0.2,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  {stat.icon}
                </motion.div>
                <motion.p
                  className="mb-1 text-3xl font-bold text-neutral-900"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-neutral-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* Therapists Grid */}
        <div className="mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {safeTherapists.map((therapist, index) => (
            <motion.div
              key={therapist.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <motion.div
                whileHover={
                  !prefersReducedMotion
                    ? {
                        y: -8,
                        scale: 1.02,
                        boxShadow: '0 20px 40px -12px rgba(13, 148, 136, 0.2)',
                      }
                    : {}
                }
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/therapists/${therapist.id}`}
                  className="block h-full overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/95 shadow-lg transition-all hover:border-teal-200"
                >
                  {/* Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-neutral-50">
                    {therapist.profileImageUrl ? (
                      <Image
                        src={therapist.profileImageUrl}
                        alt={therapist.displayName || 'Therapeut:in'}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                      />
                    ) : (
                      <PlaceholderImage
                        therapistId={therapist.id}
                        displayName={therapist.displayName || undefined}
                        className="h-full w-full"
                      />
                    )}
                    {!prefersReducedMotion && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    {therapist.status === 'VERIFIED' && (
                      <div className="absolute right-4 top-4 rounded-full bg-teal-500 p-1.5 shadow-lg">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold text-neutral-900">
                      {therapist.displayName || 'Therapeut:in'}
                    </h3>

                    {therapist.specialties[0] && (
                      <p className="mb-3 text-sm font-medium text-teal-700">
                        {therapist.specialties[0]}
                      </p>
                    )}

                    <p className="mb-4 line-clamp-2 text-sm text-neutral-600">
                      {therapist.approachSummary ||
                        therapist.modalities[0] ||
                        'Individuelle Begleitung'}
                    </p>

                    {/* Meta Info */}
                    <div className="space-y-2 text-xs text-neutral-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{formatLocation(therapist.city, therapist.online)}</span>
                      </div>

                      {therapist.rating && therapist.reviewCount ? (
                        <div className="flex items-center gap-2">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>
                            {therapist.rating.toFixed(1)} ({therapist.reviewCount} Bewertungen)
                          </span>
                        </div>
                      ) : null}

                      {therapist.yearsExperience && (
                        <div className="flex items-center gap-2">
                          <span>📚</span>
                          <span>{therapist.yearsExperience}+ Jahre Erfahrung</span>
                        </div>
                      )}
                    </div>

                    {/* Availability Badge */}
                    {therapist.acceptingClients && (
                      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                        Nimmt neue Patient:innen
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={200}>
          <div className="flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/therapists"
                className="group inline-flex items-center gap-3 rounded-full bg-teal-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-teal-600/30 transition-all hover:bg-teal-700 hover:shadow-2xl hover:shadow-teal-600/40"
              >
                Alle Therapeut:innen ansehen
                {!prefersReducedMotion && (
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    →
                  </motion.span>
                )}
              </Link>
            </motion.div>
          </div>
        </Reveal>
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
