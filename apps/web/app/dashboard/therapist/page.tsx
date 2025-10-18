import Link from 'next/link';

import { prisma } from '@mental-health/db';
import { requireTherapist } from '../../../lib/auth-guards';
import { Users, BookOpen, Calendar, TrendingUp, Settings, CreditCard, Heart } from 'lucide-react';

const fetchTherapistProfile = async (userId: string) => {
  const profile = await prisma.therapistProfile.findUnique({
    where: { userId },
    include: {
      listings: true,
      courses: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
      appointments: {
        where: {
          startTime: {
            gte: new Date(),
          },
        },
        orderBy: {
          startTime: 'asc',
        },
        take: 5,
        include: {
          client: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  return profile;
};

export default async function TherapistDashboardPage() {
  const session = await requireTherapist();
  const profile = await fetchTherapistProfile(session.user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-neutral-950">Willkommen zurück, {session.user.email}</h1>
        <p className="text-neutral-800">
          Status:{' '}
          <span className="font-medium">
            {profile?.status === 'VERIFIED'
              ? 'Verifiziert'
              : profile?.status === 'PENDING'
              ? 'In Prüfung'
              : 'Abgelehnt'}
          </span>
        </p>
      </header>

      <section aria-label="Kennzahlen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={Users}
            label="Aktive Klient:innen"
            value={profile?.appointments.length ?? 0}
            tone="info"
          />
          <MetricCard
            icon={BookOpen}
            label="Veröffentlichte Kurse"
            value={profile?.courses.filter((course) => course.status === 'PUBLISHED').length ?? 0}
            tone="accent"
          />
          <MetricCard icon={TrendingUp} label="Listing-Plan" value={profile?.listings[0]?.plan ?? 'FREE'} tone="primary" />
          <MetricCard icon={CreditCard} label="Ausstehende Auszahlungen" value="€0,00" tone="success" />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Schnellaktionen und Termine">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-neutral-950 mb-4">Ihre nächsten Termine</h2>
            {profile?.appointments && profile.appointments.length > 0 ? (
              <ul className="space-y-3">
                {profile.appointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="flex items-start justify-between gap-4 rounded-lg border border-divider p-3 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-neutral-950">{appointment.title}</p>
                      <p className="text-sm text-neutral-700 mt-1">
                        {appointment.startTime.toLocaleDateString('de-AT', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        •{' '}
                        {appointment.startTime.toLocaleTimeString('de-AT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {appointment.client && (
                        <p className="text-xs text-muted mt-1">mit {appointment.client.email}</p>
                      )}
                    </div>
                    <div
                      className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${
                        appointment.status === 'CONFIRMED'
                          ? 'bg-success-50 text-success-700'
                          : 'bg-info-50 text-info-700'
                      }`}
                    >
                      {appointment.status === 'CONFIRMED' ? 'Bestätigt' : 'Geplant'}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={Calendar}
                title="Noch keine Termine geplant"
                description="Sobald Sie Termine erstellen, erscheinen sie hier."
                actionLabel="Termin erstellen"
                actionHref="#"
              />
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-neutral-950 mb-4">Kurse verwalten</h2>
            {profile?.courses.length ? (
              <ul className="divide-y divide-neutral-200">
                {profile.courses.map((course) => (
                  <li key={course.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-neutral-950">{course.title}</p>
                      <p className="text-sm text-neutral-700">
                        Status:{' '}
                        <span className="font-medium">
                          {course.status === 'PUBLISHED' ? 'Veröffentlicht' : 'Entwurf'}
                        </span>
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/courses/${course.id}`}
                      className="text-sm font-medium text-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-800 rounded"
                    >
                      Öffnen
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="Noch keine Kurse angelegt"
                description="Starten Sie mit Ihrem ersten Kurs und erreichen Sie Klient:innen digital."
                actionLabel="Kurs erstellen"
                actionHref="#"
              />
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-neutral-950 mb-4">Schnellzugriff</h2>
            <nav className="space-y-3">
              <QuickAction href="/dashboard/security" icon={Heart} label="Zwei-Faktor-Schutz verwalten" />
              <QuickAction href="/dashboard/profile" icon={Settings} label="Profil aktualisieren" />
              <QuickAction href="/dashboard/listing" icon={TrendingUp} label="Listing-Plan anpassen" />
              <QuickAction href="/dashboard/payouts" icon={CreditCard} label="Auszahlungen prüfen" />
            </nav>
          </div>

          <div className="bg-primary-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Listing-Status</h3>
            <p className="text-sm text-primary mb-4">
              {profile?.listings[0]?.status === 'ACTIVE'
                ? 'Ihr Auftritt ist aktiv und wird Klient:innen angezeigt.'
                : 'Ihr Listing ist derzeit nicht aktiv.'}
            </p>
            <a
              href="/dashboard/listing"
              className="inline-flex items-center justify-center w-full bg-primary-800 text-white py-2 px-4 rounded-md hover:bg-primary-900 transition-colors"
            >
              Listing verwalten
            </a>
          </div>
        </aside>
      </section>
    </div>
  );
}

type MetricCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  tone: 'info' | 'accent' | 'primary' | 'success';
};

const toneStyles: Record<MetricCardProps['tone'], string> = {
  info: 'bg-info-50 text-info-600',
  accent: 'bg-accent-50 text-accent-600',
  primary: 'bg-primary-50 text-primary-600',
  success: 'bg-success-50 text-success-600',
};

function MetricCard({ icon: Icon, label, value, tone }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${toneStyles[tone]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-neutral-950">{value}</p>
        <p className="text-sm text-neutral-800">{label}</p>
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
      className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-800"
    >
      <Icon className="h-5 w-5 text-neutral-700" />
      <span className="text-sm font-medium text-default">{label}</span>
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
