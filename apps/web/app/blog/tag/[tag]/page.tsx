import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { blogPosts } from '@/lib/blogData'
import { Badge } from '@repo/ui/components/badge'

type TagPageProps = {
  params: {
    tag: string
  }
}

// Get unique tags
function getUniqueTags() {
  const tags = new Set<string>()
  blogPosts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags)
}

export function generateStaticParams() {
  const tags = getUniqueTags()
  return tags.map((tag) => ({
    tag: tag.toLowerCase().replace(/\s+/g, '-'),
  }))
}

export function generateMetadata({ params }: TagPageProps): Metadata {
  const tagSlug = params.tag
  const tagName = tagSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const tagPosts = blogPosts.filter(
    (post) =>
      post.tags?.some((tag) => tag.toLowerCase().replace(/\s+/g, '-') === tagSlug)
  )

  if (tagPosts.length === 0) {
    return {
      title: 'Tag nicht gefunden | FindMyTherapy Blog',
    }
  }

  return {
    title: `${tagName} – Ratgeber | FindMyTherapy Blog`,
    description: `Alle Artikel zum Thema ${tagName}. Verifiziertes Wissen von Expert:innen zu mentaler Gesundheit.`,
    openGraph: {
      title: `${tagName} – Ratgeber`,
      description: `Alle Artikel zum Thema ${tagName}`,
      type: 'website',
    },
  }
}

export default function TagPage({ params }: TagPageProps) {
  const tagSlug = params.tag
  const tagName = tagSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const tagPosts = blogPosts.filter(
    (post) =>
      post.tags?.some((tag) => tag.toLowerCase().replace(/\s+/g, '-') === tagSlug)
  )

  if (tagPosts.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-8">
          <Link
            href="/"
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/blog"
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Blog
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">Tags</span>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{tagName}</span>
        </nav>

        {/* Tag Header */}
        <div className="mb-12">
          <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">
            #{tagName}
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Artikel zu "{tagName}"
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {tagPosts.length}{' '}
            {tagPosts.length === 1 ? 'Artikel' : 'Artikel'} mit diesem Tag
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tagPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow hover:shadow-lg transition-all border border-gray-200 dark:border-gray-800"
            >
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={post.featuredImage.src}
                    alt={post.featuredImage.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-6 flex flex-col flex-grow">
                <Badge variant="secondary" className="self-start mb-3">
                  {post.category}
                </Badge>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                  <span>{post.publishedAt}</span>
                  <span>•</span>
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All Tags */}
        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Alle Tags
          </h2>
          <div className="flex flex-wrap gap-3">
            {getUniqueTags().map((tag) => {
              const tagSlugCompare = tag.toLowerCase().replace(/\s+/g, '-')
              const count = blogPosts.filter((p) =>
                p.tags?.some((t) => t === tag)
              ).length
              return (
                <Link
                  key={tag}
                  href={`/blog/tag/${tagSlugCompare}`}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    tagSlugCompare === tagSlug
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400 font-medium'
                      : 'border-gray-200 dark:border-gray-800 hover:border-primary-600 dark:hover:border-primary-400'
                  }`}
                >
                  #{tag} ({count})
                </Link>
              )
            })}
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Alle Artikel ansehen
          </Link>
        </div>
      </div>
    </div>
  )
}
