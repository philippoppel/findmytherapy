'use client';

import Link from 'next/link';
import { BackLink } from '../components/BackLink';
import { useTranslation } from '@/lib/i18n';

export function SettingsContent() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <BackLink />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-neutral-950">{t('settings.title')}</h1>
        <p className="text-sm text-neutral-700">{t('settings.description')}</p>
      </header>

      <section className="rounded-2xl border border-divider bg-white p-6 text-sm text-neutral-800 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-950">{t('settings.whereToFind')}</h2>
        <ul className="mt-3 space-y-2 list-disc list-inside">
          <li>
            {t('settings.profileSection')}:{' '}
            <Link className="text-link underline" href="/dashboard/profile">
              /dashboard/profile
            </Link>
          </li>
          <li>
            {t('settings.securitySection')}:{' '}
            <Link className="text-link underline" href="/dashboard/security">
              /dashboard/security
            </Link>
          </li>
          <li>{t('settings.notificationsDesc')}</li>
        </ul>
      </section>
    </main>
  );
}
