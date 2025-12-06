'use client';

import { useTranslation } from '@/lib/i18n';

interface ErrorFallbackProps {
  error?: Error;
}

export function ErrorFallback({ error }: ErrorFallbackProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full rounded-3xl border border-divider bg-white p-8 shadow-lg text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-red-500 flex items-center justify-center">
          <span className="text-2xl text-red-500 font-bold">!</span>
        </div>
        <h1 className="text-2xl font-semibold text-default mb-2">{t('errorBoundary.title')}</h1>
        <p className="text-sm text-muted mb-6">{t('errorBoundary.message')}</p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            {t('common.reload') || 'Seite neu laden'}
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="w-full rounded-full border border-divider px-6 py-3 text-sm font-semibold text-default transition hover:bg-neutral-50"
          >
            {t('notFound.backHome')}
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 text-left">
            <summary className="text-sm font-medium text-neutral-700 cursor-pointer">
              {t('errorBoundary.devDetails')}
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-4 rounded-lg overflow-auto">
              {error.toString()}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
