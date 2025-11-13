import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import { blogPosts } from '../../lib/blogData'

export const metadata: Metadata = {
  title: 'Blog & Insights | FindMyTherapy',
  description:
    'Aktuelle Einblicke zu mentaler Gesundheit, Produkt-Updates und dem Aufbau unseres Therapeut:innen-Netzwerks bei FindMyTherapy.',
  alternates: {
    canonical: 'https://findmytherapy.net/blog',
  },
  openGraph: {
    title: 'FindMyTherapy Blog & Insights',
    description: 'Ratgeber, Produkt-Updates und Interviews zu mentaler Gesundheit und digitalen Lösungen.',
    type: 'website',
  },
}

const dateFormatter = new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium' })

export default function BlogPage() {
  const [featuredPost, ...otherPosts] = blogPosts

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-950/5 via-primary-950/5 to-primary-950/5 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Back to Home Navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Zurück zur Hauptseite
          </Link>
        </div>

        <header className="text-center space-y-4 sm:space-y-6" aria-labelledby="blog-title">
          <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-800 ring-1 ring-inset ring-primary-600/20">
            FindMyTherapy Blog
          </span>
          <h1 id="blog-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Wissen, Updates und Einblicke rund um mentale Gesundheit
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
            Wir teilen Learnings aus Produktentwicklung, Gesprächen mit Therapeut:innen und Unternehmen sowie praktische Tipps für mentale Gesundheit.
          </p>
        </header>

        <section aria-labelledby="featured-title">
          <h2 id="featured-title" className="sr-only">
            Highlight-Beitrag
          </h2>
          <article className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50 via-primary-100/50 to-white border border-primary-200/60 shadow-xl shadow-primary-900/10 transition hover:shadow-2xl hover:shadow-primary-900/15">
            <div className="grid grid-cols-1 gap-8 p-8 sm:p-10 md:grid-cols-5">
              <div className="md:col-span-3 space-y-5">
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-primary-800 ring-1 ring-inset ring-primary-600/20">
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
                <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  <Link href={`/blog/${featuredPost.slug}`} className="transition-colors hover:text-primary-700">
                    {featuredPost.title}
                  </Link>
                </h3>
                <p className="text-base leading-relaxed text-gray-700">{featuredPost.excerpt}</p>
                <div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    Beitrag lesen
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
              <div className="md:col-span-2 space-y-4 rounded-2xl border border-primary-200/60 bg-white/80 p-6 backdrop-blur">
                <h4 className="text-lg font-semibold text-gray-900">Das erwartet dich</h4>
                <ul className="space-y-3 text-sm leading-relaxed text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span>Schritt-für-Schritt Einblick in FindMyTherapy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span>Transparenz über Qualitätskriterien im Netzwerk</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600">•</span>
                    <span>Nächste Schritte für Pilotkund:innen</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-600">
                  Du möchtest über neue Beiträge informiert werden? Trage dich ins Formular ein – wir halten dich auf dem Laufenden.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section aria-labelledby="all-posts-title" className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="all-posts-title" className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Weitere Artikel
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Themenwunsch teilen
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-md shadow-gray-900/5 transition hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-900/10"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-primary-800">{post.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" aria-hidden />
                      {dateFormatter.format(new Date(post.publishedAt))}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {post.readingTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    <Link href={`/blog/${post.slug}`} className="transition-colors group-hover:text-primary-700">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    Weiterlesen
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
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
