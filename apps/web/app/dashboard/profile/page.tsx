import type { ComponentType } from 'react';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, Clock3, Euro, Globe2, Languages, MapPin, PencilLine, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';

import { prisma } from '@mental-health/db';
import { requireTherapist } from '../../../lib/auth-guards';
import { formatCurrencyInput, joinList } from '../../../lib/therapist/setcard';
import { SetcardEditor, type SetcardFormValues } from './SetcardEditor';

const fetchTherapistProfile = async (userId: string) => {
  return prisma.therapistProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
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

const formatListShort = (values?: string[] | null) => {
  if (!values || values.length === 0) {
    return '–';
  }

  const display = values.slice(0, 3).join(', ');
  return values.length > 3 ? `${display} …` : display;
};

const statusTone: Record<string, string> = {
  VERIFIED: 'bg-success-50 text-success-700 border-success-200',
  PENDING: 'bg-warning-50 text-warning-700 border-warning-200',
  REJECTED: 'bg-danger-50 text-danger-700 border-danger-200',
};

const buildInitialValues = (profile: NonNullable<Awaited<ReturnType<typeof fetchTherapistProfile>>>): SetcardFormValues => {
  const fallbackNameParts = [
    profile.displayName,
    [profile.user?.firstName, profile.user?.lastName].filter(Boolean).join(' ').trim(),
    profile.user?.email,
  ].filter((entry) => typeof entry === 'string' && entry.trim().length > 0) as string[];

  const displayName = fallbackNameParts[0] ?? fallbackNameParts[1] ?? fallbackNameParts[2] ?? '';

  return {
    displayName,
    title: profile.title ?? '',
    headline: profile.headline ?? '',
    profileImageUrl: profile.profileImageUrl ?? '',
    videoUrl: profile.videoUrl ?? '',
    acceptingClients: profile.acceptingClients ?? true,
    online: profile.online,
    services: joinList(profile.services ?? []),
    specialties: joinList(profile.specialties ?? []),
    modalities: joinList(profile.modalities ?? []),
    languages: joinList(profile.languages ?? []),
    approachSummary: profile.approachSummary ?? '',
    experienceSummary: profile.experienceSummary ?? '',
    responseTime: profile.responseTime ?? '',
    availabilityNote: profile.availabilityNote ?? '',
    pricingNote: profile.pricingNote ?? '',
    about: profile.about ?? '',
    city: profile.city ?? '',
    country: profile.country ?? 'AT',
    priceMin: formatCurrencyInput(profile.priceMin),
    priceMax: formatCurrencyInput(profile.priceMax),
    yearsExperience: typeof profile.yearsExperience === 'number' ? String(profile.yearsExperience) : '',
  };
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
  const initialValues = buildInitialValues(profile);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-neutral-900">Therapeut:innen-Profil</h1>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
              statusTone[profile.status] ?? 'bg-neutral-100 text-neutral-800 border border-neutral-200'
            }`}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden />
            {statusLabel}
          </span>
        </div>
        <p className="text-neutral-600">
          Verwalte deine öffentliche Setcard und sorge dafür, dass Klient:innen jederzeit aktuelle Informationen sehen.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <SetcardEditor initialValues={initialValues} />

        <aside className="space-y-6">
          <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900">Profilstatus & Meta</h3>
            <dl className="grid grid-cols-1 gap-4">
              <InfoRow
                label="Status"
                value={statusLabel}
                icon={ShieldCheck}
              />
              <InfoRow
                label="Letzte Aktualisierung"
                value={profile.updatedAt.toLocaleDateString('de-AT')}
                icon={CalendarDays}
              />
              <InfoRow
                label="Aktives Listing"
                value={primaryListing ? `${primaryListing.plan} (${primaryListing.status})` : 'Kein aktives Listing'}
                icon={UsersRound}
              />
              <InfoRow
                label="Preisrange"
                value={`${formatCurrency(profile.priceMin)} – ${formatCurrency(profile.priceMax)}`}
                icon={Euro}
              />
              <InfoRow
                label="Antwortzeit"
                value={profile.responseTime ?? '–'}
                icon={Clock3}
              />
            </dl>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900">Öffentliche Highlights</h3>
            <dl className="grid grid-cols-1 gap-4">
              <InfoRow label="Headline" value={profile.headline ?? '–'} icon={PencilLine} />
              <InfoRow label="Schwerpunkte" value={formatListShort(profile.specialties)} icon={UsersRound} />
              <InfoRow label="Modalitäten" value={formatListShort(profile.modalities)} icon={Globe2} />
              <InfoRow label="Sprachen" value={formatListShort(profile.languages)} icon={Languages} />
              <InfoRow label="Leistungen" value={formatListShort(profile.services)} icon={Sparkles} />
              <InfoRow
                label="Ort & Online"
                value={profile.online ? `${profile.city ?? 'Online'} · Online` : profile.city ?? 'Nur vor Ort'}
                icon={MapPin}
              />
            </dl>
          </section>
        </aside>
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
    <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</span>
      <span className="flex items-center gap-2 text-sm text-neutral-700 font-medium">
        {Icon ? <Icon className="h-4 w-4 text-teal-600" aria-hidden /> : null}
        {value}
      </span>
    </div>
  );
}
