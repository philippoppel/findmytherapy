const partnerTypes = [
  {
    title: 'Unternehmen & HR-Teams',
    description:
      'Bietet euren Mitarbeitenden Zugang zu Kurzzeittherapie, Coaching und präventiven Lernpfaden – vollständig DSGVO-konform.',
  },
  {
    title: 'Versicherungen & Kassen',
    description:
      'Wir integrieren uns in bestehende Tarife und begleiten Versicherte digital zwischen Präsenzterminen.',
  },
  {
    title: 'Gesundheitsdienstleister',
    description:
      'Digitale Begleitprogramme und triagierte Weiterleitung zu Spezialist:innen eures Netzwerks.',
  },
];

export default function PartnersPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <header className="space-y-3 text-center">
        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Partner werden
        </span>
        <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">Prävention und Versorgung gemeinsam denken</h1>
        <p className="mx-auto max-w-2xl text-base text-neutral-700">
          Wir entwickeln maßgeschneiderte Programme für Unternehmen, Versicherungen und medizinische Netzwerke – mit Fokus auf Wirkung und Datenschutz.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {partnerTypes.map((type) => (
          <article key={type.title} className="rounded-2xl border border-divider bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-950">{type.title}</h2>
            <p className="mt-2 text-sm text-neutral-700">{type.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-primary/20 bg-primary-50 p-6 text-sm text-primary">
        <h2 className="text-lg font-semibold text-primary">Kontakt aufnehmen</h2>
        <p className="mt-2">
          Schreibe uns an <a className="underline" href="mailto:partners@findmytherapy.net">partners@findmytherapy.net</a>. Wir melden uns innerhalb eines Werktags mit einem Termin.
        </p>
      </section>
    </main>
  );
}

