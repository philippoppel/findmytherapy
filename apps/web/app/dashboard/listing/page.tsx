import { prisma } from '@/lib/prisma';
import { requireTherapist } from '@/lib/auth-guards';
import { CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering for auth-protected page
export const dynamic = 'force-dynamic';

const fetchListingInfo = async (userId: string) => {
  const profile = await prisma.therapistProfile.findUnique({
    where: { userId },
    include: {
      listings: true,
    },
  });

  return profile;
};

export default async function ListingPage() {
  const session = await requireTherapist();
  const profile = await fetchListingInfo(session.user.id);
  const listing = profile?.listings[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="space-y-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-muted hover:text-default mb-2"
        >
          ← Zurück zum Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-neutral-950">Listing-Verwaltung</h1>
        <p className="text-neutral-800">
          Verwalten Sie Ihre Sichtbarkeit und Präsenz auf der Plattform.
        </p>
      </header>

      {listing ? (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-950">Ihr aktueller Plan</h2>
              <p className="text-sm text-muted mt-1">
                Status und Details Ihres Listing-Abonnements
              </p>
            </div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                listing.status === 'ACTIVE'
                  ? 'bg-success-50 text-success-700'
                  : listing.status === 'PAST_DUE'
                    ? 'bg-warning-50 text-warning-700'
                    : 'bg-neutral-100 text-neutral-700'
              }`}
            >
              {listing.status === 'ACTIVE' ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Aktiv
                </>
              ) : listing.status === 'PAST_DUE' ? (
                <>
                  <AlertCircle className="h-4 w-4" />
                  Zahlungsrückstand
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  Inaktiv
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard label="Plan" value={listing.plan} />
            <InfoCard
              label="Aktuelle Periode (Start)"
              value={listing.currentPeriodStart?.toLocaleDateString('de-AT') ?? 'N/A'}
            />
            <InfoCard
              label="Aktuelle Periode (Ende)"
              value={listing.currentPeriodEnd?.toLocaleDateString('de-AT') ?? 'N/A'}
            />
          </div>

          <div className="border-t border-divider pt-6">
            <h3 className="text-lg font-semibold text-neutral-950 mb-4">Verfügbare Pläne</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PlanCard
                name="FREE"
                price="Kostenlos"
                features={['Basis-Profil', 'Standard-Sichtbarkeit', 'E-Mail-Benachrichtigungen']}
                isCurrent={listing.plan === 'FREE'}
              />
              <PlanCard
                name="PRO"
                price="€49/Monat"
                features={[
                  'Erweiterte Profiloptionen',
                  'Erhöhte Sichtbarkeit',
                  'Prioritäts-Support',
                  'Statistiken & Analytics',
                ]}
                isCurrent={listing.plan === 'PRO'}
                isRecommended
              />
              <PlanCard
                name="PRO_PLUS"
                price="€99/Monat"
                features={[
                  'Alle PRO Features',
                  'Top-Platzierung in Suche',
                  'Video-Profil',
                  'Dedizierter Account Manager',
                  'Erweiterte Marketing-Tools',
                ]}
                isCurrent={listing.plan === 'PRO_PLUS'}
              />
            </div>
          </div>

          <div className="bg-info-50 border border-info-200 rounded-lg p-4">
            <p className="text-sm text-info-900">
              <strong>Hinweis:</strong> Änderungen am Abonnement nehmen wir derzeit gemeinsam mit
              Ihnen vor. In Kürze können Sie hier direkt upgraden oder downgraden.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center space-y-4">
          <TrendingUp className="h-16 w-16 text-neutral-400 mx-auto" />
          <h2 className="text-xl font-semibold text-neutral-950">Noch kein Listing aktiv</h2>
          <p className="text-neutral-700 max-w-md mx-auto">
            Sie haben noch kein Listing-Abonnement. Aktivieren Sie ein Listing, um auf der Plattform
            sichtbar zu sein.
          </p>
          <button
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors"
            disabled
          >
            Listing aktivieren
          </button>
        </div>
      )}
    </div>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="bg-neutral-50 rounded-lg p-4">
      <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-1">{label}</p>
      <p className="text-lg font-bold text-neutral-950">{value}</p>
    </div>
  );
}

type PlanCardProps = {
  name: string;
  price: string;
  features: string[];
  isCurrent?: boolean;
  isRecommended?: boolean;
};

function PlanCard({ name, price, features, isCurrent, isRecommended }: PlanCardProps) {
  return (
    <div
      className={`relative rounded-lg border p-6 ${
        isCurrent
          ? 'border-primary bg-primary-50'
          : isRecommended
            ? 'border-accent bg-accent-50'
            : 'border-divider bg-white'
      }`}
    >
      {isRecommended && !isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold uppercase tracking-wide">
            Empfohlen
          </span>
        </div>
      )}
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold uppercase tracking-wide">
            Aktueller Plan
          </span>
        </div>
      )}
      <h3 className="text-lg font-bold text-neutral-950">{name}</h3>
      <p className="text-2xl font-extrabold text-neutral-950 mt-2 mb-4">{price}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-neutral-700">
            <CheckCircle2 className="h-4 w-4 text-success-600 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
