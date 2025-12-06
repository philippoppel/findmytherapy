'use client';

import { CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';

type ListingData = {
  status: string;
  plan: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
};

type ListingPageClientProps = {
  listing: ListingData | null;
};

export function ListingPageClient({ listing }: ListingPageClientProps) {
  const { t, language } = useTranslation();

  const getFreeFeatures = () => [
    t('listing.freeFeature1'),
    t('listing.freeFeature2'),
    t('listing.freeFeature3'),
  ];

  const getProFeatures = () => [
    t('listing.proFeature1'),
    t('listing.proFeature2'),
    t('listing.proFeature3'),
    t('listing.proFeature4'),
  ];

  const getProPlusFeatures = () => [
    t('listing.proPlusFeature1'),
    t('listing.proPlusFeature2'),
    t('listing.proPlusFeature3'),
    t('listing.proPlusFeature4'),
    t('listing.proPlusFeature5'),
  ];

  const planLabels: Record<string, string> = {
    FREE: t('listing.planNameFree'),
    PRO: t('listing.planNamePro'),
    PRO_PLUS: t('listing.planNameProPlus'),
  };

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(language === 'de' ? 'de-AT' : 'en-GB', { dateStyle: 'medium' }),
    [language]
  );

  const formatDate = (value: string | null) => {
    if (!value) return t('listing.notAvailable');
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return t('listing.notAvailable');
    return dateFormatter.format(parsed);
  };

  const formatPlan = (plan?: string) => planLabels[plan ?? ''] ?? plan ?? t('listing.notAvailable');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="space-y-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-muted hover:text-default mb-2"
        >
          {t('listing.backToDashboard')}
        </Link>
        <h1 className="text-3xl font-bold text-neutral-950">{t('listing.title')}</h1>
        <p className="text-neutral-800">{t('listing.subtitle')}</p>
      </header>

      {listing ? (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-950">{t('listing.currentPlan')}</h2>
              <p className="text-sm text-muted mt-1">{t('listing.planDescription')}</p>
            </div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                listing.status === 'ACTIVE'
                  ? 'bg-success-50 text-success-700'
                  : listing.status === 'PAST_DUE'
                    ? 'bg-warning-50 text-warning-700'
                    : 'bg-neutral-100 text-neutral-700'
              }`}
            >
              {listing.status === 'ACTIVE' ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {t('listing.statusActive')}
                </>
              ) : listing.status === 'PAST_DUE' ? (
                <>
                  <AlertCircle className="h-4 w-4" />
                  {t('listing.statusPastDue')}
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  {t('listing.statusInactive')}
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard label={t('listing.plan')} value={formatPlan(listing.plan)} />
            <InfoCard
              label={t('listing.periodStart')}
              value={formatDate(listing.currentPeriodStart)}
            />
            <InfoCard
              label={t('listing.periodEnd')}
              value={formatDate(listing.currentPeriodEnd)}
            />
          </div>

          <div className="border-t border-divider pt-6">
            <h3 className="text-lg font-semibold text-neutral-950 mb-4">{t('listing.availablePlans')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PlanCard
                name={planLabels.FREE}
                price={t('listing.planPriceFree')}
                features={getFreeFeatures()}
                isCurrent={listing.plan === 'FREE'}
                recommendedLabel={t('listing.recommended')}
                currentLabel={t('listing.currentPlanBadge')}
              />
              <PlanCard
                name={planLabels.PRO}
                price={t('listing.planPricePro')}
                features={getProFeatures()}
                isCurrent={listing.plan === 'PRO'}
                isRecommended
                recommendedLabel={t('listing.recommended')}
                currentLabel={t('listing.currentPlanBadge')}
              />
              <PlanCard
                name={planLabels.PRO_PLUS}
                price={t('listing.planPriceProPlus')}
                features={getProPlusFeatures()}
                isCurrent={listing.plan === 'PRO_PLUS'}
                recommendedLabel={t('listing.recommended')}
                currentLabel={t('listing.currentPlanBadge')}
              />
            </div>
          </div>

          <div className="bg-info-50 border border-info-200 rounded-lg p-4">
            <p className="text-sm text-info-900">
              <strong className="font-semibold">{t('listing.noteLabel')}</strong> {t('listing.planChangeNote')}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center space-y-4">
          <TrendingUp className="h-16 w-16 text-neutral-400 mx-auto" />
          <h2 className="text-xl font-semibold text-neutral-950">{t('listing.noListingTitle')}</h2>
          <p className="text-neutral-700 max-w-md mx-auto">{t('listing.noListingDesc')}</p>
          <button
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors"
            disabled
          >
            {t('listing.activateListing')}
          </button>
        </div>
      )}
    </div>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="bg-neutral-50 rounded-lg p-4">
      <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-1">{label}</p>
      <p className="text-lg font-bold text-neutral-950">{value}</p>
    </div>
  );
}

type PlanCardProps = {
  name: string;
  price: string;
  features: string[];
  isCurrent?: boolean;
  isRecommended?: boolean;
  recommendedLabel: string;
  currentLabel: string;
};

function PlanCard({ name, price, features, isCurrent, isRecommended, recommendedLabel, currentLabel }: PlanCardProps) {
  return (
    <div
      className={`relative rounded-lg border p-6 ${
        isCurrent
          ? 'border-primary bg-primary-50'
          : isRecommended
            ? 'border-accent bg-accent-50'
            : 'border-divider bg-white'
      }`}
    >
      {isRecommended && !isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold uppercase tracking-wide">
            {recommendedLabel}
          </span>
        </div>
      )}
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold uppercase tracking-wide">
            {currentLabel}
          </span>
        </div>
      )}
      <h3 className="text-lg font-bold text-neutral-950">{name}</h3>
      <p className="text-2xl font-extrabold text-neutral-950 mt-2 mb-4">{price}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-neutral-700">
            <CheckCircle2 className="h-4 w-4 text-success-600 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
