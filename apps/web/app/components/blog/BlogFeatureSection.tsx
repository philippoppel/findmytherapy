import Link from 'next/link'
import Image from 'next/image'
import { blogPosts } from '@/lib/blogData'
import { Badge } from '@mental-health/ui'
import { SectionHeading } from '../marketing/SectionHeading'

export function BlogFeatureSection() {
  // Get the 4 most recent posts
  const recentPosts = blogPosts.slice(0, 4)
  const [featuredPost, ...otherPosts] = recentPosts

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionHeading
            eyebrow="Wissen"
            title="Verifizierte Ratgeber von Expert:innen"
            subtitle="Evidenzbasiertes Wissen von anerkannten Psychotherapeut:innen – auch für akute Notfälle wie Panikattacken"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Featured Post - Large Card */}
          {featuredPost && (
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group lg:row-span-2 relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-800"
            >
              {/* Featured Image */}
              {featuredPost.featuredImage && (
                <div className="relative w-full h-80 overflow-hidden">
                  <Image
                    src={featuredPost.featuredImage.src}
                    alt={featuredPost.featuredImage.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Category Badge on Image */}
                  <Badge className="absolute top-4 left-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                    {featuredPost.category}
                  </Badge>
                </div>
              )}

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {featuredPost.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {featuredPost.excerpt}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                  <span className="flex items-center gap-1">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {featuredPost.publishedAt}
                  </span>
                  <span className="flex items-center gap-1">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {featuredPost.readingTime}
                  </span>
                </div>

                {/* Arrow Icon */}
                <div className="mt-6 inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium group-hover:gap-4 transition-all">
                  Artikel lesen
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          )}

          {/* Other Posts - Smaller Cards */}
          <div className="grid gap-6">
            {otherPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex gap-4 p-6 rounded-xl bg-white dark:bg-gray-900 shadow hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800"
              >
                {/* Thumbnail */}
                {post.featuredImage && (
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={post.featuredImage.src}
                      alt={post.featuredImage.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <Badge variant="neutral" className="mb-2 text-xs">
                    {post.category}
                  </Badge>

                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {post.title}
                  </h4>

                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                    <span>{post.publishedAt}</span>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA to Blog */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 rounded-lg font-medium hover:bg-primary-50 dark:hover:bg-primary-950 transition-all shadow-sm hover:shadow-md"
          >
            Alle Ratgeber-Artikel ansehen
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
