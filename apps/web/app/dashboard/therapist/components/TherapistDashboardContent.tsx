'use client';

import Link from 'next/link';
import { Users, BookOpen, Calendar, TrendingUp, Settings, CreditCard, Heart } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

type Appointment = {
  id: string;
  title: string;
  startTime: string;
  status: string;
  client: { email: string } | null;
};

type Course = {
  id: string;
  title: string;
  status: string;
};

type Listing = {
  plan: string;
  status: string;
};

type TherapistDashboardContentProps = {
  userName: string;
  profileStatus: string | null;
  appointments: Appointment[];
  courses: Course[];
  listings: Listing[];
  appointmentCount: number;
  publishedCoursesCount: number;
};

export function TherapistDashboardContent({
  userName,
  profileStatus,
  appointments,
  courses,
  listings,
  appointmentCount,
  publishedCoursesCount,
}: TherapistDashboardContentProps) {
  const { t, language } = useTranslation();

  const getStatusLabel = (status: string | null) => {
    if (status === 'VERIFIED') return `✓ ${t('therapistDashboard.verified')}`;
    if (status === 'PENDING') return `⏳ ${t('therapistDashboard.pending')}`;
    return `✕ ${t('therapistDashboard.rejected')}`;
  };

  const getStatusStyle = (status: string | null) => {
    if (status === 'VERIFIED') return 'bg-green-100 text-green-700';
    if (status === 'PENDING') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'de-AT', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(language === 'en' ? 'en-US' : 'de-AT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-neutral-900">
          {t('therapistDashboard.welcomeBack')}, {userName}
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">{t('therapistDashboard.status')}:</span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(profileStatus)}`}
          >
            {getStatusLabel(profileStatus)}
          </span>
        </div>
      </header>

      <section aria-label={t('therapistDashboard.activeClients')}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={Users}
            label={t('therapistDashboard.activeClients')}
            value={appointmentCount}
            tone="info"
          />
          <MetricCard
            icon={BookOpen}
            label={t('therapistDashboard.publishedCourses')}
            value={publishedCoursesCount}
            tone="accent"
          />
          <MetricCard
            icon={TrendingUp}
            label={t('therapistDashboard.listingPlan')}
            value={listings[0]?.plan ?? 'FREE'}
            tone="primary"
          />
          <MetricCard
            icon={CreditCard}
            label={t('therapistDashboard.pendingPayouts')}
            value="€0,00"
            tone="success"
          />
        </div>
      </section>

      <section
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        aria-label={t('therapistDashboard.quickAccess')}
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              {t('therapistDashboard.upcomingAppointments')}
            </h2>
            {appointments && appointments.length > 0 ? (
              <ul className="space-y-3">
                {appointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="flex items-start justify-between gap-4 rounded-lg border border-divider p-3 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-neutral-950">{appointment.title}</p>
                      <p className="text-sm text-neutral-700 mt-1">
                        {formatDate(appointment.startTime)} • {formatTime(appointment.startTime)}
                      </p>
                      {appointment.client && (
                        <p className="text-xs text-muted mt-1">
                          {t('therapistDashboard.with')} {appointment.client.email}
                        </p>
                      )}
                    </div>
                    <div
                      className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${
                        appointment.status === 'CONFIRMED'
                          ? 'bg-success-50 text-success-700'
                          : 'bg-info-50 text-info-700'
                      }`}
                    >
                      {appointment.status === 'CONFIRMED'
                        ? t('therapistDashboard.confirmed')
                        : t('therapistDashboard.scheduled')}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={Calendar}
                title={t('therapistDashboard.noAppointments')}
                description={t('therapistDashboard.noAppointmentsDesc')}
                actionLabel={t('therapistDashboard.createAppointment')}
                actionHref="#"
              />
            )}
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              {t('therapistDashboard.manageCourses')}
            </h2>
            {courses.length ? (
              <ul className="divide-y divide-neutral-200">
                {courses.map((course) => (
                  <li key={course.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-neutral-950">{course.title}</p>
                      <p className="text-sm text-neutral-700">
                        {t('therapistDashboard.courseStatus')}:{' '}
                        <span className="font-medium">
                          {course.status === 'PUBLISHED'
                            ? t('dashboard.published')
                            : t('dashboard.draft')}
                        </span>
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/courses/${course.id}`}
                      className="text-sm font-medium text-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-800 rounded"
                    >
                      {t('therapistDashboard.open')}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={BookOpen}
                title={t('therapistDashboard.noCourses')}
                description={t('therapistDashboard.noCoursesDesc')}
                actionLabel={t('therapistDashboard.createCourse')}
                actionHref="#"
              />
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              {t('therapistDashboard.quickAccess')}
            </h2>
            <nav className="space-y-2">
              <QuickAction
                href="/dashboard/security"
                icon={Heart}
                label={t('therapistDashboard.manage2FA')}
              />
              <QuickAction
                href="/dashboard/profile"
                icon={Settings}
                label={t('therapistDashboard.updateProfile')}
              />
              <QuickAction
                href="/dashboard/listing"
                icon={TrendingUp}
                label={t('therapistDashboard.adjustListing')}
              />
              <QuickAction
                href="/dashboard/payouts"
                icon={CreditCard}
                label={t('therapistDashboard.checkPayouts')}
              />
            </nav>
          </div>

          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border border-primary-200 p-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              {t('therapistDashboard.listingStatus')}
            </h3>
            <p className="text-sm text-primary-700 mb-4">
              {listings[0]?.status === 'ACTIVE'
                ? t('therapistDashboard.listingActive')
                : t('therapistDashboard.listingInactive')}
            </p>
            <a
              href="/dashboard/listing"
              className="inline-flex items-center justify-center w-full bg-primary-600 text-white py-2.5 px-4 rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
            >
              {t('therapistDashboard.manageListing')}
            </a>
          </div>
        </aside>
      </section>
    </>
  );
}

type MetricCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  tone: 'info' | 'accent' | 'primary' | 'success';
};

const toneStyles: Record<MetricCardProps['tone'], string> = {
  info: 'bg-primary-100 text-primary-600',
  accent: 'bg-purple-100 text-purple-600',
  primary: 'bg-primary-100 text-primary-600',
  success: 'bg-green-100 text-green-600',
};

function MetricCard({ icon: Icon, label, value, tone }: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-4">
        <div
          className={`h-14 w-14 rounded-xl flex items-center justify-center ${toneStyles[tone]}`}
        >
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <p className="text-3xl font-bold text-neutral-900">{value}</p>
          <p className="text-sm text-muted">{label}</p>
        </div>
      </div>
    </div>
  );
}

type QuickActionProps = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

function QuickAction({ href, icon: Icon, label }: QuickActionProps) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <Icon className="h-5 w-5 text-primary-600" />
      <span className="text-sm font-medium text-neutral-700">{label}</span>
    </a>
  );
}

type EmptyStateProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

function EmptyState({ icon: Icon, title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-lg border border-dashed border-neutral-300 p-6">
      <Icon className="h-8 w-8 text-neutral-500" />
      <div>
        <h3 className="text-base font-semibold text-neutral-950">{title}</h3>
        <p className="text-sm text-neutral-800 mt-1">{description}</p>
      </div>
      <a
        href={actionHref}
        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-800 rounded"
      >
        {actionLabel}
      </a>
    </div>
  );
}
