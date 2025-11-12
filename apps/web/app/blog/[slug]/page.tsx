import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Home, Calendar, Clock, Tag, Lightbulb, CheckCircle2 } from 'lucide-react'
import { blogPosts, getBlogPostBySlug } from '../../../lib/blogData'

type BlogPostPageProps = {
  params: {
    slug: string
  }
}

const dateFormatter = new Intl.DateTimeFormat('de-AT', { dateStyle: 'long' })

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'FindMyTherapy Blog',
    }
  }

  const canonicalUrl = `https://findmytherapy.net/blog/${post.slug}`

  return {
    title: `${post.title} | FindMyTherapy Blog`,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      tags: post.keywords,
    },
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const publishedDate = new Date(post.publishedAt)
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    datePublished: post.publishedAt,
    keywords: post.keywords,
    articleSection: post.category,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://findmytherapy.net/blog/${post.slug}`,
    },
  }

  return (
    <article className="min-h-screen bg-gradient-to-b from-teal-950/5 via-cyan-950/5 to-teal-950/5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 transition hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            <Home className="h-4 w-4" aria-hidden />
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href="/blog"
            className="transition hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            Blog
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">{post.title}</span>
        </nav>

        <Link
          href="/blog"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Alle Artikel
        </Link>

        <header className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-teal-800 ring-1 ring-inset ring-teal-600/20">
              <Tag className="h-4 w-4" aria-hidden />
              {post.category}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden />
              {dateFormatter.format(publishedDate)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden />
              {post.readingTime}
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
            {post.title}
          </h1>
          <p className="text-xl leading-relaxed text-gray-700">{post.excerpt}</p>
        </header>

        {/* Key Takeaways / Zusammenfassung */}
        <section className="mt-10 rounded-3xl border-2 border-teal-200/80 bg-gradient-to-br from-teal-50 via-white to-cyan-50/30 p-6 shadow-lg shadow-teal-900/5 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-600 shadow-md">
              <Lightbulb className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div className="flex-1 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Auf einen Blick</h2>
              <ul className="space-y-3">
                {post.summary.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-teal-600 mt-0.5" aria-hidden />
                    <span className="text-base leading-relaxed text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="prose prose-lg prose-gray mt-12 max-w-none">
          <div className="space-y-12">
            {post.sections.map((section) => (
              <section key={section.heading} className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {section.heading}
                </h2>
                <div className="space-y-4 text-lg leading-relaxed text-gray-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.list && (
                  <ul className="space-y-2 text-lg text-gray-700">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>

        <footer className="mt-16 rounded-3xl border border-teal-200/60 bg-gradient-to-br from-teal-50 via-cyan-50/50 to-white p-8 shadow-xl shadow-teal-900/10 sm:p-10">
          <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">Lust auf mehr Einblicke?</h3>
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            Unser Netzwerk befindet sich im Aufbau – wir zeigen dir bereits heute, wie FindMyTherapy Menschen mit passender Unterstützung verbindet. Lass uns wissen, welche Fragen offen sind.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              Gespräch vereinbaren
            </Link>
            <Link
              href="/triage"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-teal-600 bg-white px-6 py-3 text-base font-semibold text-teal-700 transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              Ersteinschätzung testen
            </Link>
          </div>
        </footer>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }} />
    </article>
  )
}
