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
  const heroPost = blogPosts[0]
  const featuredPosts = blogPosts.slice(1, 5)
  const quickReadPosts = blogPosts.slice(5, 11)

  return (
    <div className="flex h-full flex-col gap-8">
      {/* Section header */}
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-4 py-2 text-sm font-medium text-secondary-800">
            <BookOpenIcon />
            <span>Gratis Expert:innen-Wissen</span>
          </div>
        </div>
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Soforthilfe zum Nachlesen
        </h2>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
          Von Psychotherapeut:innen kuratierte Beiträge, klare Schritt-für-Schritt-Anleitungen und echte Praxisbeispiele.
          Ohne Paywall, ohne Registrierungszwang.
        </p>
      </div>

      {/* Hero highlight */}
      {heroPost && (
        <motion.div
          className="overflow-hidden rounded-3xl border border-secondary-200/60 bg-white shadow-xl shadow-secondary-200/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href={`/blog/${heroPost.slug}`}
            className="flex flex-col gap-4 lg:flex-row"
          >
            {heroPost.featuredImage && (
              <div className="relative h-60 w-full flex-shrink-0 lg:h-auto lg:w-2/5">
                <Image
                  src={heroPost.featuredImage.src}
                  alt={heroPost.featuredImage.alt}
                  fill
                  className="object-cover"
                  priority
                />
                {!prefersReducedMotion && (
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-br from-secondary-500/50 to-transparent"
                    animate={{ opacity: [0.3, 0.55, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </div>
            )}
            <div className="flex flex-1 flex-col gap-4 p-6 lg:p-8">
              <div>
                <Badge variant="neutral" className="mb-3 w-fit text-xs">
                  {heroPost.category}
                </Badge>
                <h3 className="text-2xl font-semibold text-neutral-900">{heroPost.title}</h3>
                <p className="mt-3 text-base text-neutral-600">{heroPost.excerpt}</p>
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                <span className="flex items-center gap-1">
                  <ClockIcon />
                  {heroPost.readingTime}
                </span>
                <span>
                  {new Date(heroPost.publishedAt).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: 'long',
                  })}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-secondary-400/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-secondary-700">
                  Beliebter Artikel
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Featured posts */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary-700">Neu im Ratgeber</p>
            <p className="text-sm text-neutral-600 sm:text-base">
              Frisch veröffentlichte Artikel mit klaren Handlungsempfehlungen.
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
          {featuredPosts.map((post, index) => (
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
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary-600">
                    <span>{post.category}</span>
                    <span className="h-1 w-1 rounded-full bg-secondary-300" />
                    <span>{post.readingTime}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-tight text-neutral-900 transition-colors group-hover:text-secondary-700">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-neutral-600 line-clamp-3">{post.excerpt}</p>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-secondary-500">
                    Jetzt lesen →
                  </span>
                </Link>
              </InteractiveCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick reads */}
      <motion.div
        className="rounded-3xl border border-secondary-100/60 bg-secondary-50/70 p-5 sm:p-6"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary-800">Schnell weiterlesen</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-secondary-700 transition hover:border-secondary-300"
          >
            Zum Ratgeber
            <ArrowIcon />
          </Link>
        </div>
        <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 pt-1">
          {quickReadPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="min-w-[200px] rounded-2xl bg-white px-4 py-3 text-left text-sm shadow-sm ring-1 ring-secondary-100 transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary-600">{post.category}</p>
              <p className="mt-1 font-semibold text-neutral-900 line-clamp-2">{post.title}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                <ClockIcon />
                {post.readingTime}
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
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
