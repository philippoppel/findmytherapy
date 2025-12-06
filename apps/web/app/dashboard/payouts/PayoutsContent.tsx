'use client';

import Link from 'next/link';
import { CreditCard, Info } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export function PayoutsContent() {
  const { t } = useTranslation();

  const upcomingTransfers = [
    {
      id: 'trx-preview-001',
      amount: '€0,00',
      period: 'April 2025',
      status: t('payouts.inPreparation'),
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <header className="space-y-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-muted hover:text-default"
        >
          {t('payouts.backToDashboard')}
        </Link>
        <h1 className="text-3xl font-bold text-neutral-950">{t('payouts.title')}</h1>
      </header>

      <section className="space-y-4 rounded-2xl border border-divider bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="text-lg font-semibold text-neutral-950">{t('payouts.upcomingTransfers')}</h2>
        </div>
        <ul className="space-y-3 text-sm text-neutral-800">
          {upcomingTransfers.map((transfer) => (
            <li
              key={transfer.id}
              className="flex flex-col gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-4"
            >
              <span className="font-semibold text-default">{transfer.period}</span>
              <div className="flex flex-wrap items-center gap-3">
                <span>{t('payouts.amount')}: {transfer.amount}</span>
                <span>{t('payouts.status')}: {transfer.status}</span>
                <span className="text-xs text-muted uppercase tracking-wide">
                  {t('payouts.reference')} {transfer.id}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-info-200 bg-info-50 p-6 text-sm text-info-900">
        <div className="flex items-center gap-2 font-semibold">
          <Info className="h-4 w-4" aria-hidden />
          {t('payouts.notice')}
        </div>
        <p className="mt-2">{t('payouts.noticeText')}</p>
      </section>
    </div>
  );
}
