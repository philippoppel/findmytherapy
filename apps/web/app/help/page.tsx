import type { Metadata } from 'next';
import { HelpPageContent } from './HelpPageContent';

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

// FAQ data for structured data (SEO - kept in German)
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
  // FAQPage Schema for all questions (kept in German for SEO)
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
      <HelpPageContent />

      {/* Structured Data (kept in German for SEO) */}
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
