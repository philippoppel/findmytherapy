'use client';

import { useTranslation } from '@/lib/i18n';
import { BackLink } from '../components/BackLink';

export function TermsContent() {
  const { t } = useTranslation();

  const clauses = [
    { titleKey: 'termsClause1Title', bodyKey: 'termsClause1Body' },
    { titleKey: 'termsClause2Title', bodyKey: 'termsClause2Body' },
    { titleKey: 'termsClause3Title', bodyKey: 'termsClause3Body' },
    { titleKey: 'termsClause4Title', bodyKey: 'termsClause4Body' },
  ];

  return (
    <div className="marketing-theme bg-surface text-default">
      <main className="mx-auto max-w-3xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <BackLink />

        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">
            {t('legalPages.termsTitle')}
          </h1>
          <p className="text-sm text-neutral-700">{t('legalPages.termsAsOf')} {new Date().getFullYear()}</p>
        </header>

        <section className="space-y-6">
          {clauses.map((clause, index) => (
            <article
              key={index}
              className="rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft"
            >
              <h2 className="text-lg font-semibold text-neutral-950">
                {t(`legalPages.${clause.titleKey}` as any)}
              </h2>
              <p className="mt-2 text-sm text-neutral-800 leading-relaxed">
                {t(`legalPages.${clause.bodyKey}` as any)}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-info-200 bg-info-50 p-6 text-sm text-info-900">
          <h2 className="text-lg font-semibold text-info-900">{t('legalPages.withdrawalTitle')}</h2>
          <p className="mt-2">
            {t('legalPages.withdrawalBody')}{' '}
            <a className="underline" href="mailto:support@findmytherapy.net">
              support@findmytherapy.net
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
