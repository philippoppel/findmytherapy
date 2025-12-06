'use client';

import { ForgotPasswordForm } from './ForgotPasswordForm';
import { BackLink } from '../components/BackLink';
import { useTranslation } from '@/lib/i18n';

export function ForgotPasswordContent() {
  const { t } = useTranslation();

  return (
    <div className="bg-surface">
      <section className="relative overflow-hidden py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-36 right-[-6rem] h-96 w-96 rounded-full bg-primary-50/30 blur-3xl" />
          <div className="absolute bottom-[-8rem] left-[-4rem] h-80 w-80 rounded-full bg-primary-50/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <BackLink href="/login" label={t('forgotPasswordPage.backToLogin')} />

          <ForgotPasswordForm />

          <div className="mt-8 rounded-3xl border border-divider bg-white/90 p-6 shadow-lg shadow-primary/10 backdrop-blur">
            <h2 className="text-lg font-semibold tracking-tight text-default">
              {t('forgotPasswordPage.alternativeContact')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {t('forgotPasswordPage.directContactHelp')}
            </p>

            <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4 text-sm text-primary dark:border-primary/50 dark:bg-primary/20">
              <strong>{t('forgotPasswordPage.immediateHelp')}</strong>{' '}
              {t('forgotPasswordPage.callUsAt')} <strong>+43 720 123456</strong>{' '}
              {t('common.or')} {t('forgotPasswordPage.sendEmail')}{' '}
              <strong>support@findmytherapy.net</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
