import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/blogData';
import { Badge } from '@mental-health/ui';
import { ArrowRight, Clock, TrendingUp, Sparkles } from 'lucide-react';

interface RelatedArticlesProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
  variant?: 'default' | 'sidebar' | 'inline';
  maxPosts?: number;
  showNextArticle?: boolean;
}

// Calculate relevance score for a post
function calculateRelevanceScore(candidatePost: BlogPost, currentPost: BlogPost): number {
  let score = 0;

  // Tag overlap - most important factor (0-50 points)
  if (currentPost.tags && candidatePost.tags) {
    const matchingTags = candidatePost.tags.filter((tag) => currentPost.tags.includes(tag));
    score += matchingTags.length * 15; // 15 points per matching tag
  }

  // Keyword overlap (0-30 points)
  if (currentPost.keywords && candidatePost.keywords) {
    const matchingKeywords = candidatePost.keywords.filter((kw) =>
      currentPost.keywords.some(
        (currentKw) =>
          currentKw.toLowerCase().includes(kw.toLowerCase()) ||
          kw.toLowerCase().includes(currentKw.toLowerCase()),
      ),
    );
    score += Math.min(matchingKeywords.length * 5, 30);
  }

  // Same category bonus (20 points)
  if (candidatePost.category === currentPost.category) {
    score += 20;
  }

  // Recency bonus - newer posts get slight boost (0-10 points)
  const candidateDate = new Date(candidatePost.publishedAt).getTime();
  const now = Date.now();
  const daysSincePublished = (now - candidateDate) / (1000 * 60 * 60 * 24);
  if (daysSincePublished < 30) {
    score += 10;
  } else if (daysSincePublished < 90) {
    score += 5;
  }

  // Same author bonus - for content series (5 points)
  if (candidatePost.authorId === currentPost.authorId) {
    score += 5;
  }

  return score;
}

// Get the next article for "Continue reading" CTA
function getNextArticle(currentPost: BlogPost, allPosts: BlogPost[]): BlogPost | null {
  // First check for manually specified related posts
  if (currentPost.relatedPosts && currentPost.relatedPosts.length > 0) {
    const firstRelated = allPosts.find((p) => p.slug === currentPost.relatedPosts![0]);
    if (firstRelated) return firstRelated;
  }

  // Otherwise, get the highest-scored related post
  const candidates = allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => ({
      post,
      score: calculateRelevanceScore(post, currentPost),
    }))
    .sort((a, b) => b.score - a.score);

  return candidates.length > 0 ? candidates[0].post : null;
}

export function RelatedArticles({
  currentPost,
  allPosts,
  variant = 'default',
  maxPosts,
  showNextArticle = true,
}: RelatedArticlesProps) {
  // Calculate scores for all candidates
  const scoredPosts = allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => ({
      post,
      score: calculateRelevanceScore(post, currentPost),
      isManuallySpecified: currentPost.relatedPosts?.includes(post.slug),
    }));

  // Sort: manually specified first, then by score
  scoredPosts.sort((a, b) => {
    if (a.isManuallySpecified && !b.isManuallySpecified) return -1;
    if (!a.isManuallySpecified && b.isManuallySpecified) return 1;
    return b.score - a.score;
  });

  // Determine how many posts to show based on variant
  const postLimit = maxPosts || (variant === 'sidebar' ? 5 : variant === 'inline' ? 2 : 6);
  const relatedPosts = scoredPosts.slice(0, postLimit).map((sp) => sp.post);

  if (relatedPosts.length === 0) {
    return null;
  }

  const nextArticle = showNextArticle ? getNextArticle(currentPost, allPosts) : null;

  // Inline variant - compact horizontal scroll for mid-article recommendations
  if (variant === 'inline') {
    return (
      <div className="my-6 rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50/50 to-secondary-50/50 p-4 sm:my-10 sm:p-6">
        <div className="mb-3 flex items-center gap-2 sm:mb-4">
          <Sparkles className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-semibold text-primary-700">Verwandte Themen</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 sm:gap-4 scrollbar-hide">
          {relatedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex min-w-[200px] max-w-[240px] flex-shrink-0 gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm transition hover:border-primary-200 hover:shadow-md sm:min-w-[240px] sm:max-w-[280px]"
            >
              {post.featuredImage && (
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={post.featuredImage.src}
                    alt={post.featuredImage.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0 overflow-hidden">
                <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-primary-600 line-clamp-2 break-words">
                  {post.title}
                </h4>
                <span className="mt-1 text-xs text-neutral-500">{post.readingTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Sidebar variant - YouTube-style vertical list with enhanced visuals
  if (variant === 'sidebar') {
    return (
      <div className="space-y-4">
        {relatedPosts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex gap-3 rounded-xl p-2 transition hover:bg-neutral-50"
          >
            {/* Thumbnail with play-like indicator */}
            <div className="relative">
              {post.featuredImage && (
                <div className="relative h-[68px] w-[120px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={post.featuredImage.src}
                    alt={post.featuredImage.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Reading time overlay like YouTube duration */}
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {post.readingTime}
                  </span>
                </div>
              )}
              {index === 0 && (
                <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                  1
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0 py-0.5 overflow-hidden">
              {/* Title - 2 lines max */}
              <h4 className="text-sm font-semibold leading-snug text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 break-words">
                {post.title}
              </h4>

              {/* Category & metadata */}
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500">
                <span className="font-medium text-primary-600/80">{post.category}</span>
                <span>•</span>
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('de-AT', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            </div>
          </Link>
        ))}

        {/* View All Link with count */}
        <Link
          href="/blog"
          className="group mt-4 flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-primary-700 transition hover:border-primary-200 hover:bg-primary-50"
        >
          <span>Alle {allPosts.length} Artikel</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  // Generate schema.org ItemList for SEO
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Verwandte Artikel',
    numberOfItems: relatedPosts.length,
    itemListElement: relatedPosts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'BlogPosting',
        headline: post.title,
        url: `https://findmytherapy.net/blog/${post.slug}`,
        description: post.excerpt,
        datePublished: post.publishedAt,
        image: post.featuredImage?.src,
      },
    })),
  };

  // Default variant - grid layout at bottom with Next Article CTA
  return (
    <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 sm:mt-16 sm:pt-16">
      {/* Schema.org ItemList for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Next Article CTA - YouTube-style prominent recommendation */}
      {nextArticle && showNextArticle && (
        <div className="mb-8 sm:mb-12">
          <div className="mb-3 flex items-center gap-2 sm:mb-4">
            <TrendingUp className="h-4 w-4 text-primary-600 sm:h-5 sm:w-5" />
            <span className="text-xs font-semibold uppercase tracking-wide text-primary-600 sm:text-sm">
              Empfohlen
            </span>
          </div>
          <Link
            href={`/blog/${nextArticle.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-primary-200 bg-gradient-to-br from-primary-50 to-secondary-50 shadow-lg transition hover:shadow-xl sm:rounded-2xl md:flex-row"
          >
            {nextArticle.featuredImage && (
              <div className="relative h-40 w-full sm:h-48 md:h-auto md:w-2/5">
                <Image
                  src={nextArticle.featuredImage.src}
                  alt={nextArticle.featuredImage.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary-50/90 md:block hidden" />
              </div>
            )}
            <div className="flex flex-1 flex-col justify-center p-4 sm:p-6 md:p-8">
              <Badge
                variant="neutral"
                className="mb-2 self-start bg-primary-100 text-primary-700 sm:mb-3"
              >
                {nextArticle.category}
              </Badge>
              <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary-700 transition-colors sm:text-xl md:text-2xl break-words">
                {nextArticle.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 line-clamp-2 sm:text-base">
                {nextArticle.excerpt}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500 sm:mt-4 sm:gap-4 sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {nextArticle.readingTime}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary-600 group-hover:gap-2 transition-all">
                  Jetzt lesen
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:text-2xl sm:mb-8">
        Das könnte Sie auch interessieren
      </h2>

      {/* 6-post grid for better discovery */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm transition hover:shadow-lg hover:border-primary-200 min-w-0"
          >
            {/* Featured Image with overlay */}
            {post.featuredImage && (
              <div className="relative h-40 w-full bg-gray-100">
                <Image
                  src={post.featuredImage.src}
                  alt={post.featuredImage.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Reading time badge */}
                <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
                  {post.readingTime}
                </span>
              </div>
            )}

            <div className="flex flex-1 flex-col p-4">
              {/* Category Badge */}
              <Badge variant="neutral" className="mb-2 self-start text-xs font-medium">
                {post.category}
              </Badge>

              {/* Title */}
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 flex-grow break-words">
                {post.title}
              </h3>

              {/* Metadata */}
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('de-AT', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Articles CTA */}
      <div className="mt-6 text-center sm:mt-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border-2 border-primary-600 bg-white px-4 py-2.5 text-sm font-semibold text-primary-600 transition hover:bg-primary-600 hover:text-white sm:px-6 sm:py-3"
        >
          Alle Artikel entdecken
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

// Export helper for inline recommendations
export function InlineRecommendation({
  currentPost,
  allPosts,
}: {
  currentPost: BlogPost;
  allPosts: BlogPost[];
}) {
  return (
    <RelatedArticles
      currentPost={currentPost}
      allPosts={allPosts}
      variant="inline"
      maxPosts={2}
      showNextArticle={false}
    />
  );
}
