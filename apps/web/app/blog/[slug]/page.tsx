import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { getBlogPostBySlug, getAllBlogPosts, getRelatedPosts } from '@/lib/blogService';
import { getAuthorById } from '@/lib/authors';
import { BackLink } from '../../components/BackLink';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
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

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: 'FindMyTherapy Blog' };
  }

  const canonicalUrl = `https://findmytherapy.net/blog/${post.slug}`;
  const imageUrl =
    buildImageUrl(post.featuredImage?.src) ?? 'https://findmytherapy.net/og-image.jpg';

  // Use authorProfile from database or fall back to static author
  const authorName = post.authorProfile?.displayName || post.author;

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: authorName ? [`https://findmytherapy.net/blog/authors/${slugify(authorName)}`] : undefined,
      section: post.category,
      tags: [...post.keywords, ...post.tags],
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Use authorProfile from database or fall back to static author lookup
  const author = post.authorProfile
    ? {
        name: post.authorProfile.displayName || post.author,
        title: post.authorProfile.title || 'Therapeut:in',
        avatar: post.authorProfile.profileImageUrl || undefined,
        bio: '', // DB posts don't have bio in this context
        slug: slugify(post.authorProfile.displayName || post.author),
      }
    : getAuthorById(post.authorId);

  const publishedDate = new Date(post.publishedAt);
  const postUrl = `https://findmytherapy.net/blog/${post.slug}`;

  // Get related posts using blogService
  const relatedPosts = await getRelatedPosts(post, 3);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <header className="border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <BackLink href="/blog" label="Zurück zum Blog" />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Article - Clean structure for Reader Mode */}
        <article className="mx-auto max-w-3xl">
          {/* Article Header */}
          <header className="py-8 sm:py-12 text-center">
            <p className="text-sm text-neutral-500 mb-4">
              <span>{post.category}</span>
              <span aria-hidden="true"> · </span>
              <time dateTime={post.publishedAt}>{dateFormatter.format(publishedDate)}</time>
              <span aria-hidden="true"> · </span>
              <span>{post.readingTime}</span>
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
              {post.title}
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-neutral-600 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author - part of article header for Reader Mode */}
            {author && (
              <address className="mt-6 sm:mt-8 flex items-center justify-center gap-3 not-italic">
                {author.avatar && (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-neutral-100">
                    <Image src={author.avatar} alt={author.name} fill sizes="40px" className="object-cover" />
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm font-medium text-neutral-900">{author.name}</p>
                  <p className="text-sm text-neutral-500">{author.title}</p>
                </div>
              </address>
            )}
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <figure className="mb-8 sm:mb-12 -mx-4 sm:mx-0">
              <div className="relative aspect-[4/3] sm:aspect-[2/1] overflow-hidden sm:rounded-2xl bg-neutral-100">
                <Image
                  src={post.featuredImage.src}
                  alt={post.featuredImage.alt || post.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </figure>
          )}

          {/* Article Body - Clean for Reader Mode */}
          <div className="pb-8 sm:pb-16">
          {/* Key Takeaways - Reader Mode friendly */}
          {post.summary && post.summary.length > 0 && (
            <aside className="mb-8 sm:mb-12 p-4 sm:p-6 rounded-xl bg-neutral-50 border border-neutral-100">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4">
                Auf einen Blick
              </h2>
              <ul className="space-y-2 sm:space-y-3">
                {post.summary.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-400" />
                    <span className="text-sm sm:text-base text-neutral-700">{point}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {/* Content Sections - Clean for Reader Mode (no inline CTAs) */}
          <div className="prose prose-neutral prose-base sm:prose-lg max-w-none
                          prose-headings:scroll-mt-24
                          prose-p:text-neutral-700
                          prose-li:text-neutral-700
                          prose-img:rounded-xl">
            {post.content.sections.map((section) => {
              const sectionId = slugify(section.heading);

              return (
                <section key={section.heading} id={sectionId} className="mb-8 sm:mb-12">
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3 sm:mb-4">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="my-4 space-y-2">
                      {section.list.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.image && (
                    <figure className="my-6 sm:my-8 -mx-4 sm:mx-0">
                      <div className="relative aspect-[16/9] overflow-hidden sm:rounded-xl bg-neutral-100">
                        <Image
                          src={section.image.src}
                          alt={section.image.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 768px"
                          className="object-cover"
                        />
                      </div>
                      {section.image.caption && (
                        <figcaption className="mt-2 sm:mt-3 text-center text-xs sm:text-sm text-neutral-500 px-4 sm:px-0">
                          {section.image.caption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </section>
              );
            })}
          </div>

          {/* FAQ Section */}
          {post.faq && post.faq.length > 0 && (
            <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-neutral-100">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-6">
                Häufige Fragen
              </h2>
              <dl className="space-y-4">
                {post.faq.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-neutral-50">
                    <dt className="font-semibold text-neutral-900 mb-2">
                      {item.question}
                    </dt>
                    <dd className="text-neutral-600 leading-relaxed">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Author Bio - Footer of article */}
          {author && (
            <footer className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-neutral-100">
              <div className="flex items-start gap-3 sm:gap-4">
                {author.avatar && (
                  <div className="relative h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 overflow-hidden rounded-full bg-neutral-100">
                    <Image src={author.avatar} alt={author.name} fill sizes="40px" className="object-cover" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-neutral-900">{author.name}</p>
                  <p className="text-sm text-neutral-500 mb-2">{author.title}</p>
                  {author.bio && (
                    <p className="text-sm text-neutral-600 leading-relaxed">{author.bio}</p>
                  )}
                </div>
              </div>
            </footer>
          )}
          </div>
        </article>

        {/* CTAs - Outside article for Reader Mode */}
        <div className="mx-auto max-w-3xl py-8 sm:py-12">
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <Link
              href="/therapists"
              className="p-4 sm:p-6 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition min-h-[44px]"
            >
              <p className="font-semibold mb-1">Therapeut:in finden</p>
              <p className="text-sm text-neutral-400">
                Spezialist:innen für deine Themen
              </p>
            </Link>
            <Link
              href="/quiz"
              className="p-4 sm:p-6 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition min-h-[44px]"
            >
              <p className="font-semibold text-neutral-900 mb-1">Schnell-Quiz</p>
              <p className="text-sm text-neutral-500">
                In 2 Min. zur Orientierung
              </p>
            </Link>
          </div>
        </div>

        {/* Related Articles - Horizontal scroll on mobile */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-neutral-100 py-10 sm:py-16">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">Weitere Artikel</h2>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition flex items-center gap-1 min-h-[44px] px-2"
                >
                  Alle Artikel
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {/* Horizontal scroll on mobile, grid on larger screens */}
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 sm:overflow-visible snap-x snap-mandatory">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.slug} className="group flex-shrink-0 w-[280px] sm:w-auto snap-start">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100 mb-3 sm:mb-4">
                        {relatedPost.featuredImage?.src ? (
                          <Image
                            src={relatedPost.featuredImage.src}
                            alt={relatedPost.featuredImage.alt || relatedPost.title}
                            fill
                            sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-500 mb-1 sm:mb-2">
                        {relatedPost.category} · {dateFormatter.format(new Date(relatedPost.publishedAt))}
                      </p>
                      <h3 className="text-base sm:text-lg font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2">
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
        <section className="border-t border-neutral-100 py-10 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 mb-3 sm:mb-4">
              Bereit für den nächsten Schritt?
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mb-6 sm:mb-8">
              Finde professionelle Unterstützung, die zu dir passt.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                href="/therapists"
                className="px-6 py-3 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition min-h-[44px] flex items-center justify-center"
              >
                Therapeut:innen durchsuchen
              </Link>
              <Link
                href="/triage"
                className="px-6 py-3 rounded-lg border border-neutral-200 text-neutral-700 font-medium hover:bg-neutral-50 transition min-h-[44px] flex items-center justify-center"
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
