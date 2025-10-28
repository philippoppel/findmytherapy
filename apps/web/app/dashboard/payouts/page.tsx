import Link from 'next/link';

import { requireTherapist } from '../../../lib/auth-guards';
import { CreditCard, Info } from 'lucide-react';

// Force dynamic rendering for auth-protected page
export const dynamic = 'force-dynamic'

export default async function PayoutsPage() {
  await requireTherapist();

  const upcomingTransfers = [
    {
      id: 'trx-preview-001',
      amount: '€0,00',
      period: 'April 2025',
      status: 'In Vorbereitung',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <header className="space-y-2">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted hover:text-default">
          ← Zurück zum Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-neutral-950">Auszahlungen</h1>
        <p className="text-sm text-neutral-700">
          Übersicht über offene Auszahlungen und vergangene Überweisungen. Derzeit sind keine echten Beträge hinterlegt.
        </p>
      </header>

      <section className="space-y-4 rounded-2xl border border-divider bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="text-lg font-semibold text-neutral-950">Anstehende Überweisungen</h2>
        </div>
        <ul className="space-y-3 text-sm text-neutral-800">
          {upcomingTransfers.map((transfer) => (
            <li key={transfer.id} className="flex flex-col gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <span className="font-semibold text-default">{transfer.period}</span>
              <div className="flex flex-wrap items-center gap-3">
                <span>Betrag: {transfer.amount}</span>
                <span>Status: {transfer.status}</span>
                <span className="text-xs text-muted uppercase tracking-wide">Referenz {transfer.id}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-info-200 bg-info-50 p-6 text-sm text-info-900">
        <div className="flex items-center gap-2 font-semibold">
          <Info className="h-4 w-4" aria-hidden />
          Hinweis
        </div>
        <p className="mt-2">
          Auszahlungen erfolgen regulär wöchentlich über Stripe Connect. Lade in der finalen Version bitte deine Konto- und Steuerdaten im
          Onboarding hoch, damit wir Überweisungen freischalten können.
        </p>
      </section>
    </div>
  );
}
