'use client';

import { Users, Bell, ShieldAlert, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

type TherapistStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

type TherapistProfile = {
  id: string;
  status: TherapistStatus;
  adminNotes: string | null;
  city: string | null;
  country: string | null;
  online: boolean;
  specialties: string[];
  modalities: string[];
  about: string | null;
  availabilityNote: string | null;
  pricingNote: string | null;
  updatedAt: Date;
  user: {
    email: string;
  };
};

type EmergencyAlert = {
  id: string;
  severity: string;
  triggeredAt: Date;
  client: {
    email: string;
  };
  handler: {
    email: string;
  } | null;
};

type AdminStats = {
  userCount: number;
  therapistCount: number;
  pendingTherapists: number;
  recentAlerts: EmergencyAlert[];
  therapistProfiles: TherapistProfile[];
};

type AdminDashboardClientProps = {
  stats: AdminStats;
  userEmail: string;
  updateAction: (formData: FormData) => Promise<void>;
};

export function AdminDashboardClient({ stats, userEmail, updateAction }: AdminDashboardClientProps) {
  const { t } = useTranslation();
  const { therapistProfiles } = stats;

  const statusOptions: Array<{ value: TherapistStatus; label: string }> = [
    { value: 'PENDING', label: t('admin.inReview') },
    { value: 'VERIFIED', label: t('admin.verified') },
    { value: 'REJECTED', label: t('admin.rejected') },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.dashboard')}</h1>
        <p className="text-gray-600">{t('admin.loggedInAs', { email: userEmail })}</p>
      </header>

      <section aria-label={t('admin.systemOverview')}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={Users} label={t('admin.totalUsers')} value={stats.userCount} />
          <StatCard icon={TrendingUp} label={t('admin.activeTherapists')} value={stats.therapistCount} />
          <StatCard
            icon={ShieldAlert}
            label={t('admin.pendingVerifications')}
            value={stats.pendingTherapists}
            tone="warning"
          />
        </div>
      </section>

      <section
        aria-label={t('admin.managePilotTherapists')}
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        <header className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-900">{t('admin.pilotTherapists')}</h2>
          <p className="text-sm text-gray-600">
            {t('admin.pilotTherapistsDesc')}
          </p>
        </header>

        {therapistProfiles.length === 0 ? (
          <p className="text-sm text-gray-600">{t('admin.noProfilesYet')}</p>
        ) : (
          <div className="space-y-4">
            {therapistProfiles.map((profile) => (
              <form
                key={profile.id}
                action={updateAction}
                className="rounded-lg border border-gray-200 p-4 space-y-4"
              >
                <input type="hidden" name="profileId" value={profile.id} />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-gray-900">{profile.user.email}</p>
                  <p className="text-xs text-gray-600">
                    {profile.city ? `${profile.city}, ${profile.country}` : profile.country} •{' '}
                    {profile.online ? t('admin.onlineAvailable') : t('admin.onSiteOnly')}
                  </p>
                  {profile.specialties.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {t('admin.specialties')}: {profile.specialties.join(', ')}
                    </p>
                  )}
                  {profile.modalities.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {t('admin.methods')}: {profile.modalities.join(', ')}
                    </p>
                  )}
                  {profile.availabilityNote && (
                    <p className="text-xs text-primary">{t('admin.appointments')}: {profile.availabilityNote}</p>
                  )}
                  {profile.pricingNote && (
                    <p className="text-xs text-primary">{t('admin.pricing')}: {profile.pricingNote}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {t('admin.lastUpdated')}: {new Date(profile.updatedAt).toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr]">
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    {t('admin.status')}
                    <select
                      name="status"
                      defaultValue={profile.status}
                      className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    {t('admin.internalNotes')}
                    <textarea
                      name="adminNotes"
                      defaultValue={profile.adminNotes ?? ''}
                      rows={3}
                      className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={t('admin.internalNotesPlaceholder')}
                    />
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    {t('admin.saveChanges')}
                  </button>
                </div>
              </form>
            ))}
          </div>
        )}
      </section>

      <section aria-label={t('admin.emergencyAlerts')} className="bg-white rounded-lg shadow p-6">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-500" />
            {t('admin.currentEmergencyAlerts')}
          </h2>
        </header>

        {stats.recentAlerts.length === 0 ? (
          <p className="text-sm text-gray-600">{t('admin.noEmergencyAlerts')}</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {stats.recentAlerts.map((alert) => (
              <li key={alert.id} className="py-3">
                <p className="text-sm font-medium text-gray-900">
                  {alert.client.email} •{' '}
                  <span className="uppercase text-xs tracking-wide text-red-600 font-semibold">
                    {alert.severity}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(alert.triggeredAt).toLocaleString()}
                  {alert.handler
                    ? ` • ${alert.handler.email}`
                    : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

type StatCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone?: 'default' | 'warning';
};

const toneClasses: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'bg-info-50 text-info-600',
  warning: 'bg-warning-50 text-warning-700',
};

function StatCard({ icon: Icon, label, value, tone = 'default' }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
      <div
        className={`h-12 w-12 rounded-full flex items-center justify-center ${toneClasses[tone]}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
}
