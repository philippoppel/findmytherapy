import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
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
      title: 'Klarthera Blog',
    }
  }

  const canonicalUrl = `https://klarthera.at/blog/${post.slug}`

  return {
    title: `${post.title} | Klarthera Blog`,
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
      '@id': `https://klarthera.at/blog/${post.slug}`,
    },
  }

  return (
    <article className="bg-gradient-to-b from-surface-1 via-surface-2/30 to-surface-1 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-800 focus-visible:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Zur Übersicht
        </Link>

        <header className="mt-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-subtle">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary-700">
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
          <h1 className="text-4xl font-semibold leading-tight text-neutral-900">
            {post.title}
          </h1>
          <p className="text-lg leading-relaxed text-muted">{post.excerpt}</p>
        </header>

        <div className="mt-12 space-y-12 text-base leading-relaxed text-muted">
          {post.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.list && (
                <ul className="list-disc pl-6 text-muted">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <footer className="mt-16 rounded-3xl border border-divider bg-white/90 p-8 shadow-lg shadow-primary/10">
          <h3 className="text-2xl font-semibold text-neutral-900">Lust auf mehr Einblicke?</h3>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Unser Netzwerk befindet sich im Aufbau – in der Demo zeigen wir dir bereits heute, wie Klarthera Menschen mit passender Unterstützung verbindet. Lass uns wissen, welche Fragen offen sind.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="btn btn-primary inline-flex items-center justify-center gap-2"
            >
              Gespräch vereinbaren
            </Link>
            <Link
              href="/triage"
              className="btn btn-outline inline-flex items-center justify-center gap-2"
            >
              Demo testen
            </Link>
          </div>
        </footer>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }} />
    </article>
  )
}
