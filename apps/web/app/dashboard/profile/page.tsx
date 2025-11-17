import type { ComponentType } from 'react';

import { notFound } from 'next/navigation';
import { CalendarDays, Clock3, Euro, Globe2, MapPin, ShieldCheck, UsersRound } from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { requireTherapist } from '../../../lib/auth-guards';
import { formatCurrencyInput, joinList } from '../../../lib/therapist/setcard';
import { SetcardEditor, type SetcardFormValues } from './SetcardEditor';
import { MicrositePreviewButton } from './MicrositePreviewButton';

// Force dynamic rendering for auth-protected page
export const dynamic = 'force-dynamic'

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

// Removed unused function formatListShort

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
    // Gallery
    galleryImage1: profile.galleryImages?.[0] ?? '',
    galleryImage2: profile.galleryImages?.[1] ?? '',
    galleryImage3: profile.galleryImages?.[2] ?? '',
    galleryImage4: profile.galleryImages?.[3] ?? '',
    galleryImage5: profile.galleryImages?.[4] ?? '',
    // Social Media
    socialLinkedin: profile.socialLinkedin ?? '',
    socialInstagram: profile.socialInstagram ?? '',
    socialFacebook: profile.socialFacebook ?? '',
    websiteUrl: profile.websiteUrl ?? '',
    // Additional Info
    qualifications: joinList(profile.qualifications ?? []),
    ageGroups: joinList(profile.ageGroups ?? []),
    acceptedInsurance: joinList(profile.acceptedInsurance ?? []),
    privatePractice: profile.privatePractice ?? false,
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      {/* Header Banner */}
      <header className="bg-white border-b border-neutral-200 px-6 py-6 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                <ShieldCheck className="h-6 w-6 text-white" aria-hidden />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Therapeuten-Profil</h1>
                <p className="text-sm text-muted mt-0.5">
                  Verwalte deine öffentliche Setcard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MicrositePreviewButton />
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
                  statusTone[profile.status] ?? 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                }`}
              >
                <ShieldCheck className="h-4 w-4" aria-hidden />
                {statusLabel}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Hauptformular */}
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-lg p-6">
            <SetcardEditor initialValues={initialValues} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
            {/* Quick Stats */}
            <section className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
                <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-primary-700" aria-hidden />
                </div>
                <h3 className="text-base font-bold text-neutral-900">Profilstatus</h3>
              </div>
              <dl className="space-y-3">
                <QuickStat
                  label="Status"
                  value={statusLabel}
                  icon={ShieldCheck}
                />
                <QuickStat
                  label="Aktualisiert"
                  value={profile.updatedAt.toLocaleDateString('de-AT')}
                  icon={CalendarDays}
                />
                <QuickStat
                  label="Listing"
                  value={primaryListing ? primaryListing.plan : 'Kein aktives'}
                  icon={UsersRound}
                />
              </dl>
            </section>

            {/* Öffentliche Info */}
            <section className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-primary-50/30 shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
                <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Globe2 className="h-4 w-4 text-primary-700" aria-hidden />
                </div>
                <h3 className="text-base font-bold text-neutral-900">Öffentliche Infos</h3>
              </div>
              <dl className="space-y-3">
                <QuickStat
                  label="Preis"
                  value={`${formatCurrency(profile.priceMin)} – ${formatCurrency(profile.priceMax)}`}
                  icon={Euro}
                />
                <QuickStat
                  label="Antwortzeit"
                  value={profile.responseTime ?? 'Nicht angegeben'}
                  icon={Clock3}
                />
                <QuickStat
                  label="Standort"
                  value={profile.online ? `${profile.city ?? 'Online'} + Online` : profile.city ?? 'Nur vor Ort'}
                  icon={MapPin}
                />
              </dl>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

type QuickStatProps = {
  label: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
};

function QuickStat({ label, value, icon: Icon }: QuickStatProps) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="mt-0.5 h-5 w-5 text-neutral-400 shrink-0">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">{label}</div>
        <div className="text-sm text-neutral-900 font-medium mt-0.5 truncate">{value}</div>
      </div>
    </div>
  );
}
