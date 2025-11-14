export default function ImprintPage() {
  return (
    <div className="marketing-theme bg-surface text-default">
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">Impressum</h1>
        <p className="text-sm text-neutral-700">Informationspflicht gemäß §5 ECG und §25 MedienG.</p>
      </header>

      <section className="rounded-2xl border border-divider bg-surface-1 p-6 text-sm text-neutral-800">
        <h2 className="text-lg font-semibold text-neutral-950">Anbieter</h2>
        <p className="mt-2">
          FindMyTherapy GmbH<br />
          Mariahilfer Straße 10/2<br />
          1070 Wien<br />
          Österreich
        </p>
        <p className="mt-4">
          E-Mail:{' '}
          <a className="inline-flex min-h-12 items-center gap-1 px-2 py-3 underline" href="mailto:servus@findmytherapy.net">
            servus@findmytherapy.net
          </a>
          <br />
          Telefon:{' '}
          <a className="inline-flex min-h-12 items-center gap-1 px-2 py-3 underline" href="tel:+4319971212">
            +43 1 997 1212
          </a>
        </p>
        <p className="mt-4">
          Firmenbuchnummer: FN 123456a<br />
          Firmenbuchgericht: Handelsgericht Wien<br />
          UID: ATU12345678
        </p>
      </section>

      <section className="rounded-2xl border border-divider bg-surface-1 p-6 text-sm text-neutral-800">
        <h2 className="text-lg font-semibold text-neutral-950">Berufsrechtliche Informationen</h2>
        <p className="mt-2">
          Gesundheitspsychologische Leistungen und Psychotherapie erfolgen durch freiberuflich tätige Partner:innen gemäß den Bestimmungen des Psychologengesetzes 2013 sowie des Psychotherapiegesetzes.
        </p>
      </section>
    </main>
    </div>
  );
}
