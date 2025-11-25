import { prisma, TherapistStatus } from '@/lib/prisma';
import { requireAdmin } from '../../lib/auth-guards';
import { updateTherapistStatus } from './actions';
import { Users, Bell, ShieldAlert, TrendingUp } from 'lucide-react';

// Force dynamic rendering for auth-protected page
export const dynamic = 'force-dynamic';

const fetchAdminData = async () => {
  const [userCount, therapistCount, pendingTherapists, recentAlerts, therapistProfiles] =
    await Promise.all([
      prisma.user.count(),
      prisma.therapistProfile.count({
        where: { deletedAt: null },
      }),
      prisma.therapistProfile.count({
        where: { status: 'PENDING', deletedAt: null },
      }),
      prisma.emergencyAlert.findMany({
        orderBy: { triggeredAt: 'desc' },
        take: 5,
        include: {
          client: {
            select: {
              email: true,
            },
          },
          handler: {
            select: {
              email: true,
            },
          },
        },
      }),
      prisma.therapistProfile.findMany({
        where: { deletedAt: null },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          status: true,
          adminNotes: true,
          city: true,
          country: true,
          online: true,
          specialties: true,
          modalities: true,
          about: true,
          availabilityNote: true,
          pricingNote: true,
          updatedAt: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      }),
    ]);

  return {
    userCount,
    therapistCount,
    pendingTherapists,
    recentAlerts,
    therapistProfiles,
  };
};

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const stats = await fetchAdminData();
  const { therapistProfiles } = stats;

  const statusOptions: Array<{ value: TherapistStatus; label: string }> = [
    { value: 'PENDING', label: 'In Prüfung' },
    { value: 'VERIFIED', label: 'Verifiziert' },
    { value: 'REJECTED', label: 'Abgelehnt' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">Admin-Dashboard</h1>
        <p className="text-gray-600">Angemeldet als {session.user.email}</p>
      </header>

      <section aria-label="Systemübersicht">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={Users} label="Gesamt-Nutzer:innen" value={stats.userCount} />
          <StatCard icon={TrendingUp} label="Therapeut:innen aktiv" value={stats.therapistCount} />
          <StatCard
            icon={ShieldAlert}
            label="Ausstehende Verifizierungen"
            value={stats.pendingTherapists}
            tone="warning"
          />
        </div>
      </section>

      <section
        aria-label="Pilot-Therapeut:innen verwalten"
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        <header className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-900">Pilot-Therapeut:innen</h2>
          <p className="text-sm text-gray-600">
            Prüfe Profile, aktualisiere den Status und hinterlege interne Notizen für das Team.
          </p>
        </header>

        {therapistProfiles.length === 0 ? (
          <p className="text-sm text-gray-600">Es wurden noch keine Profile angelegt.</p>
        ) : (
          <div className="space-y-4">
            {therapistProfiles.map((profile) => (
              <form
                key={profile.id}
                action={updateTherapistStatus}
                className="rounded-lg border border-gray-200 p-4 space-y-4"
              >
                <input type="hidden" name="profileId" value={profile.id} />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-gray-900">{profile.user.email}</p>
                  <p className="text-xs text-gray-600">
                    {profile.city ? `${profile.city}, ${profile.country}` : profile.country} •{' '}
                    {profile.online ? 'Online verfügbar' : 'Nur vor Ort'}
                  </p>
                  {profile.specialties.length > 0 && (
                    <p className="text-xs text-gray-500">
                      Schwerpunkte: {profile.specialties.join(', ')}
                    </p>
                  )}
                  {profile.modalities.length > 0 && (
                    <p className="text-xs text-gray-500">
                      Methoden: {profile.modalities.join(', ')}
                    </p>
                  )}
                  {profile.availabilityNote && (
                    <p className="text-xs text-primary">Termine: {profile.availabilityNote}</p>
                  )}
                  {profile.pricingNote && (
                    <p className="text-xs text-primary">Preise: {profile.pricingNote}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    Zuletzt aktualisiert: {profile.updatedAt.toLocaleString('de-AT')}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr]">
                  <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                    Status
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
                    Team-Notiz
                    <textarea
                      name="adminNotes"
                      defaultValue={profile.adminNotes ?? ''}
                      rows={3}
                      className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Interne Abstimmungen, offene To-Dos oder nächste Schritte notieren..."
                    />
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Änderungen speichern
                  </button>
                </div>
              </form>
            ))}
          </div>
        )}
      </section>

      <section aria-label="Notfallmeldungen" className="bg-white rounded-lg shadow p-6">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-500" />
            Aktuelle Notfallmeldungen
          </h2>
          <a
            href="/admin/emergency"
            className="text-sm font-medium text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded"
          >
            Alle Meldungen anzeigen
          </a>
        </header>

        {stats.recentAlerts.length === 0 ? (
          <p className="text-sm text-gray-600">Aktuell liegen keine Notfallmeldungen vor.</p>
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
                  Ausgelöst am {alert.triggeredAt.toLocaleString('de-AT')}
                  {alert.handler
                    ? ` • Bearbeitet von ${alert.handler.email}`
                    : ' • Noch nicht bearbeitet'}
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
