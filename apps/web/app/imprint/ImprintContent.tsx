'use client';

import { useTranslation } from '@/lib/i18n';
import { BackLink } from '../components/BackLink';

export function ImprintContent() {
  const { t } = useTranslation();

  return (
    <div className="marketing-theme bg-surface text-default">
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <BackLink />

        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">
            {t('legalPages.imprint')}
          </h1>
          <p className="text-sm text-neutral-700">
            {t('legalPages.imprintInfo')}
          </p>
        </header>

        <section className="rounded-2xl border border-divider bg-surface-1 p-6 text-sm text-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-950">{t('legalPages.provider')}</h2>
          <p className="mt-2">
            FindMyTherapy GmbH
            <br />
            Mariahilfer Straße 10/2
            <br />
            1070 Wien
            <br />
            Österreich
          </p>
          <p className="mt-4">
            {t('legalPages.email')}{' '}
            <a
              className="inline-flex min-h-12 items-center gap-1 px-2 py-3 underline"
              href="mailto:servus@findmytherapy.net"
            >
              servus@findmytherapy.net
            </a>
            <br />
            {t('legalPages.phone')}{' '}
            <a
              className="inline-flex min-h-12 items-center gap-1 px-2 py-3 underline"
              href="tel:+4319971212"
            >
              +43 1 997 1212
            </a>
          </p>
          <p className="mt-4">
            {t('legalPages.companyRegNumber')} FN 123456a
            <br />
            {t('legalPages.companyCourt')} Handelsgericht Wien
            <br />
            {t('legalPages.vatId')} ATU12345678
          </p>
        </section>

        <section className="rounded-2xl border border-divider bg-surface-1 p-6 text-sm text-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-950">{t('legalPages.professionalInfo')}</h2>
          <p className="mt-2">
            {t('legalPages.professionalInfoText')}
          </p>
        </section>
      </main>
    </div>
  );
}
