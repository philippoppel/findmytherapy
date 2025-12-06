'use client';

import { SecuritySettings } from '../../../components/security/totp-settings';
import { useTranslation } from '@/lib/i18n';

interface SecurityContentProps {
  email: string;
  totpEnabled: boolean;
}

export function SecurityContent({ email, totpEnabled }: SecurityContentProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-neutral-900">{t('securityPage.title')}</h1>
        <p className="text-muted">{t('securityPage.description')}</p>
      </header>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <SecuritySettings email={email} totpEnabled={totpEnabled} />
      </div>
    </div>
  );
}
