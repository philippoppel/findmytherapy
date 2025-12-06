'use client';

import { useState } from 'react';
import { Button, Input } from '@mental-health/ui';
import { Loader2, CheckCircle2, Mail } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export function ForgotPasswordForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/password-reset/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('forgotPassword.errorOccurred'));
      }

      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : t('forgotPassword.errorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-emerald-900">{t('forgotPassword.successTitle')}</h3>
            <p className="mt-2 text-sm text-emerald-800">
              {t('forgotPassword.successMessage')}
            </p>
            <p className="mt-3 text-sm text-emerald-800">{t('forgotPassword.linkValidFor')}</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 text-sm font-medium text-emerald-700 hover:text-emerald-900 underline"
            >
              {t('forgotPassword.requestAnother')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-3xl border border-divider bg-white/90 p-8 shadow-lg shadow-primary/10 backdrop-blur">
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
        <Mail className="h-4 w-4" aria-hidden />
        {t('forgotPassword.title')}
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-default">{t('forgotPassword.heading')}</h2>
      <p className="mt-2 text-sm text-muted">
        {t('forgotPassword.description')}
      </p>

      {status === 'error' && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <div
            className="mt-0.5 h-5 w-5 flex-none rounded-full border-2 border-red-600 flex items-center justify-center text-red-600 font-bold"
            aria-hidden
          >
            !
          </div>
          <div>
            <p className="font-semibold">{t('forgotPassword.error')}</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <label className="space-y-2 text-sm text-neutral-700" htmlFor="reset-email">
          <span className="font-medium text-default">{t('forgotPassword.emailLabel')}</span>
          <Input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('forgotPassword.emailPlaceholder')}
            required
            autoComplete="email"
          />
        </label>

        <Button type="submit" className="w-full" disabled={isSubmitting || !email}>
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {t('forgotPassword.sending')}
            </span>
          ) : (
            t('forgotPassword.submitButton')
          )}
        </Button>

        <p className="text-center text-xs text-subtle">
          {t('forgotPassword.onlyIfExists')}
        </p>
      </form>
    </div>
  );
}
