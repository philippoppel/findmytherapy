'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, Calendar, Clock, ArrowRight, Filter } from 'lucide-react';
import type { BlogPost } from '../../../lib/blogData';

interface BlogSearchProps {
  posts: BlogPost[];
  categories: string[];
}

const dateFormatter = new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium' });

export function BlogSearch({ posts, categories }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Sort posts by date (newest first) and filter
  const filteredPosts = useMemo(() => {
    // First sort by date
    const sorted = [...posts].sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    // Then filter
    return sorted.filter((post) => {
      // Category filter
      if (selectedCategory && post.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesExcerpt = post.excerpt.toLowerCase().includes(query);
        const matchesTags = post.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesKeywords = post.keywords.some((keyword) =>
          keyword.toLowerCase().includes(query),
        );
        const matchesCategory = post.category.toLowerCase().includes(query);

        return matchesTitle || matchesExcerpt || matchesTags || matchesKeywords || matchesCategory;
      }

      return true;
    });
  }, [posts, searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const hasActiveFilters = searchQuery || selectedCategory;

  return (
    <section aria-labelledby="all-articles" className="space-y-8">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-700">
            Alle Artikel
          </p>
          <h2 id="all-articles" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
            Durchsuche unsere Beiträge
          </h2>
        </div>

        {/* Search and Filter Controls */}
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Suche nach Titel, Thema oder Stichwort..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-white py-4 pl-12 pr-4 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              aria-label="Blog durchsuchen"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                aria-label="Suche löschen"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle for Mobile */}
          <div className="flex items-center justify-between sm:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900"
            >
              <Filter className="h-4 w-4" />
              Filter {selectedCategory && '(1)'}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-neutral-500 hover:text-neutral-700"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className={`${showFilters ? 'block' : 'hidden'} space-y-3 sm:block`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-700">Nach Kategorie filtern:</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="hidden text-sm font-medium text-neutral-500 hover:text-neutral-700 sm:block"
                >
                  Filter zurücksetzen
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === null
                    ? 'bg-primary-900 text-white shadow-md'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:text-primary-900'
                }`}
              >
                Alle
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === category ? null : category)
                  }
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedCategory === category
                      ? 'bg-primary-900 text-white shadow-md'
                      : 'border border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:text-primary-900'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <p className="text-sm text-neutral-600">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'Artikel' : 'Artikel'} gefunden
          {hasActiveFilters && (
            <span className="ml-1 text-primary-700">
              {selectedCategory && ` in "${selectedCategory}"`}
              {searchQuery && ` für "${searchQuery}"`}
            </span>
          )}
        </p>
        <p className="text-sm text-neutral-500">Sortiert nach: Neueste zuerst</p>
      </div>

      {/* Results Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex h-full flex-col justify-between rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-lg shadow-primary-900/10 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-neutral-500">
                  <span className="rounded-full bg-primary-50 px-3 py-1 text-primary-900">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" aria-hidden />
                    {dateFormatter.format(new Date(post.publishedAt))}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {post.readingTime}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition group-hover:text-primary-700"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm leading-relaxed text-muted">{post.excerpt}</p>
              </div>
              <div className="mt-6 border-t border-neutral-100 pt-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900"
                >
                  Weiterlesen
                  <ArrowRight
                    className="h-4 w-4 transition group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-neutral-200 bg-white/90 p-12 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <Search className="h-8 w-8 text-neutral-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900">Keine Artikel gefunden</h3>
          <p className="mt-2 text-sm text-neutral-600">
            Versuche andere Suchbegriffe oder setze die Filter zurück.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5"
          >
            Filter zurücksetzen
          </button>
        </div>
      )}
    </section>
  );
}
