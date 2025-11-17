'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { blogPosts } from '@/lib/blogData'
import { InteractiveCard } from '../InteractiveCard'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

export function KnowledgeHubSection() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const highlightPosts = blogPosts.slice(0, 4)
  const valueProps = [
    'Soforthilfe von erfahrenen Therapeut:innen',
    'Konkrete Übungen und Schritt-für-Schritt-Pläne',
    'Neue Artikel und Interviews jede Woche',
    'Alles kostenlos und ohne Anmeldung',
  ]

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Section hero */}
      <div className="rounded-3xl border border-secondary-100/70 bg-gradient-to-br from-white via-secondary-50 to-secondary-100/30 p-6 shadow-lg shadow-secondary-200/70 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-secondary-50">
            <BookOpenIcon />
            Gratis Expert:innen-Wissen
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-secondary-400/80 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-secondary-700 transition hover:border-secondary-500"
          >
            Alle Artikel
            <ArrowIcon />
          </Link>
        </div>
        <h2 className="mb-4 text-2xl font-bold text-neutral-900 sm:text-3xl">
          Soforthilfe zum Nachlesen
        </h2>
        <p className="mb-6 text-base leading-relaxed text-muted">
          Unser Blog liefert dir verständliche Antworten rund um mentale Gesundheit – von Akutsituationen bis Prävention. Jede Seite ist von Expert:innen geprüft.
        </p>
        <ul className="space-y-3 text-sm text-neutral-700">
          {valueProps.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary-500" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Highlight cards */}
      <div className="space-y-4">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-secondary-700">
            Beliebte Artikel
          </p>
          <p className="text-sm text-muted">
            Frisch veröffentlichte Artikel mit klaren Handlungsempfehlungen.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {highlightPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <InteractiveCard className="group h-full border border-secondary-100/60 bg-white p-0 transition-all hover:border-secondary-300/80 hover:shadow-lg hover:shadow-secondary-200/40">
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex h-full flex-col p-5 focus:outline-none focus-visible:ring-4 focus-visible:ring-secondary/40"
                >
                  {post.featuredImage && (
                    <div className="relative mb-4 h-40 w-full overflow-hidden rounded-2xl">
                      <Image
                        src={post.featuredImage.src}
                        alt={post.featuredImage.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {!prefersReducedMotion && (
                        <motion.div
                          aria-hidden
                          className="absolute inset-0 bg-gradient-to-br from-secondary-400/20 to-transparent"
                          animate={{ opacity: [0.3, 0.5, 0.3] }}
                          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary-600">
                    <span>{post.category}</span>
                    <span className="h-1 w-1 rounded-full bg-secondary-300" />
                    <span>{post.readingTime}</span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold leading-tight text-neutral-900 transition-colors group-hover:text-secondary-700">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted line-clamp-2">{post.excerpt}</p>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-secondary-500">
                    Jetzt lesen →
                  </span>
                </Link>
              </InteractiveCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        className="mt-auto"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
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
