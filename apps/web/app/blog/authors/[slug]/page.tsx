import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllAuthors } from '@/lib/authors';
import { blogPosts } from '@/lib/blogData';
import { Badge } from '@mental-health/ui';
import { BackLink } from '@/app/components/BackLink';

type AuthorPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  const authors = getAllAuthors();
  return authors.map((author) => ({
    slug: author.slug,
  }));
}

export function generateMetadata({ params }: AuthorPageProps): Metadata {
  const authors = getAllAuthors();
  const author = authors.find((a) => a.slug === params.slug);

  if (!author) {
    return {
      title: 'Autor nicht gefunden | FindMyTherapy Blog',
    };
  }

  const authorPosts = blogPosts.filter((post) => post.authorId === author.id);
  const description = `${author.bio} ${authorPosts.length} Artikel auf FindMyTherapy.`;

  return {
    title: `${author.name} – ${author.title} | FindMyTherapy Blog`,
    description,
    keywords: [
      author.name,
      author.title,
      ...author.expertise,
      'FindMyTherapy',
      'Psychotherapie',
      'mentale Gesundheit',
    ],
    authors: [{ name: author.name }],
    alternates: {
      canonical: `https://findmytherapy.net/blog/authors/${params.slug}`,
    },
    openGraph: {
      title: `${author.name} – ${author.title}`,
      description,
      type: 'profile',
      locale: 'de_AT',
      siteName: 'FindMyTherapy',
      url: `https://findmytherapy.net/blog/authors/${params.slug}`,
      images: author.avatar
        ? [
            {
              url: author.avatar.startsWith('http')
                ? author.avatar
                : `https://findmytherapy.net${author.avatar}`,
              width: 400,
              height: 400,
              alt: author.name,
            },
          ]
        : [
            {
              url: 'https://findmytherapy.net/images/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'FindMyTherapy Blog',
            },
          ],
    },
    twitter: {
      card: 'summary',
      title: `${author.name} – ${author.title}`,
      description,
      images: author.avatar
        ? [
            author.avatar.startsWith('http')
              ? author.avatar
              : `https://findmytherapy.net${author.avatar}`,
          ]
        : ['https://findmytherapy.net/images/og-image.jpg'],
    },
  };
}

export default function AuthorPage({ params }: AuthorPageProps) {
  const authors = getAllAuthors();
  const author = authors.find((a) => a.slug === params.slug);

  if (!author) {
    notFound();
  }

  // Get all posts by this author
  const authorPosts = blogPosts.filter((post) => post.authorId === author.id);

  // Extended Person Schema for E-E-A-T signals
  const authorStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `https://findmytherapy.net/blog/authors/${author.slug}#person`,
    name: author.name,
    jobTitle: author.title,
    description: author.bio,
    url: `https://findmytherapy.net/blog/authors/${author.slug}`,
    image: author.avatar?.startsWith('http')
      ? author.avatar
      : `https://findmytherapy.net${author.avatar}`,
    sameAs: Object.values(author.social || {}).filter(Boolean),
    knowsAbout: author.expertise.map((skill) => ({
      '@type': 'Thing',
      name: skill,
    })),
    // Credentials for medical authority (E-E-A-T)
    hasCredential: author.credentials
      ? {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: author.credentials,
        }
      : undefined,
    // Affiliation to FindMyTherapy
    affiliation: {
      '@type': 'Organization',
      name: 'FindMyTherapy',
      url: 'https://findmytherapy.net',
    },
    // Articles written by this author
    ...(authorPosts.length > 0 && {
      author: authorPosts.map((post) => ({
        '@type': 'BlogPosting',
        '@id': `https://findmytherapy.net/blog/${post.slug}#article`,
        headline: post.title,
        url: `https://findmytherapy.net/blog/${post.slug}`,
      })),
    }),
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
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
        name: 'Autoren',
        item: 'https://findmytherapy.net/blog/authors',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: author.name,
        item: `https://findmytherapy.net/blog/authors/${author.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <BackLink href="/blog" label="Zurück zum Blog" />
        </div>

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
          <span className="text-gray-900 dark:text-white">Autoren</span>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{author.name}</span>
        </nav>

        {/* Author Profile Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 sm:p-12 mb-12 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary-500/20 flex-shrink-0">
              <Image src={author.avatar} alt={author.name} fill sizes="128px" className="object-cover" />
            </div>

            {/* Bio */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {author.name}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                {author.title} • {author.credentials}
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {author.bio}
              </p>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {author.expertise.map((skill) => (
                  <Badge key={skill} variant="neutral">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Social Links */}
              {author.social && (
                <div className="flex items-center gap-4">
                  {author.social.linkedin && (
                    <a
                      href={author.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                  {author.social.twitter && (
                    <a
                      href={author.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      aria-label="Twitter"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  )}
                  {author.social.website && (
                    <a
                      href={author.social.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      aria-label="Website"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Author's Articles */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Artikel von {author.name} ({authorPosts.length})
          </h2>

          {authorPosts.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-12">
              Noch keine Artikel veröffentlicht.
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {authorPosts.map((post) => (
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
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-grow">
                    <Badge variant="neutral" className="self-start mb-3">
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
          )}
        </div>

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Zurück zum Blog
          </Link>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </main>
  );
}
