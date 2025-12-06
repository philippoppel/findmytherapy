'use client';

import { X, Star, MapPin, Globe, Clock } from 'lucide-react';
import { Button } from '@mental-health/ui';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';

type TherapistRecommendation = {
  id: string;
  name: string;
  title: string;
  headline?: string;
  focus: string[];
  availability: string;
  location: string;
  rating: number;
  reviews: number;
  formatTags: Array<'online' | 'praesenz' | 'hybrid'>;
  services?: string[];
  responseTime?: string;
  yearsExperience?: number;
  languages?: string[];
  image?: string | null;
};

type TherapistComparisonProps = {
  therapists: TherapistRecommendation[];
  onClose: () => void;
};

export function TherapistComparison({ therapists, onClose }: TherapistComparisonProps) {
  const { t } = useTranslation();

  if (therapists.length === 0) return null;

  const getFormatLabel = (tag: 'online' | 'praesenz' | 'hybrid') => {
    switch (tag) {
      case 'online':
        return t('therapistComparison.online');
      case 'praesenz':
        return t('therapistComparison.inPerson');
      case 'hybrid':
        return t('therapistComparison.hybrid');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-6xl overflow-auto rounded-3xl border border-divider bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-divider bg-white/95 px-6 py-4 backdrop-blur">
          <div>
            <h2 className="text-xl font-bold text-default">{t('therapistComparison.title')}</h2>
            <p className="text-sm text-muted">
              {t('therapistComparison.therapistsInComparison', { count: therapists.length.toString() })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-surface-1"
            aria-label={t('common.close')}
          >
            <X className="h-5 w-5 text-muted" aria-hidden />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-divider bg-surface-1">
              <tr>
                <th className="sticky left-0 z-10 bg-surface-1 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  {t('therapistComparison.criterion')}
                </th>
                {therapists.map((therapist) => (
                  <th key={therapist.id} className="min-w-[250px] px-4 py-3">
                    <div className="space-y-2">
                      <div className="mx-auto h-20 w-20 overflow-hidden rounded-2xl border border-divider bg-surface-1">
                        {therapist.image ? (
                          <Image
                            src={therapist.image}
                            alt={therapist.name}
                            width={160}
                            height={160}
                            className="h-full w-full object-cover object-center"
                            sizes="80px"
                            quality={90}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                            <Globe className="h-8 w-8 text-primary/60" />
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-default">{therapist.name}</div>
                      <div className="text-xs text-muted">{therapist.title}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {/* Rating */}
              <tr>
                <td className="sticky left-0 z-10 bg-white px-4 py-4 text-sm font-medium text-default">
                  {t('therapistComparison.rating')}
                </td>
                {therapists.map((therapist) => (
                  <td key={therapist.id} className="px-4 py-4 text-center">
                    {therapist.rating > 0 ? (
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-default">
                          {therapist.rating.toFixed(1)}
                        </span>
                        {therapist.reviews > 0 && (
                          <span className="text-xs text-muted">({therapist.reviews})</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted">{t('therapistComparison.noRatingsYet')}</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Experience */}
              <tr>
                <td className="sticky left-0 z-10 bg-white px-4 py-4 text-sm font-medium text-default">
                  {t('therapistComparison.experience')}
                </td>
                {therapists.map((therapist) => (
                  <td key={therapist.id} className="px-4 py-4 text-center">
                    <span className="text-sm text-default">
                      {therapist.yearsExperience ? `${therapist.yearsExperience} ${t('common.years')}` : '—'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Specialties */}
              <tr>
                <td className="sticky left-0 z-10 bg-white px-4 py-4 text-sm font-medium text-default">
                  {t('therapistComparison.specialties')}
                </td>
                {therapists.map((therapist) => (
                  <td key={therapist.id} className="px-4 py-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {therapist.focus.slice(0, 4).map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-divider bg-surface-1 px-2 py-1 text-xs text-default"
                        >
                          {item}
                        </span>
                      ))}
                      {therapist.focus.length > 4 && (
                        <span className="text-xs text-muted">
                          +{therapist.focus.length - 4} {t('common.more')}
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Format */}
              <tr>
                <td className="sticky left-0 z-10 bg-white px-4 py-4 text-sm font-medium text-default">
                  {t('therapistComparison.format')}
                </td>
                {therapists.map((therapist) => (
                  <td key={therapist.id} className="px-4 py-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {therapist.formatTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800"
                        >
                          {getFormatLabel(tag)}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Location */}
              <tr>
                <td className="sticky left-0 z-10 bg-white px-4 py-4 text-sm font-medium text-default">
                  {t('therapistComparison.location')}
                </td>
                {therapists.map((therapist) => (
                  <td key={therapist.id} className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-muted">
                      <MapPin className="h-3 w-3" aria-hidden />
                      <span>{therapist.location}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Languages */}
              <tr>
                <td className="sticky left-0 z-10 bg-white px-4 py-4 text-sm font-medium text-default">
                  {t('therapistComparison.languages')}
                </td>
                {therapists.map((therapist) => (
                  <td key={therapist.id} className="px-4 py-4 text-center">
                    <span className="text-xs text-muted">
                      {therapist.languages && therapist.languages.length > 0
                        ? therapist.languages.join(', ')
                        : '—'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Availability */}
              <tr>
                <td className="sticky left-0 z-10 bg-white px-4 py-4 text-sm font-medium text-default">
                  {t('therapistComparison.availability')}
                </td>
                {therapists.map((therapist) => (
                  <td key={therapist.id} className="px-4 py-4 text-center">
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-default">
                        {therapist.availability}
                      </div>
                      {therapist.responseTime && (
                        <div className="flex items-center justify-center gap-1 text-xs text-muted">
                          <Clock className="h-3 w-3" aria-hidden />
                          <span>{therapist.responseTime}</span>
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Services */}
              {therapists.some((t) => t.services && t.services.length > 0) && (
                <tr>
                  <td className="sticky left-0 z-10 bg-white px-4 py-4 text-sm font-medium text-default">
                    {t('therapistComparison.services')}
                  </td>
                  {therapists.map((therapist) => (
                    <td key={therapist.id} className="px-4 py-4">
                      {therapist.services && therapist.services.length > 0 ? (
                        <ul className="space-y-1 text-xs text-muted">
                          {therapist.services.slice(0, 3).map((service) => (
                            <li key={service} className="flex items-start gap-1">
                              <span className="text-primary">•</span>
                              <span>{service}</span>
                            </li>
                          ))}
                          {therapist.services.length > 3 && (
                            <li className="text-muted">+{therapist.services.length - 3} {t('common.more')}</li>
                          )}
                        </ul>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t border-divider bg-white/95 px-6 py-4 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button variant="ghost" onClick={onClose}>
              {t('common.close')}
            </Button>
            <div className="flex gap-3">
              {therapists.map((therapist) => (
                <Button key={therapist.id} size="sm" asChild>
                  <a href={`/therapists/${therapist.id}`}>
                    {therapist.name.split(' ')[0]} {t('common.contact')}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
