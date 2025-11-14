const faqs = [
  {
    question: 'Wie schnell bekomme ich einen Termin?',
    answer:
      'In der Regel melden wir uns innerhalb von 24 Stunden bei dir. Akute Termine priorisieren wir und versuchen, noch am selben Tag einen Rückruf zu organisieren.',
  },
  {
    question: 'Welche Kosten entstehen?',
    answer:
      'Das Erstgespräch ist kostenlos. Für laufende Sitzungen gelten die Honorare der Therapeut:innen. Viele Kassen erstatten einen Teilbetrag – wir helfen dir bei der Einreichung.',
  },
  {
    question: 'Kann ich die Therapie online machen?',
    answer:
      'Ja. Viele unserer Therapeut:innen bieten sowohl Online- als auch Vor-Ort-Sitzungen an. Du kannst beim Matching deine Präferenz angeben.',
  },
  {
    question: 'Was passiert mit meinen Daten?',
    answer:
      'Wir hosten in der EU, verschlüsseln alle Verbindungen und halten uns strikt an die DSGVO. Nur das Care-Team und deine Therapeut:innen haben Zugriff.',
  },
];

export default function HelpPage() {
  return (
    <div className="marketing-theme bg-surface text-default">
    <main className="mx-auto max-w-3xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
      <header className="space-y-4 text-center">
        <span className="inline-flex items-center justify-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Hilfe & FAQ
        </span>
        <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">Wie können wir dir helfen?</h1>
        <p className="text-base text-neutral-700">
          Unser Support-Team begleitet dich vom Erstkontakt bis zur laufenden Therapie. Hier findest du Antworten auf die häufigsten Fragen.
        </p>
      </header>

      <section aria-labelledby="faq-heading" className="space-y-6">
        <h2 id="faq-heading" className="text-xl font-semibold text-neutral-950">
          Häufige Fragen
        </h2>
        <ul className="space-y-4">
          {faqs.map((faq) => (
              <li key={faq.question} className="rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-neutral-950">{faq.question}</h3>
                <p className="mt-2 text-sm text-neutral-700">{faq.answer}</p>
              </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-primary/20 bg-primary-50/80 p-6 text-sm text-primary">
        <h2 className="text-lg font-semibold text-primary">Direkter Kontakt</h2>
        <p className="mt-2">
          Schreib uns an{' '}
          <a className="inline-flex min-h-12 items-center gap-1 px-2 py-3 underline" href="mailto:servus@findmytherapy.net">
            servus@findmytherapy.net
          </a>{' '}
          oder ruf uns unter{' '}
          <a className="inline-flex min-h-12 items-center gap-1 px-2 py-3 underline" href="tel:+4319971212">
            +43 1 997 1212
          </a>{' '}
          an. Wir sind werktags von 8–18 Uhr für dich erreichbar.
        </p>
      </section>
    </main>
    </div>
  );
}
