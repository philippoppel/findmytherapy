import Link from 'next/link';

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-neutral-950">Profil &amp; Einstellungen</h1>
        <p className="text-sm text-neutral-700">
          Diese Version zeigt einen Ausblick auf die persönlichen Einstellungen. Rollenbasierte Bereiche findest du in deinem Dashboard.
        </p>
      </header>

      <section className="rounded-2xl border border-divider bg-white p-6 text-sm text-neutral-800 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-950">Wo finde ich was?</h2>
        <ul className="mt-3 space-y-2 list-disc list-inside">
          <li>
            Therapeut:innen verwalten ihr öffentliches Profil unter{' '}
            <Link className="text-link underline" href="/dashboard/profile">
              /dashboard/profile
            </Link>
            .
          </li>
          <li>
            Sicherheitsfunktionen (z.B. Zwei-Faktor-Authentifizierung) findest du unter{' '}
            <Link className="text-link underline" href="/dashboard/security">
              /dashboard/security
            </Link>
            .
          </li>
          <li>Klient:innen behalten hier in Zukunft Rechnungen, Buchungen und Abo-Details im Blick.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-info-200 bg-info-50 p-6 text-sm text-info-900">
        <p>
          Die vollständige Einstellungsverwaltung befindet sich noch in Entwicklung. In der Live-Version kannst du hier
          Kontaktinformationen und Benachrichtigungen steuern.
        </p>
      </section>
    </main>
  );
}
