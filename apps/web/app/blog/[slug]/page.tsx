import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Home, Calendar, Clock, Tag, Lightbulb, CheckCircle2 } from 'lucide-react'
import { blogPosts, getBlogPostBySlug } from '../../../lib/blogData'
import { getAuthorById } from '../../../lib/authors'
import { AuthorBio } from '@/app/components/blog/AuthorBio'
import { RelatedArticles } from '@/app/components/blog/RelatedArticles'
import { SocialShare } from '@/app/components/blog/SocialShare'
import { TableOfContents } from '@/app/components/blog/TableOfContents'

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
  const imageUrl = post.featuredImage
    ? `https://findmytherapy.net${post.featuredImage.src}`
    : 'https://findmytherapy.net/og-image.jpg'

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
      modifiedTime: post.updatedAt,
      tags: post.keywords,
      images: [
        {
          url: imageUrl,
          width: post.featuredImage?.width || 1200,
          height: post.featuredImage?.height || 630,
          alt: post.featuredImage?.alt || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const author = getAuthorById(post.authorId)
  const publishedDate = new Date(post.publishedAt)
  const updatedDate = post.updatedAt ? new Date(post.updatedAt) : null
  const postUrl = `https://findmytherapy.net/blog/${post.slug}`

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage
      ? `https://findmytherapy.net${post.featuredImage.src}`
      : undefined,
    author: author
      ? {
          '@type': 'Person',
          name: author.name,
          jobTitle: author.title,
          description: author.bio,
          url: `https://findmytherapy.net/blog/authors/${author.slug}`,
        }
      : {
          '@type': 'Organization',
          name: post.author,
        },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    keywords: [...post.keywords, ...post.tags],
    articleSection: post.category,
    wordCount: post.sections.reduce(
      (acc, section) =>
        acc +
        section.paragraphs.reduce(
          (pAcc, p) => pAcc + p.split(' ').length,
          0
        ),
      0
    ),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  }

  return (
    <article className="min-h-screen bg-gradient-to-b from-primary-950/5 via-primary-950/5 to-primary-950/5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 transition hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <Home className="h-4 w-4" aria-hidden />
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href="/blog"
            className="transition hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            Blog
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">{post.title}</span>
        </nav>

        <Link
          href="/blog"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Alle Artikel
        </Link>

        <header className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-primary-800 ring-1 ring-inset ring-primary-600/20">
              <Tag className="h-4 w-4" aria-hidden />
              {post.category}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden />
              {dateFormatter.format(publishedDate)}
            </span>
            {updatedDate && publishedDate.getTime() !== updatedDate.getTime() && (
              <span className="flex items-center gap-2 text-gray-500">
                <Clock className="h-4 w-4" aria-hidden />
                Aktualisiert: {dateFormatter.format(updatedDate)}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden />
              {post.readingTime}
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            {post.title}
          </h1>
          <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">{post.excerpt}</p>

          {/* Social Share Buttons */}
          <SocialShare url={postUrl} title={post.title} description={post.excerpt} />
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mt-10 relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={post.featuredImage.src}
              alt={post.featuredImage.alt}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Key Takeaways / Zusammenfassung */}
        <section className="mt-10 rounded-3xl border-2 border-primary-200/80 bg-gradient-to-br from-primary-50 via-white to-primary-100/30 p-6 shadow-lg shadow-primary-900/5 sm:p-8 dark:from-primary-950/30 dark:via-gray-900 dark:to-primary-950/20 dark:border-primary-900">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-600 shadow-md">
              <Lightbulb className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div className="flex-1 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Auf einen Blick</h2>
              <ul className="space-y-3">
                {post.summary.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary-600 mt-0.5" aria-hidden />
                    <span className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <div className="mt-8">
          <TableOfContents sections={post.sections} />
        </div>

        <div className="prose prose-lg prose-gray dark:prose-invert mt-12 max-w-none">
          <div className="space-y-12">
            {post.sections.map((section) => {
              const sectionId = slugify(section.heading)
              return (
                <section key={section.heading} id={sectionId} className="space-y-4 scroll-mt-20">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {section.heading}
                  </h2>
                  <div className="space-y-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    {section.paragraphs.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                  {section.list && (
                    <ul className="space-y-2 text-lg text-gray-700 dark:text-gray-300">
                      {section.list.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )
            })}
          </div>
        </div>

        {/* Author Bio */}
        {author && <AuthorBio author={author} />}

        {/* Related Articles */}
        <RelatedArticles currentPost={post} allPosts={blogPosts} />

        <footer className="mt-16 rounded-3xl border border-primary-200/60 bg-gradient-to-br from-primary-50 via-primary-100/50 to-white p-8 shadow-xl shadow-primary-900/10 sm:p-10 dark:from-primary-950/30 dark:via-gray-900 dark:to-primary-950/20 dark:border-primary-900">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Lust auf mehr Einblicke?</h3>
          <p className="mt-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Unser Netzwerk befindet sich im Aufbau – wir zeigen dir bereits heute, wie FindMyTherapy Menschen mit passender Unterstützung verbindet. Lass uns wissen, welche Fragen offen sind.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary-900/20 transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Gespräch vereinbaren
            </Link>
            <Link
              href="/triage"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-600 bg-white dark:bg-gray-900 px-6 py-3 text-base font-semibold text-primary-700 dark:text-primary-400 transition hover:bg-primary-50 dark:hover:bg-primary-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
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
