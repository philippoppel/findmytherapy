'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Calendar, Clock, ArrowRight, Sparkles, Heart, Brain, MessageCircle, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { blogPosts } from '../../lib/blogData';
import { NewsletterForm } from '@/app/components/forms/NewsletterForm';
import { Reveal } from '@/app/components/marketing/Reveal';
import { useUserPreferences, getKeywordsForTopics } from '@/hooks/useUserPreferences';

// Sort blog posts by date (newest first)
const sortedBlogPosts = [...blogPosts].sort((a, b) => {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
});

const categories = Array.from(new Set(blogPosts.map((post) => post.category)));
const categoryToSlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-');
const dateFormatter = new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium' });

// Category emojis for YouTube-style sections
const CATEGORY_EMOJIS: Record<string, string> = {
  'Angst & Panik': '😰',
  'Depression & Stimmung': '💭',
  'Stress & Burnout': '🔥',
  'Therapie verstehen': '📚',
  'Therapeut:in finden': '🔍',
  'Selbsthilfe & Alltag': '🌱',
  'Arbeit & Karriere': '💼',
  'Kosten & Finanzierung': '💰',
  'Wissen & Fakten': '📊',
  'Über FindMyTherapy': '✨',
};

// Horizontal scroll section component
function HorizontalScrollSection({
  title,
  emoji,
  posts,
  categorySlug,
  showAllLink = true
}: {
  title: string;
  emoji?: string;
  posts: typeof blogPosts;
  categorySlug?: string;
  showAllLink?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => ref.removeEventListener('scroll', updateScrollButtons);
    }
  }, [posts]);

  if (posts.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-default flex items-center gap-2">
          {emoji && <span>{emoji}</span>}
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {/* Scroll buttons - hidden on mobile */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full transition-all ${
                canScrollLeft
                  ? 'bg-primary-100 hover:bg-primary-200 text-primary-700'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full transition-all ${
                canScrollRight
                  ? 'bg-primary-100 hover:bg-primary-200 text-primary-700'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          {showAllLink && categorySlug && (
            <Link
              href={`/blog/category/${categorySlug}`}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition flex items-center gap-1"
            >
              Alle anzeigen
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
      >
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex-shrink-0 w-72 sm:w-80 bg-surface rounded-2xl border border-primary-100/60 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 snap-start group"
          >
            <div className="relative aspect-[16/10]">
              {post.featuredImage?.src ? (
                <Image
                  src={post.featuredImage.src}
                  alt={post.featuredImage.alt || post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                {post.readingTime}
              </span>
            </div>
            <div className="p-4">
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                {post.category}
              </span>
              <h3 className="font-semibold text-default mt-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted mt-2 line-clamp-2">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

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

// Helper: Get personalized recommendations
function getPersonalizedPosts(topics: string[], limit: number = 6) {
  if (!topics.length) return [];

  const keywords = getKeywordsForTopics(topics);
  if (!keywords.length) return [];

  const scoredPosts = sortedBlogPosts.map(post => {
    let score = 0;
    const searchText = `${post.title} ${post.excerpt} ${post.tags.join(' ')} ${post.keywords.join(' ')}`.toLowerCase();

    keywords.forEach(keyword => {
      if (searchText.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });

    return { post, score };
  });

  return scoredPosts
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { preferences, isLoaded, getRecommendedTopics, hasPreferences } = useUserPreferences();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get personalized recommendations
  const personalizedPosts = useMemo(() => {
    if (!isLoaded || !hasPreferences()) return [];
    const topics = getRecommendedTopics();
    return getPersonalizedPosts(topics, 6);
  }, [isLoaded, hasPreferences, getRecommendedTopics]);

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

  const [featuredPost] = filteredPosts;

  // Get topic labels for display
  const topicLabels = useMemo(() => {
    if (!preferences) return [];
    const topics = getRecommendedTopics();
    return topics.map(topic => {
      // Find the label in TOPIC_KEYWORDS keys and return a readable format
      const labels: Record<string, string> = {
        angst: 'Angst & Sorgen',
        depression: 'Stimmung & Antrieb',
        stress: 'Stress & Burnout',
        trauma: 'Belastende Erfahrungen',
        beziehung: 'Beziehungen',
        selbstwert: 'Selbstwert',
      };
      return labels[topic] || topic;
    });
  }, [preferences, getRecommendedTopics]);

  return (
    <div className="marketing-theme min-h-screen bg-surface text-default overflow-x-hidden">
      {/* Ambient Blur Background - same as Landing Page */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          aria-hidden
          className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-secondary-200/30 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute bottom-20 left-1/4 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl"
        />
        {/* Additional ambient elements for longer pages */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[60%] h-72 w-72 rounded-full bg-secondary-100/40 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -right-20 top-[80%] h-80 w-80 rounded-full bg-primary-200/30 blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <header className="relative pt-8 pb-12 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 transition mb-8"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              <span className="font-medium">Zurück zur Startseite</span>
            </Link>
          </Reveal>

          <div className="text-center max-w-3xl mx-auto">
            <Reveal delay={80}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 border border-primary-200/50 text-primary-700 text-sm font-medium mb-6">
                <BookOpen className="w-4 h-4" />
                Wissen & Unterstützung
              </div>
            </Reveal>

            <Reveal delay={160}>
              <h1 className="text-balance text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight tracking-tight text-default mb-4">
                Deine mentale Gesundheit verstehen
              </h1>
            </Reveal>

            <Reveal delay={240}>
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-muted mb-8 max-w-2xl mx-auto">
                Fundiertes Wissen, einfühlsame Texte und praktische Tipps –
                damit du dich selbst besser verstehst und den Weg zu mehr Wohlbefinden findest.
              </p>
            </Reveal>

            <Reveal delay={320}>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  placeholder="Artikel durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-divider bg-surface/90 backdrop-blur-sm py-4 pl-14 pr-12 text-base text-default placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 shadow-lg shadow-primary-900/5 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-default transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        {/* Personalized Recommendations - Highlighted Section */}
        {mounted && personalizedPosts.length > 0 && (
          <Reveal>
            <section className="mb-10 rounded-3xl bg-gradient-to-br from-primary-100/80 via-primary-50/60 to-secondary-50/40 p-6 sm:p-8 border border-primary-200/60">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  <h2 className="text-xl font-bold text-default">Für dich empfohlen</h2>
                </div>
                {topicLabels.length > 0 && (
                  <p className="hidden sm:block text-sm text-muted">
                    Basierend auf: {topicLabels.slice(0, 2).join(', ')}
                  </p>
                )}
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 snap-x snap-mandatory scrollbar-hide">
                {personalizedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl border border-primary-100/60 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 snap-start group"
                  >
                    <div className="relative aspect-[16/10]">
                      {post.featuredImage?.src ? (
                        <Image
                          src={post.featuredImage.src}
                          alt={post.featuredImage.alt || post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                        {post.readingTime}
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                      <h3 className="font-semibold text-default mt-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted mt-2 line-clamp-2">{post.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* Compact Search Filter - Only shows when searching */}
        {searchQuery && (
          <Reveal>
            <div className="mb-6 flex items-center gap-3 flex-wrap">
              <span className="text-sm text-muted">{filteredPosts.length} Ergebnisse für</span>
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                &quot;{searchQuery}&quot;
                <button onClick={() => setSearchQuery('')} className="hover:text-primary-900">
                  <X className="w-4 h-4" />
                </button>
              </span>
            </div>
          </Reveal>
        )}


        {filteredPosts.length === 0 ? (
          /* No Results */
          <Reveal>
            <div className="py-20 text-center bg-surface/60 backdrop-blur-sm rounded-3xl border border-primary-100">
              <Search className="mx-auto mb-4 h-12 w-12 text-primary-300" />
              <h2 className="text-xl font-semibold text-default">Keine Artikel gefunden</h2>
              <p className="mt-2 text-muted">Versuche andere Suchbegriffe oder Kategorien.</p>
              <button
                onClick={clearFilters}
                className="mt-6 rounded-full bg-primary-600 px-8 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition shadow-lg shadow-primary-600/25"
              >
                Alle Artikel anzeigen
              </button>
            </div>
          </Reveal>
        ) : (
          <>
            {/* HERO Featured Article - Large & Emotional */}
            {featuredPost && (
              <Reveal variant="scale">
                <article className="group mb-12">
                  <Link href={`/blog/${featuredPost.slug}`} className="block">
                    <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-3xl bg-primary-200 shadow-2xl">
                      {featuredPost.featuredImage?.src ? (
                        <Image
                          src={featuredPost.featuredImage.src}
                          alt={featuredPost.featuredImage.alt || featuredPost.title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-105"
                          priority
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500" />
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="inline-block rounded-full bg-primary-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                            {CATEGORY_EMOJIS[featuredPost.category] || '📝'} {featuredPost.category}
                          </span>
                          <span className="text-white/60 text-sm">Empfohlen</span>
                        </div>
                        <h2 className="mb-4 text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white break-words max-w-4xl">
                          {featuredPost.title}
                        </h2>
                        <p className="mb-6 hidden max-w-2xl text-base text-white/80 sm:block lg:text-lg leading-relaxed">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                          <button className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-full hover:bg-primary-50 transition-colors shadow-lg group-hover:shadow-xl">
                            Jetzt lesen →
                          </button>
                          <div className="flex items-center gap-4 text-sm text-white/70">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              {dateFormatter.format(new Date(featuredPost.publishedAt))}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {featuredPost.readingTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              </Reveal>
            )}

            {/* Neueste Blogs Section */}
            <Reveal>
              <HorizontalScrollSection
                title="Neueste Artikel"
                emoji="🕐"
                posts={sortedBlogPosts.slice(1, 7)}
                showAllLink={false}
              />
            </Reveal>

            {/* Category Sections - YouTube Style */}
            {categories.map((category) => {
              const categoryPosts = sortedBlogPosts.filter(p => p.category === category);
              if (categoryPosts.length < 2) return null;

              return (
                <Reveal key={category}>
                  <HorizontalScrollSection
                    title={category}
                    emoji={CATEGORY_EMOJIS[category]}
                    posts={categoryPosts}
                    categorySlug={categoryToSlug(category)}
                  />
                </Reveal>
              );
            })}

            {/* All Categories Overview */}
            <Reveal>
              <section className="mb-12 rounded-3xl bg-gradient-to-br from-primary-50/80 via-white to-secondary-50/50 backdrop-blur-sm p-6 sm:p-8 border border-primary-100 shadow-sm overflow-hidden">
                <h2 className="mb-5 text-xl font-bold text-default flex items-center gap-2">
                  <span>📂</span> Alle Kategorien
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categories.map((category) => {
                    const count = blogPosts.filter((p) => p.category === category).length;
                    return (
                      <Link
                        key={category}
                        href={`/blog/category/${categoryToSlug(category)}`}
                        className="group flex items-center gap-3 rounded-2xl border border-primary-200/60 bg-white/80 p-4 transition-all hover:border-primary-400 hover:bg-white hover:shadow-lg hover:-translate-y-1"
                      >
                        <span className="text-2xl">{CATEGORY_EMOJIS[category] || '📝'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-default text-sm truncate group-hover:text-primary-700 transition-colors">{category}</p>
                          <p className="text-xs text-muted">{count} Artikel</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            </Reveal>
          </>
        )}

        {/* Tool Promotion CTA */}
        <Reveal>
          <section className="mb-12 rounded-3xl bg-surface/70 backdrop-blur-md p-8 sm:p-10 border border-primary-100 shadow-xl overflow-hidden relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-100/50 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary-100/50 rounded-full blur-3xl" />

            <div className="relative text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 border border-primary-200/50 text-primary-700 text-sm font-medium mb-4">
                <Heart className="w-4 h-4" />
                Noch unsicher?
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-default mb-3">
                Finde die passende Unterstützung
              </h2>
              <p className="text-muted max-w-xl mx-auto">
                Unsere Tools helfen dir dabei, deinen individuellen Weg zu mehr Wohlbefinden zu finden.
              </p>
            </div>

            <div className="relative grid gap-4 sm:grid-cols-3">
              <Link
                href="/quiz"
                className="group flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-white border border-primary-200/50 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-semibold text-default mb-2">Schnell-Quiz</h3>
                <p className="text-sm text-muted">6 Fragen – passende Therapeut:innen in 2 Minuten</p>
              </Link>

              <Link
                href="/therapists"
                className="group flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br from-secondary-50 to-white border border-secondary-200/50 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-secondary-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7 text-secondary-600" />
                </div>
                <h3 className="font-semibold text-default mb-2">Therapeut:innen finden</h3>
                <p className="text-sm text-muted">Durchsuche unser Netzwerk nach deinen Kriterien</p>
              </Link>

              <Link
                href="/triage"
                className="group flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-white border border-primary-200/50 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-semibold text-default mb-2">Ersteinschätzung</h3>
                <p className="text-sm text-muted">Wissenschaftlich fundierte Selbsteinschätzung</p>
              </Link>
            </div>
          </section>
        </Reveal>

        {/* Newsletter */}
        <Reveal>
          <section className="rounded-3xl bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 p-8 text-white sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-surface/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500/10 rounded-full blur-3xl" />

            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Newsletter abonnieren</h2>
              <p className="mt-3 text-primary-100 leading-relaxed">
                Erhalte neue Artikel und Tipps zu mentaler Gesundheit direkt in deinen Posteingang.
              </p>
              <div className="mt-8">
                <NewsletterForm variant="newsletter" className="mx-auto max-w-md" />
              </div>
            </div>
          </section>
        </Reveal>
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
