'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { blogPosts } from '@/lib/blogData'
import { Badge } from '@mental-health/ui'
import { InteractiveCard } from '../InteractiveCard'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

export function KnowledgeHubSection() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const recentPosts = blogPosts.slice(0, 3)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-4 py-2 text-sm font-medium text-secondary-800">
            <BookOpenIcon />
            <span>Wissen & Soforthilfe</span>
          </div>
        </div>
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Gratis Expert:innen-Wissen
        </h2>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-neutral-600 sm:text-lg">
          Von anerkannten Psychotherapeut:innen. Evidenzbasierte Informationen für
          sofortige Hilfe – vielleicht erspart es dir einen Besuch.
        </p>
      </div>

      {/* Blog Posts Grid with stagger animation */}
      <div className="mb-8 flex-1 space-y-4">
        {recentPosts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
          >
            <InteractiveCard className="group border border-secondary-100/60 bg-white/95 p-0 transition-all hover:border-secondary-300/80 hover:shadow-lg hover:shadow-secondary-200/50">
              <Link
                href={`/blog/${post.slug}`}
                className="flex items-stretch gap-4 p-5 focus:outline-none focus-visible:ring-4 focus-visible:ring-secondary/40"
              >
              {post.featuredImage && (
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
                  <Image
                    src={post.featuredImage.src}
                    alt={post.featuredImage.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {!prefersReducedMotion && (
                    <motion.div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-br from-secondary-400/20 to-transparent mix-blend-screen"
                      animate={{ opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                </div>
              )}

              <div className="flex flex-1 flex-col gap-2">
                <Badge variant="neutral" className="w-fit text-xs">
                  {post.category}
                </Badge>
                <h3 className="text-base font-semibold leading-tight text-neutral-900 transition-colors group-hover:text-secondary-600 sm:text-lg">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <ClockIcon />
                    {post.readingTime}
                  </span>
                </div>
              </div>
            </Link>
          </InteractiveCard>
          </motion.div>
        ))}
      </div>

      {/* Highlights with stagger */}
      <motion.div
        className="mb-6 grid grid-cols-2 gap-4 rounded-2xl bg-secondary-50/50 p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {[
          { title: 'Echte Expert:innen', subtitle: 'Anerkannte Therapeut:innen', delay: 0.5 },
          { title: 'Sofort verfügbar', subtitle: 'Keine Wartezeit', delay: 0.6 },
          { title: 'Evidenzbasiert', subtitle: 'Wissenschaftlich fundiert', delay: 0.7 },
          { title: '100% kostenlos', subtitle: 'Frei zugänglich', delay: 0.8 },
        ].map((item) => (
          <motion.div
            key={item.title}
            className="flex items-start gap-2.5"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: item.delay }}
          >
            <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary-600" />
            <div>
              <p className="text-sm font-semibold leading-tight text-neutral-900">{item.title}</p>
              <p className="mt-1 text-xs leading-snug text-neutral-600">{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA with animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <Link
          href="/blog"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-secondary-400/60 bg-white/80 px-6 py-3 text-base font-semibold text-secondary-700 shadow-sm transition-all hover:border-secondary-500 hover:bg-secondary-50 hover:scale-105 hover:shadow-lg hover:shadow-secondary-200/50"
        >
          Alle Artikel entdecken
          <motion.span
            className="inline-block"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowIcon />
          </motion.span>
        </Link>
      </motion.div>
    </div>
  )
}

function BookOpenIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
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
