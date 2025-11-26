import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { blogPosts, getBlogPostBySlug } from '../../../lib/blogData';
import { getAuthorById } from '../../../lib/authors';

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

const dateFormatter = new Intl.DateTimeFormat('de-AT', { dateStyle: 'long' });
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();

const buildImageUrl = (src?: string) => {
  if (!src) return undefined;
  return src.startsWith('http') ? src : `https://findmytherapy.net${src}`;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return { title: 'FindMyTherapy Blog' };
  }

  const canonicalUrl = `https://findmytherapy.net/blog/${post.slug}`;
  const imageUrl =
    buildImageUrl(post.featuredImage?.src) ?? 'https://findmytherapy.net/og-image.jpg';
  const author = getAuthorById(post.authorId);

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
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const author = getAuthorById(post.authorId);
  const publishedDate = new Date(post.publishedAt);
  const postUrl = `https://findmytherapy.net/blog/${post.slug}`;

  // Get related posts from same category
  const sameCategoryPosts = blogPosts
    .filter(p => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  // Get posts from other categories for variety
  const otherCategoryPosts = blogPosts
    .filter(p => p.slug !== post.slug && p.category !== post.category)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // Combine: prefer same category, fill with others
  const relatedPosts = sameCategoryPosts.length >= 3
    ? sameCategoryPosts
    : [...sameCategoryPosts, ...otherCategoryPosts].slice(0, 3);

  // Get explicitly related posts if defined
  const explicitRelated = post.relatedPosts
    ? post.relatedPosts.map(slug => blogPosts.find(p => p.slug === slug)).filter(Boolean).slice(0, 2)
    : [];

  // Article Schema
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: buildImageUrl(post.featuredImage?.src),
    author: author
      ? {
          '@type': 'Person',
          name: author.name,
          jobTitle: author.title,
        }
      : { '@type': 'Organization', name: 'FindMyTherapy' },
    publisher: {
      '@type': 'Organization',
      name: 'FindMyTherapy',
      url: 'https://findmytherapy.net',
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
  };

  // Determine where to insert mid-article CTA
  const midPoint = Math.floor(post.sections.length / 2);

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <header className="border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zum Blog
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6">
        {/* Article Header - Centered */}
        <div className="mx-auto max-w-3xl py-12 text-center">
          <p className="text-sm text-neutral-500 mb-4">
            {post.category} · {dateFormatter.format(publishedDate)} · {post.readingTime}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
            {post.title}
          </h1>
          <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author */}
          {author && (
            <div className="mt-8 flex items-center justify-center gap-3">
              {author.avatar && (
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-neutral-100">
                  <Image src={author.avatar} alt={author.name} fill className="object-cover" />
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-medium text-neutral-900">{author.name}</p>
                <p className="text-sm text-neutral-500">{author.title}</p>
              </div>
            </div>
          )}
        </div>

        {/* Featured Image - Full Width */}
        {post.featuredImage && (
          <div className="relative aspect-[2/1] overflow-hidden rounded-2xl bg-neutral-100 mb-12">
            <Image
              src={post.featuredImage.src}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Content - Centered */}
        <article className="mx-auto max-w-3xl pb-16">
          {/* Key Takeaways */}
          {post.summary && post.summary.length > 0 && (
            <div className="mb-12 p-6 rounded-xl bg-neutral-50 border border-neutral-100">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4">
                Auf einen Blick
              </h2>
              <ul className="space-y-3">
                {post.summary.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-400" />
                    <span className="text-neutral-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Content Sections with inline CTAs */}
          <div className="prose prose-neutral prose-lg max-w-none">
            {post.sections.map((section, index) => {
              const sectionId = slugify(section.heading);
              const showMidArticleCTA = index === midPoint && post.sections.length > 4;
              const showInlineRelated = index === 2 && explicitRelated.length > 0;

              return (
                <div key={section.heading}>
                  <section id={sectionId} className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                      {section.heading}
                    </h2>
                    {section.paragraphs.map((paragraph, idx) => (
                      <p key={idx} className="text-neutral-700 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                    {section.list && (
                      <ul className="my-4 space-y-2">
                        {section.list.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-neutral-700">
                            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.image && (
                      <figure className="my-8">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-neutral-100">
                          <Image
                            src={section.image.src}
                            alt={section.image.alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {section.image.caption && (
                          <figcaption className="mt-3 text-center text-sm text-neutral-500">
                            {section.image.caption}
                          </figcaption>
                        )}
                      </figure>
                    )}
                  </section>

                  {/* Inline Related Articles after section 2 */}
                  {showInlineRelated && (
                    <div className="not-prose my-10 p-6 rounded-xl bg-neutral-50 border border-neutral-100">
                      <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4">
                        Passend zum Thema
                      </p>
                      <div className="space-y-4">
                        {explicitRelated.map((related) => related && (
                          <Link
                            key={related.slug}
                            href={`/blog/${related.slug}`}
                            className="flex items-center gap-4 group"
                          >
                            <div className="relative w-20 h-14 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                              {related.featuredImage?.src && (
                                <Image
                                  src={related.featuredImage.src}
                                  alt={related.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-neutral-900 group-hover:text-neutral-600 transition line-clamp-2">
                                {related.title}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mid-article Quiz CTA */}
                  {showMidArticleCTA && (
                    <div className="not-prose my-10 p-6 rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white">
                      <p className="font-semibold text-neutral-900 mb-2">
                        Noch unsicher, welche Unterstützung passt?
                      </p>
                      <p className="text-sm text-neutral-600 mb-4">
                        Unser kurzes Quiz hilft dir, die richtige Richtung zu finden.
                      </p>
                      <Link
                        href="/quiz"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition"
                      >
                        Quiz starten
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Author Bio */}
          {author && (
            <div className="mt-12 pt-8 border-t border-neutral-100">
              <div className="flex items-start gap-4">
                {author.avatar && (
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-neutral-100">
                    <Image src={author.avatar} alt={author.name} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-neutral-900">{author.name}</p>
                  <p className="text-sm text-neutral-500 mb-2">{author.title}</p>
                  <p className="text-sm text-neutral-600 leading-relaxed">{author.bio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Multiple CTAs */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <Link
              href="/therapists"
              className="p-6 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition"
            >
              <p className="font-semibold mb-1">Therapeut:in finden</p>
              <p className="text-sm text-neutral-400">
                Spezialist:innen für deine Themen
              </p>
            </Link>
            <Link
              href="/quiz"
              className="p-6 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition"
            >
              <p className="font-semibold text-neutral-900 mb-1">Schnell-Quiz</p>
              <p className="text-sm text-neutral-500">
                In 2 Min. zur Orientierung
              </p>
            </Link>
          </div>
        </article>

        {/* Related Articles - More prominent */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-neutral-100 py-16">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-neutral-900">Weitere Artikel</h2>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition flex items-center gap-1"
                >
                  Alle Artikel
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.slug} className="group">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100 mb-4">
                        {relatedPost.featuredImage?.src ? (
                          <Image
                            src={relatedPost.featuredImage.src}
                            alt={relatedPost.featuredImage.alt || relatedPost.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 mb-2">
                        {relatedPost.category} · {dateFormatter.format(new Date(relatedPost.publishedAt))}
                      </p>
                      <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA Banner */}
        <section className="border-t border-neutral-100 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Bereit für den nächsten Schritt?
            </h2>
            <p className="text-neutral-600 mb-8">
              Finde professionelle Unterstützung, die zu dir passt.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/therapists"
                className="px-6 py-3 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition"
              >
                Therapeut:innen durchsuchen
              </Link>
              <Link
                href="/triage"
                className="px-6 py-3 rounded-lg border border-neutral-200 text-neutral-700 font-medium hover:bg-neutral-50 transition"
              >
                Ersteinschätzung starten
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
    </div>
  );
}
