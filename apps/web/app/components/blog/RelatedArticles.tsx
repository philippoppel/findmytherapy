import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '@/lib/blogData'
import { Badge } from '@mental-health/ui'

interface RelatedArticlesProps {
  currentPost: BlogPost
  allPosts: BlogPost[]
  variant?: 'default' | 'sidebar'
}

export function RelatedArticles({
  currentPost,
  allPosts,
  variant = 'default',
}: RelatedArticlesProps) {
  // Get related posts
  let relatedPosts: BlogPost[] = []

  // 1. First, try to use manually specified related posts
  if (currentPost.relatedPosts && currentPost.relatedPosts.length > 0) {
    relatedPosts = allPosts.filter((post) =>
      currentPost.relatedPosts?.includes(post.slug)
    )
  }

  // 2. If not enough, add posts from the same category
  if (relatedPosts.length < 3) {
    const sameCategoryPosts = allPosts.filter(
      (post) =>
        post.slug !== currentPost.slug &&
        post.category === currentPost.category &&
        !relatedPosts.find((rp) => rp.slug === post.slug)
    )
    relatedPosts = [...relatedPosts, ...sameCategoryPosts]
  }

  // 3. If still not enough, add posts with matching tags
  if (relatedPosts.length < 3 && currentPost.tags) {
    const sameTagPosts = allPosts.filter(
      (post) =>
        post.slug !== currentPost.slug &&
        !relatedPosts.find((rp) => rp.slug === post.slug) &&
        post.tags &&
        post.tags.some((tag) => currentPost.tags.includes(tag))
    )
    relatedPosts = [...relatedPosts, ...sameTagPosts]
  }

  // 4. If still not enough, add most recent posts
  if (relatedPosts.length < 3) {
    const recentPosts = allPosts.filter(
      (post) =>
        post.slug !== currentPost.slug &&
        !relatedPosts.find((rp) => rp.slug === post.slug)
    )
    relatedPosts = [...relatedPosts, ...recentPosts]
  }

  // Limit to 3 posts
  relatedPosts = relatedPosts.slice(0, 3)

  if (relatedPosts.length === 0) {
    return null
  }

  // Sidebar variant - compact vertical list like YouTube suggestions
  if (variant === 'sidebar') {
    return (
      <div className="space-y-4">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex gap-3"
          >
            {/* Thumbnail */}
            {post.featuredImage && (
              <div className="relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={post.featuredImage.src}
                  alt={post.featuredImage.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              {/* Title */}
              <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                {post.title}
              </h4>

              {/* Metadata */}
              <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                <span>{post.readingTime}</span>
              </div>
            </div>
          </Link>
        ))}

        {/* View All Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors mt-2"
        >
          Alle Artikel ansehen
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    )
  }

  // Default variant - grid layout at bottom
  return (
    <section className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Weiterlesen
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col"
          >
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={post.featuredImage.src}
                  alt={post.featuredImage.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}

            {/* Category Badge */}
            <Badge
              variant="neutral"
              className="self-start mb-3 text-xs font-medium"
            >
              {post.category}
            </Badge>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
              {post.excerpt}
            </p>

            {/* Metadata */}
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
              <span>{post.publishedAt}</span>
              <span>•</span>
              <span>{post.readingTime}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Articles CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          Alle Ratgeber-Artikel ansehen
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </section>
  )
}
