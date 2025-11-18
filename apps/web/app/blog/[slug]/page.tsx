import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Calendar,
  Clock,
  Tag as TagIcon,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { blogPosts, getBlogPostBySlug } from '../../../lib/blogData'
import { getAuthorById } from '../../../lib/authors'
import { AuthorBio } from '@/app/components/blog/AuthorBio'
import { RelatedArticles } from '@/app/components/blog/RelatedArticles'
import { SocialShare } from '@/app/components/blog/SocialShare'
import { TableOfContents } from '@/app/components/blog/TableOfContents'
import { MedicalDisclaimer } from '@/app/components/blog/MedicalDisclaimer'
import { NewsletterForm } from '@/app/components/forms/NewsletterForm'

type BlogPostPageProps = {
  params: {
    slug: string
  }
}

const dateFormatter = new Intl.DateTimeFormat('de-AT', { dateStyle: 'long' })
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()

const buildImageUrl = (src?: string) => {
  if (!src) return undefined
  return src.startsWith('http') ? src : `https://findmytherapy.net${src}`
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    return { title: 'FindMyTherapy Blog' }
  }

  const canonicalUrl = `https://findmytherapy.net/blog/${post.slug}`
  const imageUrl = buildImageUrl(post.featuredImage?.src) ?? 'https://findmytherapy.net/og-image.jpg'
  const author = getAuthorById(post.authorId)

  return {
    title: `${post.title} | FindMyTherapy Blog`,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: author ? [`https://findmytherapy.net/blog/authors/${author.slug}`] : undefined,
      section: post.category,
      tags: [...post.keywords, ...(post.tags || [])],
      images: [
        {
          url: imageUrl,
          width: post.featuredImage?.width || 1200,
          height: post.featuredImage?.height || 630,
          alt: post.featuredImage?.alt || post.title,
        },
      ],
      locale: 'de_AT',
      siteName: 'FindMyTherapy',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
      creator: '@findmytherapy',
    },
  }
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

  // Build medical reviewer data if available
  const medicalReviewer = post.medicalReviewedBy ? getAuthorById(post.medicalReviewedBy) : null

  // Organization Schema
  const organizationStructuredData = {
    '@type': 'Organization',
    '@id': 'https://findmytherapy.net/#organization',
    name: 'FindMyTherapy',
    url: 'https://findmytherapy.net',
    logo: {
      '@type': 'ImageObject',
      url: 'https://findmytherapy.net/logo.png',
    },
    sameAs: [
      'https://www.linkedin.com/company/findmytherapy',
      'https://twitter.com/findmytherapy',
    ],
  }

  // Determine if this is health-related content
  const healthKeywords = ['Depression', 'Angst', 'Angststörung', 'Panik', 'Burnout', 'Therapie', 'Psychotherapie']
  const isHealthTopic = post.medicalReviewedBy && post.keywords.some(keyword =>
    healthKeywords.some(healthKw => keyword.toLowerCase().includes(healthKw.toLowerCase()))
  )

  // Extract primary health topic from keywords
  const primaryHealthTopic = post.keywords.find(keyword =>
    healthKeywords.some(healthKw => keyword.toLowerCase().includes(healthKw.toLowerCase()))
  ) || 'Mentale Gesundheit'

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': isHealthTopic ? 'HealthTopicContent' : (post.medicalReviewedBy ? 'MedicalWebPage' : 'BlogPosting'),
    headline: post.title,
    description: post.excerpt,
    image: buildImageUrl(post.featuredImage?.src),
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
    publisher: organizationStructuredData,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    keywords: [...post.keywords, ...(post.tags || [])],
    articleSection: post.category,
    wordCount: post.sections.reduce(
      (acc, section) =>
        acc +
        section.paragraphs.reduce((pAcc, paragraph) => pAcc + paragraph.split(' ').length, 0),
      0,
    ),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    ...(medicalReviewer && {
      reviewedBy: {
        '@type': 'Person',
        name: medicalReviewer.name,
        jobTitle: medicalReviewer.title,
        description: medicalReviewer.credentials,
      },
    }),
    ...(post.lastReviewed && {
      lastReviewed: post.lastReviewed,
    }),
    ...(isHealthTopic && {
      hasHealthAspect: {
        '@type': 'MedicalEntity',
        name: primaryHealthTopic,
      },
      specialty: {
        '@type': 'MedicalSpecialty',
        name: 'Psychotherapie',
      },
    }),
    ...(post.medicalReviewedBy && !isHealthTopic && {
      specialty: 'Psychotherapie',
      about: {
        '@type': 'MedicalCondition',
        name: 'Angststörungen',
      },
    }),
  }

  // BreadcrumbList Schema
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://findmytherapy.net',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://findmytherapy.net/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  }

  // FAQ Schema if FAQs are present
  const faqStructuredData = post.faq
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null

  // HowTo Schema if HowTo steps are present
  const howToStructuredData = post.howTo
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `Akuthilfe: ${post.title}`,
        description: 'Schritt-für-Schritt Anleitung zur Bewältigung von Panikattacken',
        step: post.howTo.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
        })),
      }
    : null

  return (
    <div className="marketing-theme bg-surface text-default">
      <article className="min-h-screen bg-surface pb-16 pt-10 sm:pb-24 sm:pt-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-neutral-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="inline-flex items-center gap-1.5 font-semibold text-primary-900">
                <Home className="h-4 w-4" aria-hidden />
                Home
              </Link>
            </li>
            <li className="text-neutral-400">/</li>
            <li>
              <Link href="/blog" className="font-semibold text-primary-900">
                Blog
              </Link>
            </li>
            <li className="text-neutral-400">/</li>
            <li className="font-medium text-neutral-700">{post.title}</li>
          </ol>
        </nav>

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Zur Übersicht
        </Link>

        <header className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-primary-950 via-secondary-800 to-secondary-900 px-6 py-10 text-white shadow-2xl shadow-primary-950/50 sm:px-12 sm:py-14">
          {post.featuredImage && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url(${post.featuredImage.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              aria-hidden
            />
          )}
          <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-64 w-[90%] rounded-full bg-primary-400/20 blur-3xl" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-widest text-white/80">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  Insights
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-1.5">
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                  Evidenzbasiert
                </span>
                {medicalReviewer && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-green-400/40 bg-green-500/20 px-4 py-1.5">
                    <ShieldCheck className="h-4 w-4" aria-hidden />
                    Medizinisch geprüft
                  </span>
                )}
                {updatedDate && publishedDate.getTime() !== updatedDate.getTime() && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/20 px-4 py-1.5">
                    <Clock className="h-4 w-4" aria-hidden />
                    Aktualisiert {dateFormatter.format(updatedDate)}
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/80">
                  {post.category}
                </p>
                <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                  {post.title}
                </h1>
                <p className="text-lg text-white/90">{post.excerpt}</p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/75">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden />
                  {dateFormatter.format(publishedDate)}
                </span>
                {updatedDate && publishedDate.getTime() !== updatedDate.getTime() && (
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4" aria-hidden />
                    Aktualisiert: {dateFormatter.format(updatedDate)}
                  </span>
                )}
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" aria-hidden />
                  {post.readingTime}
                </span>
              </div>
            </div>
            {post.featuredImage && (
              <div className="relative h-72 w-full overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
                <Image
                  src={post.featuredImage.src}
                  alt={post.featuredImage.alt}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr),minmax(0,0.85fr)]">
          <div className="space-y-10">
            <section className="rounded-3xl border border-primary-100/70 bg-white p-6 shadow-lg shadow-primary-900/5 sm:p-8">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg">
                  <Lightbulb className="h-5 w-5" aria-hidden />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">Auf einen Blick</p>
                    <h2 className="text-2xl font-semibold text-neutral-900">Key-Takeaways</h2>
                  </div>
                  <ul className="space-y-3">
                    {post.summary.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary-600" aria-hidden />
                        <span className="text-base leading-relaxed text-neutral-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-lg shadow-primary-900/5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">Inhalt</p>
              <TableOfContents sections={post.sections} />
            </section>

            <div className="prose prose-lg prose-neutral mt-4 max-w-none">
              <div className="space-y-12">
                {post.sections.map((section) => {
                  const sectionId = slugify(section.heading)
                  return (
                    <section key={section.heading} id={sectionId} className="space-y-4 scroll-mt-24">
                      <h2 className="group relative text-3xl font-bold text-neutral-900">
                        {section.heading}
                        <a
                          href={`#${sectionId}`}
                          className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-lg opacity-0 transition hover:bg-primary-50 group-hover:opacity-100"
                          aria-label={`Link zu Abschnitt: ${section.heading}`}
                        >
                          <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </a>
                      </h2>
                      <div className="space-y-4 text-lg leading-relaxed text-neutral-700">
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                      {section.list && (
                        <ul className="space-y-2 text-lg text-neutral-700">
                          {section.list.map((item) => (
                            <li key={item} className="flex items-start gap-3">
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

            {post.medicalReviewedBy && <MedicalDisclaimer />}
            {author && <AuthorBio author={author} />}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-lg shadow-primary-900/5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">Weiterlesen</p>
              <h3 className="mt-2 text-xl font-semibold text-neutral-900">Ähnliche Artikel</h3>
              <div className="mt-4">
                <RelatedArticles currentPost={post} allPosts={blogPosts} variant="sidebar" />
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-lg shadow-primary-900/5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">Artikel-Insights</p>
              <h3 className="mt-2 text-xl font-semibold text-neutral-900">Metadaten & Tags</h3>
              <dl className="mt-4 space-y-3 text-sm text-muted">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <dt>Veröffentlicht</dt>
                  <dd className="font-semibold">{dateFormatter.format(publishedDate)}</dd>
                </div>
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <dt>Lesedauer</dt>
                  <dd className="font-semibold">{post.readingTime}</dd>
                </div>
                {updatedDate && publishedDate.getTime() !== updatedDate.getTime() && (
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <dt>Zuletzt aktualisiert</dt>
                    <dd className="font-semibold">{dateFormatter.format(updatedDate)}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">Tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(post.tags || []).map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${slugify(tag)}`}
                      className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-900"
                    >
                      <TagIcon className="h-3.5 w-3.5" aria-hidden />
                      {tag}
                    </Link>
                  ))}
                  {(!post.tags || post.tags.length === 0) && (
                    <span className="text-sm text-neutral-400">Noch keine Tags.</span>
                  )}
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4">
                <p className="text-sm font-semibold text-neutral-900">Teilen</p>
                <SocialShare url={postUrl} title={post.title} description={post.excerpt} className="mt-3" />
              </div>
            </div>

            <section className="rounded-3xl border border-white/20 bg-gradient-to-br from-primary-900 via-primary-700 to-indigo-700 p-5 shadow-2xl shadow-primary-900/30">
              <NewsletterForm
                variant="topic"
                className="border-white/20 bg-white/5"
                title="Themenwunsch oder Feedback?"
                description="Schreib uns kurz, welche zusätzlichen Infos, Formatideen oder Interviews du dir wünschst. Wir melden uns persönlich."
              />
              <div className="mt-4 flex gap-2 text-xs text-white/80">
                <span className="rounded-full border border-white/30 px-3 py-1">Antwort &lt; 24h</span>
                <span className="rounded-full border border-white/30 px-3 py-1">DSGVO-konform</span>
              </div>
            </section>

            <div className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-lg shadow-primary-900/5">
              <h3 className="text-lg font-semibold text-neutral-900">Mehr aus {post.category}</h3>
              <p className="mt-2 text-sm text-muted">
                Entdecke weitere Artikel aus dem Bereich {post.category} oder folge den Tags, um Updates zu erhalten.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href={`/blog/category/${slugify(post.category)}`}
                  className="inline-flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-primary-900 transition hover:-translate-y-0.5 hover:border-primary-200"
                >
                  Alle Artikel dieser Kategorie
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-primary-900 transition hover:-translate-y-0.5 hover:border-primary-200"
                >
                  Persönliches Gespräch
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} />
      {faqStructuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      )}
      {howToStructuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }} />
      )}
    </article>
  </div>
  )
}
