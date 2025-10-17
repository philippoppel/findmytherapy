import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react'
import { blogPosts } from '../../lib/blogData'

export const metadata: Metadata = {
  title: 'Blog & Insights | Klarthera',
  description:
    'Aktuelle Einblicke zu mentaler Gesundheit, Produkt-Updates und dem Aufbau unseres Therapeut:innen-Netzwerks bei Klarthera.',
  alternates: {
    canonical: 'https://klarthera.at/blog',
  },
  openGraph: {
    title: 'Klarthera Blog & Insights',
    description: 'Ratgeber, Produkt-Updates und Interviews zu mentaler Gesundheit und digitalen Lösungen.',
    type: 'website',
  },
}

const dateFormatter = new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium' })

export default function BlogPage() {
  const [featuredPost, ...otherPosts] = blogPosts

  return (
    <div className="bg-gradient-to-b from-surface-1 via-surface-2/30 to-surface-1 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
        <header className="text-center space-y-4" aria-labelledby="blog-title">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary-700">
            Klarthera Blog
          </span>
          <h1 id="blog-title" className="text-4xl font-semibold text-neutral-900">
            Wissen, Updates und Einblicke rund um mentale Gesundheit
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
            Wir teilen Learnings aus Produktentwicklung, Gesprächen mit Therapeut:innen und Unternehmen sowie praktische Tipps für mentale Gesundheit.
          </p>
        </header>

        <section aria-labelledby="featured-title">
          <h2 id="featured-title" className="sr-only">
            Highlight-Beitrag
          </h2>
          <article className="grid grid-cols-1 gap-8 rounded-3xl border border-divider bg-white/90 p-10 shadow-lg shadow-primary/10 backdrop-blur md:grid-cols-5">
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center gap-3 text-sm text-subtle">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary-700">
                  <Tag className="h-4 w-4" aria-hidden />
                  {featuredPost.category}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden />
                  {dateFormatter.format(new Date(featuredPost.publishedAt))}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" aria-hidden />
                  {featuredPost.readingTime}
                </span>
              </div>
              <h3 className="text-3xl font-semibold text-neutral-900">
                <Link href={`/blog/${featuredPost.slug}`} className="transition-colors hover:text-primary">
                  {featuredPost.title}
                </Link>
              </h3>
              <p className="text-base leading-relaxed text-muted">{featuredPost.excerpt}</p>
              <div>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-800 focus-visible:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  Beitrag lesen
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4 rounded-2xl bg-gradient-to-br from-primary-50 via-surface-1 to-surface-2 p-6">
              <h4 className="text-lg font-semibold text-neutral-900">Das erwartet dich</h4>
              <ul className="space-y-3 text-sm leading-relaxed text-muted">
                <li>• Schritt-für-Schritt Einblick in unsere Demo</li>
                <li>• Transparenz über Qualitätskriterien im Netzwerk</li>
                <li>• Nächste Schritte für Pilotkund:innen</li>
              </ul>
              <p className="text-sm text-subtle">
                Du möchtest über neue Beiträge informiert werden? Trage dich ins Demo-Formular ein – wir halten dich auf dem Laufenden.
              </p>
            </div>
          </article>
        </section>

        <section aria-labelledby="all-posts-title" className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 id="all-posts-title" className="text-2xl font-semibold text-neutral-900">
              Weitere Artikel
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-800 focus-visible:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Themenwunsch teilen
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {otherPosts.map((post) => (
              <article
                key={post.slug}
                className="flex h-full flex-col justify-between rounded-2xl border border-divider bg-white/90 p-6 shadow-sm shadow-primary/5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-primary/20"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-subtle">
                    <span>{post.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" aria-hidden />
                      {dateFormatter.format(new Date(post.publishedAt))}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {post.readingTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900">
                    <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-primary">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{post.excerpt}</p>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-800 focus-visible:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  >
                    Weiterlesen
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
