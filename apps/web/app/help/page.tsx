import type { Metadata } from 'next';
import Link from 'next/link';
import { BackLink } from '../components/BackLink';

export const metadata: Metadata = {
  title: 'Hilfe & FAQ – Häufige Fragen | FindMyTherapy',
  description:
    'Antworten auf häufig gestellte Fragen zu Psychotherapie in Österreich. Kosten, Ablauf, Kassenplätze, Online-Therapie und mehr. Finden Sie alle Informationen hier.',
  keywords: [
    'Psychotherapie FAQ',
    'Häufige Fragen Psychotherapie',
    'Therapie Kosten Österreich',
    'Kassenplatz Psychotherapie',
    'Online Therapie',
    'Erstgespräch Psychotherapie',
    'Psychotherapie Ablauf',
    'FindMyTherapy Hilfe',
  ],
  alternates: {
    canonical: 'https://findmytherapy.net/help',
  },
  openGraph: {
    title: 'Hilfe & FAQ – Häufige Fragen zu Psychotherapie',
    description:
      'Antworten auf häufig gestellte Fragen zu Psychotherapie in Österreich. Kosten, Ablauf, Kassenplätze und mehr.',
    type: 'website',
    locale: 'de_AT',
    siteName: 'FindMyTherapy',
    url: 'https://findmytherapy.net/help',
    images: [
      {
        url: 'https://findmytherapy.net/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FindMyTherapy Hilfe & FAQ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hilfe & FAQ – Häufige Fragen zu Psychotherapie',
    description: 'Antworten auf häufig gestellte Fragen zu Psychotherapie in Österreich.',
    images: ['https://findmytherapy.net/images/og-image.jpg'],
  },
};

// FAQ categories with questions and answers
const faqCategories = [
  {
    id: 'allgemein',
    name: 'Allgemeine Fragen',
    faqs: [
      {
        question: 'Was ist FindMyTherapy?',
        answer:
          'FindMyTherapy ist eine Plattform, die Menschen in Österreich passende Psychotherapeut:innen vermittelt. Wir nutzen ein kurzes Intake und Matching, um dir Therapeut:innen vorzuschlagen, die zu Anliegen, Verfügbarkeit und Budget passen.',
      },
      {
        question: 'Wie schnell bekomme ich einen Termin?',
        answer:
          'Wir melden uns in der Regel binnen 24 Stunden. Bei akuten Anfragen priorisieren wir dich und versuchen noch am selben Tag einen Rückruf zu organisieren.',
      },
      {
        question: 'Ist der Service kostenlos?',
        answer:
          'Ja. Die Nutzung von FindMyTherapy und die Vermittlung sind für dich kostenlos. Du zahlst nur die Sitzungen bei deiner:m Therapeut:in.',
      },
    ],
  },
  {
    id: 'kosten',
    name: 'Kosten & Finanzierung',
    faqs: [
      {
        question: 'Welche Kosten entstehen für die Therapie?',
        answer:
          'Das Erstgespräch ist kostenlos. Folgesitzungen liegen je nach Therapeut:in meist zwischen 80–150 € pro Einheit. Wir teilen dir die genauen Honorare beim Matching mit.',
      },
      {
        question: 'Übernimmt meine Krankenkasse die Kosten?',
        answer:
          'Die meisten Kassen erstatten ca. 33 € pro Sitzung bei Wahltherapeut:innen. Kassenplätze sind begrenzt; wir prüfen im Matching, ob ein passender Platz frei ist.',
      },
      {
        question: 'Wie funktioniert die Kostenerstattung?',
        answer:
          'Du erhältst nach jeder Sitzung eine Rechnung, reichst sie bei deiner Krankenkasse ein und bekommst den Zuschuss meist in 2–4 Wochen. Wir schicken dir die nötigen Formulare mit.',
      },
    ],
  },
  {
    id: 'ablauf',
    name: 'Ablauf & Therapie',
    faqs: [
      {
        question: 'Wie läuft das Erstgespräch ab?',
        answer:
          'Im Erstgespräch lernt ihr euch kennen, besprecht Anliegen und Erwartungen und schaut, ob die Chemie passt. Danach entscheidest du, ob du weitermachen möchtest.',
      },
      {
        question: 'Wie lange dauert eine Therapie?',
        answer:
          'Kurzzeittherapien umfassen oft 12–25 Sitzungen, längere Prozesse können mehrere Monate oder ein Jahr dauern. Deine Therapeutin oder dein Therapeut bespricht den Rahmen mit dir.',
      },
      {
        question: 'Kann ich die/den Therapeut:in wechseln?',
        answer:
          'Ja. Wenn du merkst, dass es nicht passt, organisieren wir gerne ein neues Matching mit einer anderen Therapeutin oder einem anderen Therapeuten.',
      },
    ],
  },
  {
    id: 'online',
    name: 'Online-Therapie',
    faqs: [
      {
        question: 'Kann ich die Therapie online machen?',
        answer:
          'Ja. Viele Therapeut:innen bieten Online-Sitzungen per Video an. Du kannst beim Matching angeben, ob du online, vor Ort oder hybrid möchtest.',
      },
      {
        question: 'Ist Online-Therapie genauso effektiv?',
        answer:
          'Ja, Studien zeigen gute Wirksamkeit. Online-Therapie eignet sich besonders, wenn du wenig Zeit hast oder weiter weg wohnst.',
      },
    ],
  },
  {
    id: 'datenschutz',
    name: 'Datenschutz & Sicherheit',
    faqs: [
      {
        question: 'Was passiert mit meinen Daten?',
        answer:
          'Wir hosten in der EU, verschlüsseln alle Verbindungen und halten uns an die DSGVO. Zugriff haben nur das Care-Team und deine Therapeut:innen.',
      },
      {
        question: 'Ist die Kommunikation vertraulich?',
        answer:
          'Psychotherapeut:innen unterliegen der Schweigepflicht. Inhalte gehen nicht an Dritte oder Krankenkassen; bei Kassentherapie wird nur die Behandlung gemeldet, nicht die Details.',
      },
    ],
  },
];

// Flatten all FAQs for schema
const allFaqs = faqCategories.flatMap((category) => category.faqs);

export default function HelpPage() {
  // FAQPage Schema for all questions
  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://findmytherapy.net',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Hilfe & FAQ',
        item: 'https://findmytherapy.net/help',
      },
    ],
  };

  return (
    <div className="marketing-theme bg-surface text-default">
      <main className="mx-auto max-w-4xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        {/* Back Link */}
        <BackLink />

        <header className="space-y-4 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Hilfe & FAQ
          </span>
          <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">
            Wie können wir dir helfen?
          </h1>
          <p className="text-base text-neutral-700 max-w-2xl mx-auto">
            Unser Support-Team begleitet dich vom Erstkontakt bis zur laufenden Therapie. Hier
            findest du Antworten auf die häufigsten Fragen zu Psychotherapie in Österreich.
          </p>
        </header>

        {/* Quick Navigation */}
        <nav className="flex flex-wrap gap-2 justify-center">
          {faqCategories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="px-4 py-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-primary-50 hover:text-primary transition-colors text-sm font-medium"
            >
              {category.name}
            </a>
          ))}
        </nav>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqCategories.map((category) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-heading`}
              className="space-y-6 scroll-mt-8"
            >
              <h2
                id={`${category.id}-heading`}
                className="text-2xl font-semibold text-neutral-950 border-b border-divider pb-3"
              >
                {category.name}
              </h2>
              <ul className="space-y-4">
                {category.faqs.map((faq) => (
                  <li
                    key={faq.question}
                    className="rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft"
                  >
                    <h3 className="text-lg font-semibold text-neutral-950">{faq.question}</h3>
                    <p className="mt-2 text-sm text-neutral-700 leading-relaxed">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* CTA Section */}
        <section className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Noch Fragen? Wir helfen gerne!</h2>
          <p className="text-primary-100 mb-6 max-w-xl mx-auto">
            Unser Care-Team ist für dich da. Egal ob du Unterstützung bei der Therapeutensuche
            brauchst oder allgemeine Fragen hast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/triage"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
            >
              Therapeut:in finden
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-700 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors border border-primary-500"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </section>

        {/* Direct Contact */}
        <section className="rounded-2xl border border-primary/20 bg-primary-50/80 p-6 text-sm text-primary">
          <h2 className="text-lg font-semibold text-primary">Direkter Kontakt</h2>
          <p className="mt-2">
            Schreib uns an{' '}
            <a
              className="inline-flex min-h-12 items-center gap-1 px-2 py-3 underline"
              href="mailto:servus@findmytherapy.net"
            >
              servus@findmytherapy.net
            </a>{' '}
            oder ruf uns unter{' '}
            <a
              className="inline-flex min-h-12 items-center gap-1 px-2 py-3 underline"
              href="tel:+4319971212"
            >
              +43 1 997 1212
            </a>{' '}
            an. Wir sind werktags von 8–18 Uhr für dich erreichbar.
          </p>
        </section>

        {/* Related Links */}
        <section className="border-t border-divider pt-8">
          <h2 className="text-xl font-semibold text-neutral-950 mb-4">Weitere hilfreiche Seiten</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/blog"
              className="flex items-center gap-3 p-4 rounded-xl border border-divider hover:border-primary hover:bg-primary-50/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-950">Blog</h3>
                <p className="text-sm text-neutral-600">Artikel zu psychischer Gesundheit</p>
              </div>
            </Link>
            <Link
              href="/how-it-works"
              className="flex items-center gap-3 p-4 rounded-xl border border-divider hover:border-primary hover:bg-primary-50/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-950">So funktioniert&apos;s</h3>
                <p className="text-sm text-neutral-600">Der Weg zu deiner Therapie</p>
              </div>
            </Link>
            <Link
              href="/privacy"
              className="flex items-center gap-3 p-4 rounded-xl border border-divider hover:border-primary hover:bg-primary-50/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-950">Datenschutz</h3>
                <p className="text-sm text-neutral-600">Wie wir deine Daten schützen</p>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </div>
  );
}
