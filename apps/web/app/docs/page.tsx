import Link from 'next/link';

const cards = [
  {
    title: 'Farbsystem',
    description: "Brand-, Feedback- und Neutral-Paletten mit Kontrastwerten, Dos & Don'ts.",
    href: '/docs/colors',
  },
  {
    title: 'Komponenten',
    description: 'Buttons, Alerts, Formulare, Badges & Links - jeweils in Light, Dark & Simple Mode.',
    href: '/docs/components',
  },
  {
    title: 'Migration',
    description: 'Schritt-für-Schritt-Anleitung, um Legacy-Farben auf die neuen Tokens umzustellen.',
    href: '/docs/migration',
  },
];

export default function DocsIndexPage() {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="theme-light flex flex-col justify-between rounded-3xl border border-strong bg-surface-1 p-6 shadow-[0_20px_40px_-30px_rgb(var(--shadow-color))] transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-35px_rgb(var(--shadow-color))]"
        >
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{card.title}</h2>
            <p className="text-subtle text-sm leading-relaxed">{card.description}</p>
          </div>
          <span className="mt-4 text-sm font-semibold text-link">Zur Dokumentation &rarr;</span>
        </Link>
      ))}
    </section>
  );
}
