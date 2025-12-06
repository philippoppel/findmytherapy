'use client';

import { Mail } from 'lucide-react';
import { CrisisResources } from '../triage/CrisisResources';
import { BackLink } from '../components/BackLink';
import { useTranslation } from '@/lib/i18n';

export function ContactContent() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-surface py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <BackLink />
        </div>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
            {t('contact.pageTitle')}
          </h1>
          <p className="mt-4 text-lg text-muted">
            {t('contact.pageSubtitle')}
          </p>
        </div>

        {/* Email Contact */}
        <div className="rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <Mail className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-neutral-950">{t('contact.emailSectionTitle')}</h2>
              <p className="mt-2 text-muted">
                {t('contact.emailSectionDesc')}
              </p>
              <a
                href="mailto:care@findmytherapy.net"
                className="mt-4 inline-block text-lg font-semibold text-primary-600 transition hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                care@findmytherapy.net
              </a>
            </div>
          </div>
        </div>

        {/* Crisis Resources */}
        <div className="mt-12">
          <CrisisResources />
        </div>
      </div>
    </div>
  );
}
