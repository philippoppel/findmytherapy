'use client';

import { AlertCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export function MedicalDisclaimer() {
  const { t } = useTranslation();

  return (
    <div className="my-8 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 shadow-sm">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-amber-600" aria-hidden="true" />
        </div>
        <div className="space-y-3 text-sm text-neutral-700">
          <h3 className="text-base font-semibold text-neutral-900">
            {t('medicalDisclaimer.title')}
          </h3>
          <p className="leading-relaxed">{t('medicalDisclaimer.content')}</p>
          <p className="font-semibold text-neutral-900">
            {t('medicalDisclaimer.emergency').split('144')[0]}
            <a href="tel:144" className="underline">
              144
            </a>
            {t('medicalDisclaimer.emergency').split('144')[1].split('142')[0]}
            <a href="tel:142" className="underline">
              142
            </a>
            {t('medicalDisclaimer.emergency').split('142')[1]}
          </p>
        </div>
      </div>
    </div>
  );
}
