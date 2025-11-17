'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

import { blogPosts } from '@/lib/blogData'
import { Badge } from '@mental-health/ui'
import { SectionHeading } from '../marketing/SectionHeading'
import { Reveal } from '../marketing/Reveal'
import { InteractiveCard } from '../InteractiveCard'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

export function BlogFeatureSection() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const recentPosts = blogPosts.slice(0, 4)
  const [featuredPost, ...otherPosts] = recentPosts

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-primary-50/20 to-surface py-20 sm:py-24 lg:py-32">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_60%)]"
      />
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary-500/20 via-secondary-400/20 to-transparent blur-3xl"
          animate={{ opacity: [0.3, 0.6, 0.3], x: [-30, 30, -30] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <SectionHeading
            eyebrow="Wissen"
            title="Verifizierte Ratgeber von Expert:innen"
            description="Evidenzbasiertes Wissen von anerkannten Psychotherapeut:innen – bereit für SEO, leicht verständlich und immer aktuell."
          />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {featuredPost && (
            <Reveal as={InteractiveCard} className="lg:row-span-2 h-full border border-primary-100/40 bg-white/95">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="flex h-full flex-col overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
              >
                {featuredPost.featuredImage && (
                  <div className="relative h-80 w-full overflow-hidden">
                    <Image
                      src={featuredPost.featuredImage.src}
                      alt={featuredPost.featuredImage.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    {!prefersReducedMotion && (
                      <motion.div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-secondary-400/20 mix-blend-screen"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                    <Badge className="absolute left-4 top-4 bg-white/95 backdrop-blur-sm text-xs font-semibold">
                      {featuredPost.category}
                    </Badge>
                  </div>
                )}

                <div className="flex flex-1 flex-col gap-4 p-8">
                  <h3 className="text-2xl font-bold text-neutral-900 transition-colors group-hover:text-primary-600 sm:text-3xl">
                    {featuredPost.title}
                  </h3>
                  <p className="text-base text-muted sm:text-lg">{featuredPost.excerpt}</p>

                  <div className="mt-auto grid gap-4 text-sm text-neutral-500 sm:grid-cols-2">
                    <span className="flex items-center gap-2">
                      <CalendarIcon />
                      {featuredPost.publishedAt}
                    </span>
                    <span className="flex items-center gap-2">
                      <ClockIcon />
                      {featuredPost.readingTime}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-all group-hover:gap-3">
                    Artikel lesen
                    <ArrowIcon />
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          <div className="grid gap-6">
            {otherPosts.map((post, index) => (
              <Reveal
                key={post.slug}
                as={InteractiveCard}
                className="border border-primary-100/40 bg-white/95 p-0"
                delay={150 + index * 60}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-stretch gap-4 p-4 sm:p-5"
                >
                  {post.featuredImage && (
                    <div className="relative hidden h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl sm:block">
                      <Image
                        src={post.featuredImage.src}
                        alt={post.featuredImage.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col gap-2">
                    <Badge variant="neutral" className="w-fit text-xs">
                      {post.category}
                    </Badge>
                    <h4 className="text-lg font-semibold text-neutral-900 transition-colors group-hover:text-primary-600">
                      {post.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                      <span>{post.publishedAt}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary/40 bg-white/80 px-6 py-3 text-sm font-semibold text-primary-700 shadow-sm transition-all hover:border-primary/60 hover:bg-primary/5"
          >
            Alle Ratgeber-Artikel ansehen
            <ArrowIcon />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function CalendarIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
