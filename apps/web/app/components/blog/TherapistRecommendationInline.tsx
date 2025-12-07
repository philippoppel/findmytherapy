'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, MapPin, Clock, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface RecommendedTherapist {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  approach: string;
  city: string | null;
  online: boolean;
  image: string | null;
  availabilityStatus: string | null;
  estimatedWaitWeeks: number | null;
  rating: number;
  reviewCount: number;
}

interface TherapistRecommendationInlineProps {
  tags: string[];
  limit?: number;
  title?: string;
  subtitle?: string;
}

export function TherapistRecommendationInline({
  tags,
  limit = 3,
  title,
  subtitle,
}: TherapistRecommendationInlineProps) {
  const { t } = useTranslation();
  const [therapists, setTherapists] = useState<RecommendedTherapist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAvailabilityLabel = (status: string | null, weeks: number | null): string => {
    if (status === 'AVAILABLE' || weeks === 0) return t('therapistRecommendation.availableNow');
    if (weeks === 1) return t('therapistRecommendation.inAboutWeek');
    if (weeks && weeks <= 4) return t('therapistRecommendation.inAboutWeeks', { weeks });
    if (status === 'LIMITED') return t('therapistRecommendation.limitedSpots');
    if (status === 'WAITLIST') return t('therapistRecommendation.waitlist');
    return t('therapistRecommendation.requestAvailability');
  };

  const getLocationLabel = (city: string | null, online: boolean): string => {
    if (!city && online) return t('therapistRecommendation.online');
    if (!city) return t('therapistRecommendation.onSite');
    if (online) return t('therapistRecommendation.cityOnline', { city });
    return city;
  };

  useEffect(() => {
    async function fetchTherapists() {
      if (!tags.length) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/blog/recommended-therapists?tags=${encodeURIComponent(tags.join(','))}&limit=${limit}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const data = await response.json();
        setTherapists(data.therapists || []);
      } catch (err) {
        console.error('Error fetching therapists:', err);
        setError(t('therapistRecommendation.couldNotLoad'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchTherapists();
  }, [tags, limit, t]);

  if (!tags.length || error) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="my-8 rounded-2xl bg-primary-50/50 border border-primary-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-primary-100 rounded w-2/3" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4">
                <div className="h-24 bg-primary-100/50 rounded-lg mb-3" />
                <div className="h-4 bg-primary-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-primary-50 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (therapists.length === 0) {
    return null;
  }

  const displayTitle = title || t('therapistRecommendation.matchingTherapists');

  return (
    <section className="my-10 rounded-3xl bg-gradient-to-br from-primary-50/80 via-white to-secondary-50/50 border border-primary-100/60 p-6 sm:p-8 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-bold text-primary-900">{displayTitle}</h3>
          </div>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
        <Link
          href="/therapists"
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition"
        >
          {t('therapistRecommendation.showAll')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {therapists.map((therapist) => (
          <Link
            key={therapist.id}
            href={`/therapists/${therapist.id}`}
            className="group bg-white rounded-2xl border border-primary-100/60 p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-primary-100 flex-shrink-0">
                {therapist.image ? (
                  <Image
                    src={therapist.image}
                    alt={therapist.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-400" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-primary-900 truncate group-hover:text-primary-600 transition-colors">
                  {therapist.name}
                </h4>
                <p className="text-xs text-muted truncate">{therapist.title}</p>
              </div>
            </div>

            {therapist.specialties.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {therapist.specialties.slice(0, 2).map((specialty, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
                {therapist.specialties.length > 2 && (
                  <span className="text-xs text-muted">+{therapist.specialties.length - 2}</span>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {getLocationLabel(therapist.city, therapist.online)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {getAvailabilityLabel(therapist.availabilityStatus, therapist.estimatedWaitWeeks)}
              </span>
            </div>

            {therapist.rating > 0 && (
              <div className="flex items-center gap-1 mt-2 text-xs">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-medium text-primary-900">{therapist.rating.toFixed(1)}</span>
                {therapist.reviewCount > 0 && (
                  <span className="text-muted">({therapist.reviewCount})</span>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>

      <Link
        href="/therapists"
        className="sm:hidden mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition"
      >
        {t('therapistRecommendation.showAllTherapists')}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}

interface TherapistRecommendationSidebarProps {
  tags: string[];
  limit?: number;
}

export function TherapistRecommendationSidebar({
  tags,
  limit = 3,
}: TherapistRecommendationSidebarProps) {
  const { t } = useTranslation();
  const [therapists, setTherapists] = useState<RecommendedTherapist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTherapists() {
      if (!tags.length) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/blog/recommended-therapists?tags=${encodeURIComponent(tags.join(','))}&limit=${limit}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const data = await response.json();
        setTherapists(data.therapists || []);
      } catch (err) {
        console.error('Error fetching therapists:', err);
        setError(t('therapistRecommendation.couldNotLoad'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchTherapists();
  }, [tags, limit, t]);

  if (!tags.length || error || (!isLoading && therapists.length === 0)) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-primary-50/50 rounded-xl">
            <div className="w-10 h-10 bg-primary-100 rounded-full" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-primary-100 rounded w-3/4" />
              <div className="h-2 bg-primary-50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {therapists.map((therapist) => (
        <Link
          key={therapist.id}
          href={`/therapists/${therapist.id}`}
          className="group flex items-center gap-3 p-3 rounded-xl bg-white border border-primary-100/60 hover:border-primary-200 hover:shadow-sm transition-all"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary-100 flex-shrink-0">
            {therapist.image ? (
              <Image src={therapist.image} alt={therapist.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary-900 truncate group-hover:text-primary-600 transition-colors">
              {therapist.name}
            </p>
            <p className="text-xs text-muted truncate">
              {therapist.city || t('therapistRecommendation.online')} ·{' '}
              {therapist.specialties[0] || therapist.title}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-primary-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </Link>
      ))}
      <Link
        href="/therapists"
        className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition"
      >
        {t('therapistRecommendation.showAll')}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
