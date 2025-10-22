export default function HowItWorksPage() {
  const steps = [
    {
      title: 'Erstgespräch planen',
      description:
        'Beantworte einige Fragen zu deinem Anliegen. Unser Matching-Algorithmus schlägt dir passende Therapeut:innen und Programme vor.',
    },
    {
      title: 'Therapieweg wählen',
      description:
        'Wähle zwischen persönlicher Begleitung, digitalen Programmen oder einer Kombination aus beidem. Alles lässt sich flexibel anpassen.',
    },
    {
      title: 'Dranbleiben leicht gemacht',
      description:
        'Erhalte Erinnerungen, Übungen und Fortschrittsberichte. Unser Care-Team steht dir jederzeit zur Seite.',
    },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <section className="space-y-6 text-center">
        <span className="inline-flex items-center justify-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          So funktioniert&apos;s
        </span>
        <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">
          In drei Schritten zu deinem passenden Unterstützungsangebot
        </h1>
        <p className="mx-auto max-w-2xl text-base text-neutral-700">
          FindMyTherapy kombiniert individuelles Matching, telemedizinische Tools und ein Care-Team, das dich auf deinem Weg begleitet.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className="flex flex-col gap-3 rounded-2xl border border-divider bg-white p-6 text-left shadow-sm shadow-primary/10"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {index + 1}
            </span>
            <h2 className="text-lg font-semibold text-neutral-950">{step.title}</h2>
            <p className="text-sm text-neutral-700">{step.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 rounded-2xl bg-surface-2 p-8 shadow-inner">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold text-neutral-950">Unsere Qualitätsstandards</h2>
          <p className="text-sm text-neutral-700">
            Wir arbeiten mit approbierten Psychotherapeut:innen, Klinischen Psycholog:innen und zertifizierten Coaches zusammen.
          </p>
        </header>
        <ul className="grid gap-4 text-sm text-neutral-800 md:grid-cols-2">
          <li className="rounded-lg border border-divider bg-white p-4">
            Regelmäßige Qualitätschecks durch unser Clinical Advisory Board.
          </li>
          <li className="rounded-lg border border-divider bg-white p-4">
            DSGVO-konforme Infrastruktur und Hosting in der EU.
          </li>
          <li className="rounded-lg border border-divider bg-white p-4">
            Flexible Kombination aus digitalen Tools und persönlicher Therapie.
          </li>
          <li className="rounded-lg border border-divider bg-white p-4">
            Direkte Unterstützung durch das Care-Team via Telefon, Chat oder Mail.
          </li>
        </ul>
      </section>
    </main>
  );
}

