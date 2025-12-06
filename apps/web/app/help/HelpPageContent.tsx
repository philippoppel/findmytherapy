'use client';

import Link from 'next/link';
import { BackLink } from '../components/BackLink';
import { useTranslation } from '@/lib/i18n';

export function HelpPageContent() {
  const { t } = useTranslation();

  // FAQ categories with translation keys
  const faqCategories = [
    {
      id: 'allgemein',
      nameKey: 'help.generalQuestions',
      faqs: [
        {
          questionKey: 'help.whatIsFindMyTherapy',
          answerKey: 'help.whatIsFindMyTherapyAnswer',
        },
        {
          questionKey: 'help.howFastAppointment',
          answerKey: 'help.howFastAppointmentAnswer',
        },
        {
          questionKey: 'help.isServiceFree',
          answerKey: 'help.isServiceFreeAnswer',
        },
      ],
    },
    {
      id: 'kosten',
      nameKey: 'help.costAndFinancing',
      faqs: [
        {
          questionKey: 'help.whatAreTherapyCosts',
          answerKey: 'help.whatAreTherapyCostsAnswer',
        },
        {
          questionKey: 'help.doesInsuranceCover',
          answerKey: 'help.doesInsuranceCoverAnswer',
        },
        {
          questionKey: 'help.howReimbursement',
          answerKey: 'help.howReimbursementAnswer',
        },
      ],
    },
    {
      id: 'ablauf',
      nameKey: 'help.processAndTherapy',
      faqs: [
        {
          questionKey: 'help.howFirstSession',
          answerKey: 'help.howFirstSessionAnswer',
        },
        {
          questionKey: 'help.howLongTherapy',
          answerKey: 'help.howLongTherapyAnswer',
        },
        {
          questionKey: 'help.canChangeTherapist',
          answerKey: 'help.canChangeTherapistAnswer',
        },
      ],
    },
    {
      id: 'online',
      nameKey: 'help.onlineTherapy',
      faqs: [
        {
          questionKey: 'help.canDoOnline',
          answerKey: 'help.canDoOnlineAnswer',
        },
        {
          questionKey: 'help.isOnlineEffective',
          answerKey: 'help.isOnlineEffectiveAnswer',
        },
      ],
    },
    {
      id: 'datenschutz',
      nameKey: 'help.privacyAndSecurity',
      faqs: [
        {
          questionKey: 'help.whatHappensToData',
          answerKey: 'help.whatHappensToDataAnswer',
        },
        {
          questionKey: 'help.isCommunicationConfidential',
          answerKey: 'help.isCommunicationConfidentialAnswer',
        },
      ],
    },
  ];

  return (
    <main className="mx-auto max-w-4xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
      {/* Back Link */}
      <BackLink />

      <header className="space-y-4 text-center">
        <span className="inline-flex items-center justify-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {t('help.breadcrumb')}
        </span>
        <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">{t('help.heading')}</h1>
        <p className="text-base text-neutral-700 max-w-2xl mx-auto">{t('help.subheading')}</p>
      </header>

      {/* Quick Navigation */}
      <nav className="flex flex-wrap gap-2 justify-center">
        {faqCategories.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="px-4 py-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-primary-50 hover:text-primary transition-colors text-sm font-medium"
          >
            {t(category.nameKey)}
          </a>
        ))}
      </nav>

      {/* FAQ Categories */}
      <div className="space-y-12">
        {faqCategories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            aria-labelledby={`${category.id}-heading`}
            className="space-y-6 scroll-mt-8"
          >
            <h2
              id={`${category.id}-heading`}
              className="text-2xl font-semibold text-neutral-950 border-b border-divider pb-3"
            >
              {t(category.nameKey)}
            </h2>
            <ul className="space-y-4">
              {category.faqs.map((faq) => (
                <li
                  key={faq.questionKey}
                  className="rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft"
                >
                  <h3 className="text-lg font-semibold text-neutral-950">{t(faq.questionKey)}</h3>
                  <p className="mt-2 text-sm text-neutral-700 leading-relaxed">{t(faq.answerKey)}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* CTA Section */}
      <section className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">{t('help.stillHaveQuestions')}</h2>
        <p className="text-primary-100 mb-6 max-w-xl mx-auto">{t('help.ctaDescription')}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/triage"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
          >
            {t('help.findTherapist')}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-700 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors border border-primary-500"
          >
            {t('help.getInTouch')}
          </Link>
        </div>
      </section>

      {/* Direct Contact */}
      <section className="rounded-2xl border border-primary/20 bg-primary-50/80 p-6 text-sm text-primary">
        <h2 className="text-lg font-semibold text-primary">{t('help.directContact')}</h2>
        <p className="mt-2">
          {t('help.writeUs')}{' '}
          <a
            className="inline-flex min-h-12 items-center gap-1 px-2 py-3 underline"
            href="mailto:servus@findmytherapy.net"
          >
            servus@findmytherapy.net
          </a>{' '}
          {t('help.orCallUs')}{' '}
          <a
            className="inline-flex min-h-12 items-center gap-1 px-2 py-3 underline"
            href="tel:+4319971212"
          >
            +43 1 997 1212
          </a>{' '}
          {t('help.callUs')}
        </p>
      </section>

      {/* Related Links */}
      <section className="border-t border-divider pt-8">
        <h2 className="text-xl font-semibold text-neutral-950 mb-4">{t('help.moreHelpfulPages')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/blog"
            className="flex items-center gap-3 p-4 rounded-xl border border-divider hover:border-primary hover:bg-primary-50/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-950">{t('help.blog')}</h3>
              <p className="text-sm text-neutral-600">{t('help.blogDesc')}</p>
            </div>
          </Link>
          <Link
            href="/how-it-works"
            className="flex items-center gap-3 p-4 rounded-xl border border-divider hover:border-primary hover:bg-primary-50/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-950">{t('help.howItWorks')}</h3>
              <p className="text-sm text-neutral-600">{t('help.howItWorksDesc')}</p>
            </div>
          </Link>
          <Link
            href="/privacy"
            className="flex items-center gap-3 p-4 rounded-xl border border-divider hover:border-primary hover:bg-primary-50/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-950">{t('help.privacyLink')}</h3>
              <p className="text-sm text-neutral-600">{t('help.privacyLinkDesc')}</p>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
