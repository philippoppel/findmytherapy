'use client';

import { useTranslation } from '@/lib/i18n';

interface DashboardFallbackContentProps {
  email: string | null | undefined;
  role: string | null | undefined;
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
}

export function DashboardFallbackContent({
  email,
  role,
  userId,
  firstName,
  lastName,
}: DashboardFallbackContentProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-50 to-primary-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">{t('dashboardPage.welcome')}</h1>
            <p className="mt-2 text-muted">{t('dashboardPage.loginSuccess')}</p>
          </div>

          <div className="space-y-4 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 p-6">
            <h2 className="text-xl font-semibold text-neutral-900">{t('dashboardPage.sessionData')}</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-muted">{t('dashboardPage.email')}</p>
                <p className="mt-1 text-lg font-semibold text-neutral-900">{email}</p>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-muted">{t('dashboardPage.role')}</p>
                <p className="mt-1 text-lg font-semibold text-neutral-900">{role}</p>
              </div>

              {firstName && (
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-muted">{t('dashboardPage.name')}</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {firstName} {lastName}
                  </p>
                </div>
              )}

              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-muted">{t('dashboardPage.userId')}</p>
                <p className="mt-1 text-sm font-mono text-neutral-900">{userId}</p>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4">
              <p className="text-sm font-semibold text-green-900">{t('dashboardPage.sessionWorks')}</p>
              <p className="mt-1 text-sm text-green-700">{t('dashboardPage.cookieSet')}</p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <a
              href="/"
              className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 transition"
            >
              {t('dashboard.toHomepage')}
            </a>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition"
              >
                {t('dashboard.logout')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
