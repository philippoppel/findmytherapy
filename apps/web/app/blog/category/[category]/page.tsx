import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { blogPosts } from '@/lib/blogData'
import { Badge } from '@mental-health/ui'

type CategoryPageProps = {
  params: {
    category: string
  }
}

// Get unique categories
function getUniqueCategories() {
  const categories = new Set(blogPosts.map((post) => post.category))
  return Array.from(categories)
}

export function generateStaticParams() {
  const categories = getUniqueCategories()
  return categories.map((category) => ({
    category: category.toLowerCase().replace(/\s+/g, '-'),
  }))
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const categorySlug = params.category
  const categoryName = categorySlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const categoryPosts = blogPosts.filter(
    (post) =>
      post.category.toLowerCase().replace(/\s+/g, '-') === categorySlug
  )

  if (categoryPosts.length === 0) {
    return {
      title: 'Kategorie nicht gefunden | FindMyTherapy Blog',
    }
  }

  return {
    title: `${categoryName} – Ratgeber | FindMyTherapy Blog`,
    description: `Alle Artikel zum Thema ${categoryName}. Verifiziertes Wissen von Expert:innen zu mentaler Gesundheit.`,
    openGraph: {
      title: `${categoryName} – Ratgeber`,
      description: `Alle Artikel zum Thema ${categoryName}`,
      type: 'website',
    },
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categorySlug = params.category
  const categoryName = categorySlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const categoryPosts = blogPosts.filter(
    (post) =>
      post.category.toLowerCase().replace(/\s+/g, '-') === categorySlug
  )

  if (categoryPosts.length === 0) {
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
          <span className="text-gray-900 dark:text-white">{categoryName}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-12">
          <Badge variant="neutral" className="mb-4 text-lg px-4 py-2">
            {categoryName}
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {categoryName} Ratgeber
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {categoryPosts.length}{' '}
            {categoryPosts.length === 1 ? 'Artikel' : 'Artikel'} zum Thema{' '}
            {categoryName}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categoryPosts.map((post) => (
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

        {/* All Categories */}
        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Alle Kategorien
          </h2>
          <div className="flex flex-wrap gap-3">
            {getUniqueCategories().map((cat) => {
              const catSlug = cat.toLowerCase().replace(/\s+/g, '-')
              const count = blogPosts.filter((p) => p.category === cat).length
              return (
                <Link
                  key={cat}
                  href={`/blog/category/${catSlug}`}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    catSlug === categorySlug
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400 font-medium'
                      : 'border-gray-200 dark:border-gray-800 hover:border-primary-600 dark:hover:border-primary-400'
                  }`}
                >
                  {cat} ({count})
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
