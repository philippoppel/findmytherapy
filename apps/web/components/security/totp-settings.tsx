'use client';

import { useState, useTransition } from 'react';
import { Copy, QrCode, Shield, ShieldOff } from 'lucide-react';
import { Button } from '@mental-health/ui';
import { disableTotp, enableTotp, startTotpSetup } from '../../app/dashboard/security/actions';
import { useTranslation } from '@/lib/i18n';

type Props = {
  email: string;
  totpEnabled: boolean;
};

export function SecuritySettings({ email, totpEnabled }: Props) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [setupSecret, setSetupSecret] = useState<string | null>(null);
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleStartSetup = () =>
    startTransition(async () => {
      try {
        const result = await startTotpSetup();
        setSetupSecret(result.secret);
        setOtpauthUrl(result.otpauthUrl);
        setToken('');
        setMessage(null);
      } catch (error) {
        console.error(error);
        setMessage({
          type: 'error',
          text: t('security.setupFailed'),
        });
      }
    });

  const handleEnable = (event: React.FormEvent) => {
    event.preventDefault();

    if (!setupSecret) {
      setMessage({
        type: 'error',
        text: t('security.generateFirst'),
      });
      return;
    }

    startTransition(async () => {
      const result = await enableTotp(setupSecret, token);

      if (!result.ok) {
        setMessage({
          type: 'error',
          text:
            result.error === 'invalid'
              ? t('security.invalidCode')
              : t('security.activationFailed'),
        });
        return;
      }

      setMessage({
        type: 'success',
        text: t('security.totpEnabled'),
      });
      setSetupSecret(null);
      setOtpauthUrl(null);
      setToken('');
    });
  };

  const handleDisable = () =>
    startTransition(async () => {
      const result = await disableTotp();

      if (!result.ok) {
        setMessage({
          type: 'error',
          text: t('security.disableFailed'),
        });
        return;
      }

      setMessage({
        type: 'success',
        text: t('security.totpDisabled'),
      });
      setSetupSecret(null);
      setOtpauthUrl(null);
      setToken('');
    });

  const copySecret = async () => {
    if (!setupSecret) {
      return;
    }

    try {
      await navigator.clipboard.writeText(setupSecret);
      setMessage({ type: 'success', text: t('security.codeCopied') });
    } catch {
      setMessage({ type: 'error', text: t('security.copyFailed') });
    }
  };

  return (
    <section
      className="bg-white rounded-lg shadow p-6 space-y-6"
      aria-label={t('security.sectionLabel')}
    >
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          <Shield className="h-4 w-4" />
          {t('security.securityBadge')}
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {t('security.totpTitle')}
        </h2>
        <p className="text-sm text-gray-600">
          {t('security.totpDescription')}
        </p>
        <p className="text-xs text-gray-500">{t('security.currentAccount')} {email}</p>
      </header>

      {message && (
        <div
          role="status"
          className={`rounded-md border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">{t('security.currentStatus')}</p>
          <p className="text-sm text-gray-600">
            {totpEnabled ? t('security.enabled') : t('security.notEnabled')} {t('security.recommendedFor')}
          </p>
        </div>
        {totpEnabled ? (
          <Button
            variant="danger"
            size="sm"
            onClick={handleDisable}
            disabled={isPending}
            className="self-start sm:self-auto"
          >
            <ShieldOff className="h-4 w-4 mr-2" />
            {t('security.disable')}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleStartSetup}
            disabled={isPending}
            className="self-start sm:self-auto"
          >
            <Shield className="h-4 w-4 mr-2" />
            {t('security.startSetup')}
          </Button>
        )}
      </div>

      {setupSecret && otpauthUrl && (
        <form onSubmit={handleEnable} className="space-y-4" noValidate>
          <div className="rounded-lg border border-dashed border-gray-300 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">{t('security.setupCode')}</h3>
            <p className="text-sm text-gray-600">
              {t('security.scanCode')}
            </p>
            <code className="block rounded-md bg-gray-900 text-white text-sm tracking-widest px-4 py-3">
              {setupSecret}
            </code>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={copySecret}>
                <Copy className="h-4 w-4 mr-2" />
                {t('security.copyCode')}
              </Button>
              <a
                href={otpauthUrl}
                className="inline-flex items-center rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <QrCode className="h-4 w-4 mr-2" />
                {t('security.openInAuthenticator')}
              </a>
            </div>
          </div>

          <div>
            <label htmlFor="totpToken" className="block text-sm font-medium text-gray-700 mb-1">
              {t('security.confirmationCode')}
            </label>
            <input
              id="totpToken"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              value={token}
              onChange={(event) => setToken(event.target.value.replace(/\s+/g, ''))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="123456"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('security.enterCode')}
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {t('security.activate')}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
