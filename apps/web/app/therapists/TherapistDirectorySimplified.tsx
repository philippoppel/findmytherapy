'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Sparkles, MapPin, LocateFixed, BookOpen, ChevronRight } from 'lucide-react';
import type { TherapistCard } from './types';
import { UnifiedTherapistSearch } from '../components/therapist-search/UnifiedTherapistSearch';
import { blogPosts, type BlogPost } from '@/lib/blogData';

// Keywords für Blog-Suche passend zu Therapeut:innen-Fokus
const FOCUS_BLOG_KEYWORDS: Record<string, string[]> = {
  angst: ['Angst', 'Panik', 'Angststörung', 'Panikattacken', 'Phobien', 'Furcht'],
  depression: ['Depression', 'depressiv', 'Niedergeschlagenheit', 'Antriebslosigkeit', 'Traurigkeit'],
  stress: ['Stress', 'Burnout', 'Erschöpfung', 'Überlastung', 'Work-Life'],
  trauma: ['Trauma', 'PTBS', 'traumatisch', 'Belastung', 'PTSD'],
  beziehung: ['Beziehung', 'Partnerschaft', 'Paar', 'Kommunikation', 'Trennung', 'Liebe'],
  selbstwert: ['Selbstwert', 'Selbstbewusstsein', 'Selbstliebe', 'Selbstfürsorge'],
  trauer: ['Trauer', 'Verlust', 'Tod', 'Abschied'],
  sucht: ['Sucht', 'Abhängigkeit', 'Alkohol', 'Drogen'],
  essstoerung: ['Essstörung', 'Anorexie', 'Bulimie', 'Essen', 'Magersucht'],
  schlaf: ['Schlaf', 'Insomnie', 'Entspannung', 'Ruhe', 'Schlafstörung'],
  zwang: ['Zwang', 'OCD', 'Zwangsgedanken', 'Rituale', 'Zwangsstörung'],
  adhs: ['ADHS', 'ADS', 'Aufmerksamkeit', 'Konzentration', 'Hyperaktivität'],
  arbeit: ['Arbeit', 'Beruf', 'Karriere', 'Mobbing', 'Arbeitsplatz'],
  achtsamkeit: ['Achtsamkeit', 'Meditation', 'Mindfulness', 'Entspannung'],
  panik: ['Panik', 'Panikattacken', 'Angst'],
  psychosomatik: ['Psychosomatik', 'psychosomatisch', 'Körper', 'Schmerzen'],
};

// Helper: Get blog posts based on therapist focus areas
function getBlogPostsForFocusAreas(focusAreas: string[], limit: number = 3): BlogPost[] {
  if (focusAreas.length === 0) return [];

  // Collect keywords from focus areas
  const allKeywords: string[] = [];
  focusAreas.forEach(focus => {
    const normalizedFocus = focus.toLowerCase();
    Object.entries(FOCUS_BLOG_KEYWORDS).forEach(([key, keywords]) => {
      if (normalizedFocus.includes(key) || keywords.some(kw => normalizedFocus.includes(kw.toLowerCase()))) {
        allKeywords.push(...keywords);
      }
    });
  });

  if (allKeywords.length === 0) return [];

  // Score blog posts
  const scoredPosts = blogPosts.map(post => {
    let score = 0;
    const searchText = `${post.title} ${post.excerpt} ${post.tags.join(' ')} ${post.keywords.join(' ')}`.toLowerCase();

    allKeywords.forEach(keyword => {
      if (searchText.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });

    // Add random factor for variety
    const randomFactor = Math.random() * 0.5;
    return { post, score: score + randomFactor };
  });

  return scoredPosts
    .filter(item => item.score > 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

// Utility function to merge classNames
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const INITIAL_VISIBLE_COUNT = 12;
const LOAD_MORE_COUNT = 12;

const statusLabel: Record<TherapistCard['status'], string> = {
  VERIFIED: 'Verifiziert',
  PENDING: 'In Prüfung',
  DRAFT: 'Entwurf',
};

const gradients = [
  'from-blue-600 to-cyan-600',
  'from-purple-600 to-pink-600',
  'from-green-600 to-teal-600',
  'from-orange-600 to-amber-600',
  'from-red-600 to-rose-600',
  'from-indigo-600 to-purple-600',
];

function getGradientClass(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export type TherapistDirectoryProps = {
  therapists: TherapistCard[];
};

export function TherapistDirectory({ therapists }: TherapistDirectoryProps) {
  const [filteredTherapists, setFilteredTherapists] = useState<TherapistCard[]>(therapists);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  // Reset visible count when filtered results change
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [filteredTherapists.length]);

  const visibleTherapists = filteredTherapists.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTherapists.length;

  // Get relevant blog posts based on filtered therapists' focus areas
  const relevantBlogPosts = useMemo(() => {
    const allFocusAreas = filteredTherapists.flatMap(t => t.focus);
    return getBlogPostsForFocusAreas(allFocusAreas, 4);
  }, [filteredTherapists]);

  return (
    <div className="w-full">
      {/* Unified Search & Filters */}
      <UnifiedTherapistSearch
        therapists={therapists}
        onFilteredResults={setFilteredTherapists}
        className="mb-8"
      />

      {/* Results */}
      {filteredTherapists.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
          <div className="mx-auto max-w-md space-y-4">
            <p className="text-base text-white/90 font-medium">Keine passenden Profile gefunden</p>
            <p className="text-sm text-white/70">
              Passe die Filter an oder beantworte ein paar kurze Fragen, um
              personalisierte Empfehlungen zu erhalten.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl"
              >
                <Sparkles className="h-4 w-4" />
                Quiz starten
              </Link>
              <button
                onClick={() => setFilteredTherapists(therapists)}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/15"
              >
                Filter zurücksetzen
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Therapist Grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
            {visibleTherapists.map((therapist, index) => {
              const showBanner = index === 5 && visibleTherapists.length > 6;
              const showBlogPosts = index === 9 && visibleTherapists.length > 10 && relevantBlogPosts.length > 0;

              return (
                <React.Fragment key={therapist.id}>
                  <DirectoryCard therapist={therapist} />

                  {/* Contextual CTA Banner after 6 therapists */}
                  {showBanner && (
                    <div className="col-span-full my-6">
                      <div className="relative overflow-hidden rounded-3xl border border-primary-400/20 bg-gradient-to-br from-primary-600/20 via-primary-500/10 to-secondary-500/15 shadow-2xl">
                        <div className="flex flex-col lg:flex-row">
                          {/* Image Section */}
                          <div className="relative h-48 w-full lg:h-auto lg:w-1/3">
                            <Image
                              src="/images/therapists/therapy-1.jpg"
                              alt="Therapiegespräch"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary-950/90 lg:bg-gradient-to-r" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-transparent to-transparent lg:hidden" />
                          </div>

                          {/* Content Section */}
                          <div className="relative flex flex-1 flex-col justify-center p-6 sm:p-8 lg:p-10">
                            {/* Background decoration */}
                            <div className="pointer-events-none absolute inset-0 opacity-40">
                              <div className="absolute -right-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-primary-400/30 blur-3xl" />
                              <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-secondary-400/30 blur-3xl" />
                            </div>

                            <div className="relative space-y-4">
                              {/* Badge */}
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-primary-200 backdrop-blur-sm">
                                <Sparkles className="h-3.5 w-3.5" />
                                Personalisiert für dich
                              </span>

                              {/* Title & Description */}
                              <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                                  Zu viele Optionen?
                                </h3>
                                <p className="max-w-lg text-base text-white/80 sm:text-lg">
                                  Beantworte ein paar Fragen und erhalte personalisierte Empfehlungen
                                  mit Passungs-Scores – abgestimmt auf deine Bedürfnisse.
                                </p>
                              </div>

                              {/* Features */}
                              <div className="flex flex-wrap gap-3 pt-2">
                                <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                                  2 Minuten
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                                  Wissenschaftlich fundiert
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                                  100% kostenlos
                                </span>
                              </div>

                              {/* CTA Button */}
                              <div className="pt-4">
                                <Link
                                  href="/quiz"
                                  className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-500/30 transition-all hover:from-primary-400 hover:to-primary-500 hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
                                >
                                  <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                                  Quiz starten
                                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Blog Posts Section after 10 therapists */}
                  {showBlogPosts && (
                    <div className="col-span-full my-4">
                      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
                        <div className="mb-5 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">Passende Artikel für dich</h3>
                            <p className="text-sm text-white/60">Mehr zum Thema erfahren</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          {relevantBlogPosts.map((post) => (
                            <Link
                              key={post.slug}
                              href={`/blog/${post.slug}`}
                              className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all hover:border-white/20 hover:bg-white/10"
                            >
                              <div className="relative aspect-[16/9] overflow-hidden">
                                <Image
                                  src={post.featuredImage.src}
                                  alt={post.featuredImage.alt}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <div className="flex flex-1 flex-col p-4">
                                <p className="line-clamp-2 text-sm font-medium text-white">{post.title}</p>
                                <div className="mt-auto flex items-center gap-1 pt-2 text-xs text-white/50">
                                  <span>{post.readingTime}</span>
                                  <ChevronRight className="h-3 w-3" />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
                className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/15 active:scale-98"
              >
                Mehr laden ({filteredTherapists.length - visibleCount} weitere)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DirectoryCard({ therapist }: { therapist: TherapistCard }) {
  const gradientClass = getGradientClass(therapist.id);
  const primaryFocus = therapist.focus.slice(0, 3);
  const distance =
    typeof therapist.distanceInKm === 'number'
      ? `${Math.max(1, Math.round(therapist.distanceInKm))} km`
      : null;

  return (
    <Link href={`/therapists/${therapist.id}`} prefetch={false} className="group">
      <article className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1 sm:min-h-[450px] sm:rounded-3xl">
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-neutral-900 to-black">
          {therapist.image ? (
            <Image
              src={therapist.image}
              alt={`Profilbild von ${therapist.name}${therapist.focus[0] ? `, spezialisiert auf ${therapist.focus[0]}` : ''}`}
              fill
              className="object-cover object-center brightness-[0.95] contrast-[1.05] transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
              quality={75}
            />
          ) : (
            <div
              className={cn(
                'relative flex h-full w-full items-center justify-center',
                gradientClass,
                'bg-gradient-to-br',
              )}
            >
              {/* Decorative background */}
              <div className="absolute inset-0 opacity-20" aria-hidden>
                <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white blur-3xl" />
                <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-white/50 blur-2xl" />
              </div>
              {/* Initials */}
              <div className="relative flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-white sm:text-6xl md:text-7xl">
                  {therapist.initials}
                </span>
                <span className="mt-1 text-xs font-medium uppercase tracking-wider text-white/70 sm:text-sm">
                  Therapeut:in
                </span>
              </div>
            </div>
          )}

          {/* Status Badge - Top Left */}
          <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-lg backdrop-blur-sm sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs',
                therapist.status === 'VERIFIED'
                  ? 'border-emerald-400/60 bg-emerald-500/30 text-emerald-100'
                  : therapist.status === 'PENDING'
                    ? 'border-amber-400/60 bg-amber-500/30 text-amber-100'
                    : 'border-red-400/60 bg-red-500/30 text-red-100',
              )}
            >
              <ShieldCheck className="h-3 w-3 flex-shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
              <span className="hidden sm:inline">{statusLabel[therapist.status]}</span>
            </span>
          </div>

          {/* Distance Badge - Top Right */}
          {distance && (
            <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
              <span className="inline-flex items-center gap-1 rounded-lg border border-primary-400/60 bg-primary-500/30 px-2 py-1 text-[10px] font-semibold text-primary-100 shadow-lg backdrop-blur-sm sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs">
                <LocateFixed className="h-3 w-3 flex-shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
                <span className="whitespace-nowrap">{distance}</span>
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5 lg:p-6">
          {/* Header */}
          <div className="space-y-1.5">
            <h3 className="line-clamp-2 text-base font-bold leading-tight text-white sm:text-lg lg:text-xl">
              {therapist.name}
            </h3>
            <p className="line-clamp-2 text-xs text-white/70 sm:text-sm">{therapist.title}</p>
          </div>

          {/* Experience Badge */}
          <div className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/90 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm">
            <Sparkles
              className="h-3.5 w-3.5 flex-shrink-0 text-primary-400 sm:h-4 sm:w-4"
              aria-hidden
            />
            <span className="line-clamp-1">{therapist.experience}</span>
          </div>

          {/* Quick Info */}
          <div className="flex items-start gap-2">
            <MapPin
              className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary-400 sm:h-4 sm:w-4"
              aria-hidden
            />
            <span className="line-clamp-2 text-xs text-white/80 sm:text-sm">
              {therapist.location}
            </span>
          </div>

          {/* Focus Areas */}
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Schwerpunkte
            </p>
            <div className="flex flex-wrap gap-1.5">
              {primaryFocus.map((focus, index) => (
                <span
                  key={index}
                  className="inline-block max-w-full truncate rounded-lg border border-primary-400/30 bg-primary-500/10 px-2 py-1 text-xs font-medium leading-tight text-primary-200"
                  title={focus}
                >
                  {focus}
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mt-auto border-t border-white/10 pt-3">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-white/60">Verfügbarkeit</span>
              <span
                className={cn(
                  'truncate text-right font-semibold',
                  therapist.availabilityRank <= 2
                    ? 'text-emerald-400'
                    : therapist.availabilityRank <= 4
                      ? 'text-amber-400'
                      : 'text-red-400',
                )}
              >
                {therapist.availability}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
