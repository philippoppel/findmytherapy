const sections = [
  {
    id: 'overview',
    title: '1. Überblick',
    body:
      'Wir verarbeiten personenbezogene Daten ausschließlich zur Bereitstellung unserer Plattform, zur Durchführung von Therapieleistungen und zur Erfüllung gesetzlicher Verpflichtungen. Grundlage sind Art. 6 Abs. 1 lit. a, b und c DSGVO.',
  },
  {
    id: 'processing',
    title: '2. Datenverarbeitung',
    body:
      'Zu den verarbeiteten Daten zählen Kontaktdaten, Termininformationen, Zahlungsdaten sowie verlaufsbezogene Informationen aus den gebuchten Angeboten. Gesundheitsdaten werden nur mit ausdrücklicher Einwilligung verarbeitet.',
  },
  {
    id: 'cookies',
    title: '3. Cookies & Tracking',
    body:
      'Wir setzen technisch notwendige Cookies für Login und Session-Management ein. Optionale Analyse-Cookies werden erst nach deiner Zustimmung aktiviert und lassen sich jederzeit widerrufen.',
  },
  {
    id: 'rights',
    title: '4. Deine Rechte',
    body:
      'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie Datenübertragbarkeit. Anfragen richtest du an privacy@findmytherapy.health.',
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">Datenschutzerklärung</h1>
        <p className="text-sm text-neutral-700">
          Verantwortlich: FindMyTherapy GmbH, Wien, Österreich. Stand: {new Date().getFullYear()}.
        </p>
      </header>

      <nav aria-label="Abschnittsnavigation" className="rounded-2xl border border-divider bg-white p-4 text-sm text-neutral-700">
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a className="text-link hover:underline" href={`#${section.id}`}>
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section className="space-y-8">
        {sections.map((section) => (
          <article key={section.id} id={section.id} className="space-y-2 rounded-2xl border border-divider bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-950">{section.title}</h2>
            <p className="text-sm leading-relaxed text-neutral-800">{section.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

