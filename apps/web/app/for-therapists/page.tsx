const benefits = [
  {
    title: 'Neue Klient:innen erreichen',
    description:
      'Wir bringen dich mit Menschen zusammen, die aktiv nach Unterstützung suchen – regional und online.',
  },
  {
    title: 'Administrative Entlastung',
    description:
      'Unser Care-Team übernimmt Erstkontakte, Terminvorbereitung und Matching-Empfehlungen.',
  },
  {
    title: 'Digitale Tools inklusive',
    description:
      'Nutze Übungen, Fortschrittsverläufe und strukturierte Programme, um Sitzungen zu begleiten.',
  },
  {
    title: 'Flexible Abomodelle',
    description:
      'Starte kostenlos und erweitere bei Bedarf mit PRO-Features wie Top-Platzierung und Video-Profil.',
  },
];

export default function ForTherapistsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <header className="space-y-3 text-center">
        <span className="inline-flex items-center justify-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">
          Für Therapeut:innen
        </span>
        <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">
          Verbinde persönliche Therapie mit smarter digitaler Begleitung
        </h1>
        <p className="mx-auto max-w-2xl text-base text-neutral-700">
          FindMyTherapy unterstützt dich bei Klient:innengewinnung, Terminorganisation und der digitalen Verlängerung deiner Praxis.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {benefits.map((benefit) => (
          <article key={benefit.title} className="rounded-2xl border border-divider bg-white p-6 shadow-sm shadow-primary/10">
            <h2 className="text-lg font-semibold text-neutral-950">{benefit.title}</h2>
            <p className="mt-2 text-sm text-neutral-700">{benefit.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-info-200 bg-info-50 p-6 text-sm text-info-900">
        <h2 className="text-lg font-semibold text-info-900">Erstgespräch vereinbaren</h2>
        <p className="mt-2">
          In 30 Minuten zeigen wir dir, wie unser Matching funktioniert und wie du deine Profile pflegst. Schreibe uns an{' '}
          <a className="underline" href="mailto:therapists@findmytherapy.health">therapists@findmytherapy.health</a>.
        </p>
      </section>
    </main>
  );
}
