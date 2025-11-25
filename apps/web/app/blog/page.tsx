'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { blogPosts } from '../../lib/blogData';
import { NewsletterForm } from '@/app/components/forms/NewsletterForm';

// Sort blog posts by date (newest first)
const sortedBlogPosts = [...blogPosts].sort((a, b) => {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
});

const categories = Array.from(new Set(blogPosts.map((post) => post.category)));
const categoryToSlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');
const dateFormatter = new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium' });

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

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://findmytherapy.net' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://findmytherapy.net/blog' },
  ],
};

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return sortedBlogPosts.filter((post) => {
      if (selectedCategory && post.category !== selectedCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          post.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const [featuredPost, ...restPosts] = filteredPosts;
  const gridPosts = restPosts.slice(0, 8);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Back to Home */}
          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-600 transition hover:text-primary-700"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden font-medium sm:inline">FindMyTherapy</span>
          </Link>

          {/* Title */}
          <h1 className="text-lg font-bold text-neutral-900">Blog</h1>

          {/* Search */}
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-8 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Category Pills */}
        <nav className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              !selectedCategory
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Alle
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {category}
            </button>
          ))}
        </nav>

        {/* Results Info */}
        {(searchQuery || selectedCategory) && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              {filteredPosts.length} Artikel gefunden
              {selectedCategory && <span className="font-medium"> in {selectedCategory}</span>}
              {searchQuery && <span className="font-medium"> für &quot;{searchQuery}&quot;</span>}
            </p>
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-primary-700 hover:text-primary-800"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          /* No Results */
          <div className="py-20 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
            <h2 className="text-xl font-semibold text-neutral-900">Keine Artikel gefunden</h2>
            <p className="mt-2 text-neutral-600">Versuche andere Suchbegriffe oder Kategorien.</p>
            <button
              onClick={clearFilters}
              className="mt-4 rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Alle anzeigen
            </button>
          </div>
        ) : (
          <>
            {/* Featured Article - Magazine Style */}
            {featuredPost && (
              <article className="group mb-10">
                <Link href={`/blog/${featuredPost.slug}`} className="block">
                  <div className="relative aspect-[2/1] overflow-hidden rounded-2xl bg-neutral-200 sm:aspect-[21/9]">
                    {featuredPost.featuredImage?.src ? (
                      <Image
                        src={featuredPost.featuredImage.src}
                        alt={featuredPost.featuredImage.alt || featuredPost.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600" />
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                      <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                        {featuredPost.category}
                      </span>
                      <h2 className="mb-3 text-2xl font-bold leading-tight text-white sm:text-4xl">
                        {featuredPost.title}
                      </h2>
                      <p className="mb-4 hidden max-w-2xl text-sm text-white/80 sm:block sm:text-base">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-white/70">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {dateFormatter.format(new Date(featuredPost.publishedAt))}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {featuredPost.readingTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {/* Magazine Grid */}
            <div className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post, index) => (
                <article
                  key={post.slug}
                  className={`group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                    index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
                  }`}
                >
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    {/* Image */}
                    <div
                      className={`relative overflow-hidden bg-neutral-200 ${
                        index === 0 ? 'aspect-[4/3]' : 'aspect-[16/10]'
                      }`}
                    >
                      {post.featuredImage?.src ? (
                        <Image
                          src={post.featuredImage.src}
                          alt={post.featuredImage.alt || post.title}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500" />
                      )}
                      {/* Category Badge */}
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-neutral-800 backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5">
                      <h3
                        className={`font-semibold text-neutral-900 group-hover:text-primary-700 ${
                          index === 0 ? 'text-xl sm:text-2xl' : 'text-lg'
                        }`}
                      >
                        {post.title}
                      </h3>
                      {index === 0 && (
                        <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{post.excerpt}</p>
                      )}
                      <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500">
                        <span>{dateFormatter.format(new Date(post.publishedAt))}</span>
                        <span>·</span>
                        <span>{post.readingTime}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* More Articles - Simple List */}
            {restPosts.length > 8 && (
              <section className="mb-12">
                <h2 className="mb-6 text-xl font-bold text-neutral-900">Weitere Artikel</h2>
                <div className="space-y-4">
                  {restPosts.slice(8).map((post) => (
                    <article
                      key={post.slug}
                      className="group flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-primary-200 hover:shadow-sm"
                    >
                      {post.featuredImage?.src && (
                        <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-200">
                          <Image
                            src={post.featuredImage.src}
                            alt={post.featuredImage.alt || post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link href={`/blog/${post.slug}`}>
                          <h3 className="font-semibold text-neutral-900 group-hover:text-primary-700 line-clamp-1">
                            {post.title}
                          </h3>
                        </Link>
                        <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                          <span className="font-medium text-primary-700">{post.category}</span>
                          <span>·</span>
                          <span>{dateFormatter.format(new Date(post.publishedAt))}</span>
                          <span>·</span>
                          <span>{post.readingTime}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-neutral-400 transition group-hover:translate-x-1 group-hover:text-primary-600" />
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* View All by Category */}
            <section className="mb-12 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-neutral-900">
                Nach Kategorie durchsuchen
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const count = blogPosts.filter((p) => p.category === category).length;
                  return (
                    <Link
                      key={category}
                      href={`/blog/category/${categoryToSlug(category)}`}
                      className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                    >
                      {category}
                      <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs text-neutral-600">
                        {count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* Newsletter */}
        <section className="rounded-2xl bg-gradient-to-br from-primary-900 to-primary-700 p-8 text-white sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Newsletter abonnieren</h2>
            <p className="mt-2 text-primary-100">
              Erhalte neue Artikel und Tipps zu mentaler Gesundheit direkt in deinen Posteingang.
            </p>
            <div className="mt-6">
              <NewsletterForm variant="newsletter" className="mx-auto max-w-md" />
            </div>
          </div>
        </section>
      </main>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
    </div>
  );
}
