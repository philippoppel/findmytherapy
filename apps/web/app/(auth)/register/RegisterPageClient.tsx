'use client';

import { CalendarCheck, FileText, HeartHandshake, ShieldCheck, Users } from 'lucide-react';
import { RegistrationForm } from './RegistrationForm';
import { BackLink } from '../../components/BackLink';
import { useTranslation } from '@/lib/i18n';

export function RegisterPageClient() {
  const { t } = useTranslation();

  return (
    <section className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 py-8 sm:py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <BackLink />
        </div>

        {/* Header */}
        <div className="mb-8 text-center lg:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-800 shadow-sm">
            <Users className="h-4 w-4" aria-hidden />
            {t('register.heroBadge')}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            {t('register.heroTitle')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {t('register.heroSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Left Column - Form */}
          <div className="order-2 lg:order-1">
            <RegistrationForm />
          </div>

          {/* Right Column - Info */}
          <div className="order-1 space-y-6 lg:order-2">
            {/* Benefits */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                {t('register.benefitsTitle')}
              </h2>
              <dl>
                <dt className="mt-6 flex items-start gap-3 text-neutral-900 first:mt-0">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <span className="font-medium">{t('register.benefitPrivacyTitle')}</span>
                </dt>
                <dd className="pl-8 pt-2 text-sm text-neutral-700">
                  {t('register.benefitPrivacyDesc')}
                </dd>

                <dt className="mt-6 flex items-start gap-3 text-neutral-900 first:mt-0">
                  <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <span className="font-medium">{t('register.benefitFlexTitle')}</span>
                </dt>
                <dd className="pl-8 pt-2 text-sm text-neutral-700">
                  {t('register.benefitFlexDesc')}
                </dd>

                <dt className="mt-6 flex items-start gap-3 text-neutral-900 first:mt-0">
                  <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <span className="font-medium">{t('register.benefitRecommendationsTitle')}</span>
                </dt>
                <dd className="pl-8 pt-2 text-sm text-neutral-700">
                  {t('register.benefitRecommendationsDesc')}
                </dd>
              </dl>
            </div>

            {/* Compliance Download */}
            <div className="rounded-2xl border border-primary/30 bg-primary-50/50 p-6">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div className="flex-1">
                  <h2 className="font-semibold text-neutral-900">{t('register.complianceTitle')}</h2>
                  <p className="mt-1 text-sm text-neutral-700">{t('register.complianceDesc')}</p>
                  <a
                    href="/compliance/findmytherapy-pilot-compliance-pack.pdf"
                    download
                    className="mt-3 inline-flex items-center justify-center rounded-lg border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {t('register.complianceCta')}
                  </a>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-900">
                {t('register.responseTime')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
