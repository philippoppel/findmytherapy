'use client';

import { BackLink } from '../components/BackLink';
import { useTranslation } from '@/lib/i18n';

export default function PartnersPage() {
  const { t } = useTranslation();

  const partnerTypes = [
    {
      title: t('partners.corporateTitle'),
      description: t('partners.corporateDesc'),
    },
    {
      title: t('partners.insuranceTitle'),
      description: t('partners.insuranceDesc'),
    },
    {
      title: t('partners.healthcareTitle'),
      description: t('partners.healthcareDesc'),
    },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <BackLink />

      <header className="space-y-3 text-center">
        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {t('partners.badge')}
        </span>
        <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">
          {t('partners.title')}
        </h1>
        <p className="mx-auto max-w-2xl text-base text-neutral-700">
          {t('partners.subtitle')}
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {partnerTypes.map((type) => (
          <article
            key={type.title}
            className="rounded-2xl border border-divider bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-neutral-950">{type.title}</h2>
            <p className="mt-2 text-sm text-neutral-700">{type.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-primary/20 bg-primary-50 p-6 text-sm text-primary">
        <h2 className="text-lg font-semibold text-primary">{t('partners.contactTitle')}</h2>
        <p className="mt-2">
          {t('partners.contactText')}{' '}
          <a className="underline" href="mailto:partners@findmytherapy.net">
            partners@findmytherapy.net
          </a>
          {t('partners.contactSuffix')}
        </p>
      </section>
    </main>
  );
}
