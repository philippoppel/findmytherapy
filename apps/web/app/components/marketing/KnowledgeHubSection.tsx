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
  const featuredPost = blogPosts[0]
  const heroImage = featuredPost?.featuredImage
  const highlightedPosts = blogPosts.slice(1, 5)
  const quickReadPosts = blogPosts.slice(5, 11)
  const highlightPoints = [
    'Evidenzbasierte Selbsttests',
    'Konkrete Schritt-für-Schritt-Anleitungen',
    'Neue Artikel fast jede Woche',
  ]

  return (
    <div className="flex h-full flex-col gap-8">
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Hero */}
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-secondary-200/60 bg-secondary-900 text-white shadow-2xl shadow-secondary-700/20"
          whileHover={
            !prefersReducedMotion
              ? { scale: 1.01, boxShadow: '0 25px 60px -20px rgba(107, 33, 168, 0.45)' }
              : {}
          }
          transition={{ duration: 0.4 }}
        >
          {heroImage && (
            <div className="absolute inset-0">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                className="object-cover opacity-50"
                priority
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/80 via-secondary-800/75 to-primary-900/80" />
          <div className="relative flex h-full flex-col justify-between gap-6 p-6 sm:p-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-secondary-50 backdrop-blur-sm">
                <BookOpenIcon />
                Gratis Expert:innen-Wissen
              </span>
              <div>
                <h3 className="text-2xl font-semibold sm:text-3xl">
                  {featuredPost?.title ?? 'Unser Blog für akute Fragen'}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary-100 sm:text-base">
                  {featuredPost?.excerpt ??
                    'Von Psychotherapeut:innen kuratierte Inhalte, damit du sofort konkrete Hilfe bekommst.'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-sm font-semibold text-secondary-900 transition hover:bg-white"
              >
                Alle Artikel entdecken
                <ArrowIcon />
              </Link>
              {featuredPost && (
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
                >
                  Beliebter Artikel
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Value props */}
        <motion.div
          className="rounded-3xl border border-secondary-100/60 bg-white/90 p-6 shadow-lg shadow-secondary-500/10 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary-700">
            Warum unser Blog wirkt
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-600">
            {highlightPoints.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <CheckCircleIcon className="mt-0.5 h-4 w-4 text-secondary-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-4 rounded-2xl bg-secondary-50/60 p-4 sm:grid-cols-2">
            {[
              { label: 'Artikel online', value: `${blogPosts.length}+` },
              { label: 'Autor:innen & Therapeut:innen', value: '12' },
              { label: 'Kosten', value: '0 €' },
              { label: 'Lesedauer', value: '~7 Min.' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xs uppercase tracking-wide text-secondary-600">{stat.label}</p>
                <p className="text-xl font-semibold text-secondary-900">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {['Akuthilfe', 'Selbstfürsorge', 'Arbeitswelt', 'Therapieformen', 'Diagnostik'].map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center rounded-full bg-secondary-100/80 px-3 py-1 text-xs font-semibold text-secondary-800"
              >
                {topic}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Blog feed */}
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary-700">Neu im Ratgeber</p>
            <p className="text-base text-neutral-600">
              Mehr Kontext, mehr Handlungsempfehlungen – endlich verständlich erklärt.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-700 underline-offset-4 hover:underline"
          >
            Alle ansehen
            <ArrowIcon />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {highlightedPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <InteractiveCard className="group h-full border border-secondary-100/60 bg-white/95 p-0 transition-all hover:border-secondary-300/80 hover:shadow-lg hover:shadow-secondary-200/50">
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex h-full flex-col gap-4 p-5 focus:outline-none focus-visible:ring-4 focus-visible:ring-secondary/40 sm:flex-row"
                >
                  {post.featuredImage && (
                    <div className="relative h-40 w-full overflow-hidden rounded-2xl sm:h-24 sm:w-24">
                      <Image
                        src={post.featuredImage.src}
                        alt={post.featuredImage.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
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

                  <div className="flex flex-1 flex-col gap-3">
                    <Badge variant="neutral" className="w-fit text-xs">
                      {post.category}
                    </Badge>
                    <h3 className="text-base font-semibold leading-tight text-neutral-900 transition-colors group-hover:text-secondary-600 sm:text-lg">
                      {post.title}
                    </h3>
                    <p className="text-sm text-neutral-600 line-clamp-2">{post.excerpt}</p>
                    <div className="mt-auto flex items-center gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <ClockIcon />
                        {post.readingTime}
                      </span>
                      <span>{new Date(post.publishedAt).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </Link>
              </InteractiveCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick reads carousel */}
      <motion.div
        className="rounded-3xl border border-secondary-100/60 bg-secondary-50/60 p-5 sm:p-6"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary-800">Schnell weiterlesen</p>
            <p className="text-sm text-secondary-700">Diese Themen werden gerade besonders oft gesucht.</p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-secondary-700 transition hover:border-secondary-300"
          >
            Zum Ratgeber
            <ArrowIcon />
          </Link>
        </div>
        <div className="-mx-1 mt-4 flex gap-3 overflow-x-auto pb-2 pt-1">
          {quickReadPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group relative min-w-[220px] flex-1 rounded-2xl bg-white/90 px-4 py-3 text-left shadow-sm ring-1 ring-secondary-100 transition hover:-translate-y-1 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary-600">{post.category}</p>
              <p className="mt-1 text-sm font-semibold text-neutral-900 line-clamp-2">{post.title}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                <ClockIcon />
                {post.readingTime}
              </div>
            </Link>
          ))}
        </div>
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
