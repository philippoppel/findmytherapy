const clauses = [
  {
    title: '1. Geltungsbereich',
    body: 'Diese Bedingungen gelten für alle Verträge zwischen der FindMyTherapy GmbH und Nutzer:innen der Plattform. Abweichende Bedingungen werden nicht anerkannt.',
  },
  {
    title: '2. Leistungen',
    body: 'FindMyTherapy vermittelt therapeutische Leistungen, bietet digitale Programme an und stellt Kommunikations- sowie Terminwerkzeuge bereit. Therapeutische Leistungen werden von selbstständigen Partner:innen erbracht.',
  },
  {
    title: '3. Zahlungsmodalitäten',
    body: 'Digitale Programme werden über Stripe abgerechnet. Honorare für Sitzungen werden unter Berücksichtigung der jeweiligen Therapeutenvereinbarungen eingezogen.',
  },
  {
    title: '4. Haftung',
    body: 'Wir haften nur für Schäden, die auf grobe Fahrlässigkeit oder Vorsatz zurückzuführen sind. Dies gilt nicht für Schäden an Leben, Körper oder Gesundheit.',
  },
];

import { BackLink } from '../components/BackLink';

export default function TermsPage() {
  return (
    <div className="marketing-theme bg-surface text-default">
      <main className="mx-auto max-w-3xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <BackLink />

        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">
            Allgemeine Geschäftsbedingungen
          </h1>
          <p className="text-sm text-neutral-700">Stand: {new Date().getFullYear()}</p>
        </header>

        <section className="space-y-6">
          {clauses.map((clause) => (
            <article
              key={clause.title}
              className="rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft"
            >
              <h2 className="text-lg font-semibold text-neutral-950">{clause.title}</h2>
              <p className="mt-2 text-sm text-neutral-800 leading-relaxed">{clause.body}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-info-200 bg-info-50 p-6 text-sm text-info-900">
          <h2 className="text-lg font-semibold text-info-900">Widerruf & Support</h2>
          <p className="mt-2">
            Du kannst digitale Produkte innerhalb von 14 Tagen widerrufen, sofern du noch keine
            Inhalte abgeschlossen hast. Kontaktiere uns unter{' '}
            <a className="underline" href="mailto:support@findmytherapy.net">
              support@findmytherapy.net
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
