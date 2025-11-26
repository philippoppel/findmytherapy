'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight } from 'lucide-react';
import { blogPosts } from '../../lib/blogData';

// Sort blog posts by date (newest first)
const sortedBlogPosts = [...blogPosts].sort((a, b) => {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
});

const categories = Array.from(new Set(blogPosts.map((post) => post.category)));
const categoryToSlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');
const dateFormatter = new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium' });

// Category images for hero banners (Unsplash)
const CATEGORY_IMAGES: Record<string, string> = {
  'Angst & Panik': 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=1200&h=400&q=80',
  'Depression & Stimmung': 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&h=400&q=80',
  'Stress & Burnout': 'https://images.unsplash.com/photo-1473830394358-91588751b241?auto=format&fit=crop&w=1200&h=400&q=80',
  'Therapie verstehen': 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1200&h=400&q=80',
  'Therapeut:in finden': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&h=400&q=80',
  'Selbsthilfe & Alltag': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&h=400&q=80',
  'Arbeit & Karriere': 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&h=400&q=80',
  'Kosten & Finanzierung': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&h=400&q=80',
  'Wissen & Fakten': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&h=400&q=80',
  'Über FindMyTherapy': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&h=400&q=80',
};

// Structured Data
const blogStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'FindMyTherapy Blog',
  description: 'Artikel zu mentaler Gesundheit, Psychotherapie und Selbsthilfe in Österreich.',
  url: 'https://findmytherapy.net/blog',
  inLanguage: 'de-AT',
  publisher: {
    '@type': 'Organization',
    name: 'FindMyTherapy',
    url: 'https://findmytherapy.net',
  },
};

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter posts (only for search)
  const filteredPosts = useMemo(() => {
    if (!searchQuery) return sortedBlogPosts;

    const query = searchQuery.toLowerCase();
    return sortedBlogPosts.filter((post) => {
      return (
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        post.category.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const [featuredPost, ...restPosts] = filteredPosts;

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <header className="border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-neutral-400 hover:text-neutral-600 transition">
                <ArrowRight className="h-5 w-5 rotate-180" />
              </Link>
              <h1 className="text-2xl font-semibold text-neutral-900">Blog</h1>
            </div>

            {/* Search */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                placeholder="Suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2.5 pl-11 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-100 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-8 flex items-center gap-3">
            <span className="text-sm text-neutral-500">{filteredPosts.length} Ergebnisse für</span>
            <span className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-md text-sm font-medium">
              &quot;{searchQuery}&quot;
            </span>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          /* No Results */
          <div className="py-24 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
            <h2 className="text-xl font-semibold text-neutral-900">Keine Artikel gefunden</h2>
            <p className="mt-2 text-neutral-500">Versuche andere Suchbegriffe.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-6 rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition"
            >
              Alle Artikel anzeigen
            </button>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredPost && !searchQuery && (
              <article className="group mb-16">
                <Link href={`/blog/${featuredPost.slug}`} className="block">
                  <div className="relative aspect-[2.5/1] overflow-hidden rounded-2xl bg-neutral-100">
                    {featuredPost.featuredImage?.src ? (
                      <Image
                        src={featuredPost.featuredImage.src}
                        alt={featuredPost.featuredImage.alt || featuredPost.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.02]"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
                      <p className="text-sm text-white/70 mb-3">
                        {featuredPost.category} · {dateFormatter.format(new Date(featuredPost.publishedAt))}
                      </p>
                      <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 max-w-3xl">
                        {featuredPost.title}
                      </h2>
                      <p className="text-white/80 max-w-2xl text-base sm:text-lg hidden sm:block">
                        {featuredPost.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {/* Articles Grid */}
            <section className="mb-20">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {(searchQuery ? filteredPosts : restPosts).slice(0, 9).map((post) => (
                  <article key={post.slug} className="group">
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100 mb-4">
                        {post.featuredImage?.src ? (
                          <Image
                            src={post.featuredImage.src}
                            alt={post.featuredImage.alt || post.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 mb-2">
                        {post.category} · {dateFormatter.format(new Date(post.publishedAt))}
                      </p>
                      <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            {/* Category Hero Banners */}
            {!searchQuery && (
              <section className="mb-20">
                <h2 className="text-2xl font-semibold text-neutral-900 mb-8">Nach Thema durchsuchen</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {categories.slice(0, 6).map((category) => {
                    const count = blogPosts.filter((p) => p.category === category).length;
                    const imageUrl = CATEGORY_IMAGES[category] || 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&h=400&q=80';

                    return (
                      <Link
                        key={category}
                        href={`/blog/category/${categoryToSlug(category)}`}
                        className="group relative block overflow-hidden rounded-2xl aspect-[2.5/1]"
                      >
                        <Image
                          src={imageUrl}
                          alt={category}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-xl font-bold text-white">{category}</h3>
                          <p className="text-white/70 text-sm mt-1">{count} Artikel</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Remaining categories as simple links */}
                {categories.length > 6 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {categories.slice(6).map((category) => {
                      const count = blogPosts.filter((p) => p.category === category).length;
                      return (
                        <Link
                          key={category}
                          href={`/blog/category/${categoryToSlug(category)}`}
                          className="px-4 py-2 rounded-lg bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-neutral-200 transition"
                        >
                          {category} ({count})
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* More Articles */}
            {!searchQuery && restPosts.length > 9 && (
              <section className="mb-20">
                <h2 className="text-2xl font-semibold text-neutral-900 mb-8">Weitere Artikel</h2>
                <div className="space-y-6">
                  {restPosts.slice(9).map((post) => (
                    <article key={post.slug} className="group">
                      <Link href={`/blog/${post.slug}`} className="flex items-start gap-6">
                        <div className="relative w-32 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                          {post.featuredImage?.src && (
                            <Image
                              src={post.featuredImage.src}
                              alt={post.featuredImage.alt || post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition duration-300"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-neutral-500 mb-1">
                            {post.category} · {dateFormatter.format(new Date(post.publishedAt))}
                          </p>
                          <h3 className="font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Minimal CTA */}
            {!searchQuery && mounted && (
              <section className="py-12 border-t border-neutral-100">
                <div className="text-center">
                  <p className="text-neutral-500 mb-4">Nicht sicher wo du anfangen sollst?</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/quiz"
                      className="px-6 py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition"
                    >
                      Quiz starten
                    </Link>
                    <Link
                      href="/therapists"
                      className="px-6 py-2.5 rounded-lg border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition"
                    >
                      Therapeut:innen finden
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
    </div>
  );
}
