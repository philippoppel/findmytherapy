import type { ComponentType } from 'react';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, Clock3, Euro, Globe2, Languages, MapPin, PencilLine, ShieldCheck, UsersRound } from 'lucide-react';

import { prisma } from '@mental-health/db';
import { requireTherapist } from '../../../lib/auth-guards';

const fetchTherapistProfile = async (userId: string) => {
  return prisma.therapistProfile.findUnique({
    where: { userId },
    include: {
      listings: {
        select: {
          plan: true,
          status: true,
        },
        take: 1,
      },
    },
  });
};

const formatCurrency = (value?: number | null) => {
  if (typeof value !== 'number') {
    return '–';
  }

  return new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value / 100);
};

const formatArray = (values?: string[] | null) => {
  if (!values || values.length === 0) {
    return '–';
  }

  return values.join(', ');
};

const statusTone: Record<string, string> = {
  VERIFIED: 'bg-success-50 text-success-700 border-success-200',
  PENDING: 'bg-warning-50 text-warning-700 border-warning-200',
  REJECTED: 'bg-danger-50 text-danger-700 border-danger-200',
};

export default async function TherapistProfilePage() {
  const session = await requireTherapist();
  const profile = await fetchTherapistProfile(session.user.id);

  if (!profile) {
    notFound();
  }

  const statusLabel =
    profile.status === 'VERIFIED'
      ? 'Verifiziert'
      : profile.status === 'PENDING'
      ? 'In Prüfung'
      : 'Abgelehnt';

  const primaryListing = profile.listings[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="space-y-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-muted hover:text-default transition-colors"
        >
          ← Zurück zum Dashboard
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-neutral-950">Therapeut:innen-Profil</h1>
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${statusTone[profile.status] ?? 'bg-neutral-100 text-neutral-800 border-divider'
              }`}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden />
            {statusLabel}
          </span>
        </div>
        <p className="text-neutral-800">
          Überprüfen Sie Ihre Profildaten für Klient:innen. Anpassungen nimmt derzeit unser Team für Sie vor.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <section className="rounded-xl border border-divider bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-950 mb-4 flex items-center gap-2">
            <PencilLine className="h-5 w-5 text-primary" aria-hidden />
            Profilrahmendaten
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow label="Lizenzbehörde" value={profile.licenseAuthority ?? '–'} />
            <InfoRow label="Lizenznummer" value={profile.licenseId ?? '–'} />
            <InfoRow label="Preisspanne" value={`${formatCurrency(profile.priceMin)} – ${formatCurrency(profile.priceMax)}`} />
            <InfoRow
              label="Listing-Plan"
              value={primaryListing ? `${primaryListing.plan} (${primaryListing.status})` : 'Kein aktives Listing'}
            />
          </dl>
        </section>

        <section className="rounded-xl border border-divider bg-white p-6 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-950 flex items-center gap-2">
            <UsersRound className="h-5 w-5 text-primary" aria-hidden />
            Spezialisierungen & Angebot
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow label="Therapie-Schwerpunkte" value={formatArray(profile.specialties)} />
            <InfoRow label="Modalitäten" value={formatArray(profile.modalities)} />
            <InfoRow label="Sprachen" value={formatArray(profile.languages)} icon={Languages} />
            <InfoRow label="Online-Termine" value={profile.online ? 'Ja, online verfügbar' : 'Nur vor Ort'} icon={Globe2} />
          </dl>
        </section>

        <section className="rounded-xl border border-divider bg-white p-6 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-950 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" aria-hidden />
            Standort & Verfügbarkeit
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow label="Stadt" value={profile.city ?? '–'} />
            <InfoRow label="Land" value={profile.country ?? '–'} />
            <InfoRow
              label="Eingetragen seit"
              value={profile.createdAt.toLocaleDateString('de-AT')}
              icon={CalendarDays}
            />
            <InfoRow
              label="Letzte Aktualisierung"
              value={profile.updatedAt.toLocaleDateString('de-AT')}
              icon={CalendarDays}
            />
          </dl>
        </section>

        <section className="rounded-xl border border-divider bg-white p-6 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-950 flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-primary" aria-hidden />
            Konditionen & Hinweise
          </h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow
              label="Termin-Hinweis"
              value={profile.availabilityNote ?? '–'}
              icon={Clock3}
            />
            <InfoRow
              label="Preishinweis"
              value={profile.pricingNote ?? '–'}
              icon={Euro}
            />
          </dl>
        </section>

        <section className="rounded-xl border border-divider bg-white p-6 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-950">Über mich</h2>
          <p className="text-neutral-800 whitespace-pre-wrap">
            {profile.about ??
              'Noch keine Beschreibung hinterlegt. In der finalen Version können Sie hier Ihr therapeutisches Profil ergänzen.'}
          </p>
        </section>

        <section className="rounded-xl border border-primary/20 bg-primary-50 p-6 space-y-3">
          <h2 className="text-lg font-semibold text-primary">Profilbearbeitung</h2>
          <p className="text-sm text-primary">
            Derzeit nimmt unser Team Aktualisierungen für Sie vor. In Kürze können Therapeu:innen hier Texte, Preise sowie
            Sprachen und Schwerpunkte selbst verwalten.
          </p>
        </section>
      </div>
    </div>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
};

function InfoRow({ label, value, icon: Icon }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <span className="flex items-center gap-2 text-sm text-default">
        {Icon ? <Icon className="h-4 w-4 text-neutral-600" aria-hidden /> : null}
        {value}
      </span>
    </div>
  );
}
