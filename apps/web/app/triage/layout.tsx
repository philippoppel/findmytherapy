import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kostenlose Ersteinschätzung – Mentale Gesundheit | FindMyTherapy',
  description:
    'Kostenlose Ersteinschätzung mit validierten Fragebögen (PHQ-9, GAD-7, WHO-5) in unter 5 Minuten. Erhalte sofort dein Ampel-Ergebnis mit konkreten Empfehlungen für Österreich. DSGVO-konform.',
  keywords: [
    'PHQ-9 Test',
    'GAD-7 Test',
    'Depression Test',
    'Angststörung Test',
    'WHO-5 Test',
    'mentale Gesundheit Ersteinschätzung',
    'Psychotherapie Screening',
    'kostenlose Ersteinschätzung',
    'Ampel-Triage',
  ],
  openGraph: {
    title: 'Kostenlose Ersteinschätzung für mentale Gesundheit',
    description:
      'Validierte Tests (PHQ-9, GAD-7) mit Ampel-System in unter 5 Minuten. Sofort-Empfehlungen, DSGVO-konform für Österreich.',
    type: 'website',
    url: 'https://findmytherapy.net/triage',
    locale: 'de_AT',
    siteName: 'FindMyTherapy',
  },
  alternates: {
    canonical: 'https://findmytherapy.net/triage',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kostenlose Ersteinschätzung – Mentale Gesundheit',
    description:
      'PHQ-9 & GAD-7 Test in 5 Minuten. Ampel-Ergebnis mit konkreten Empfehlungen. Kostenlos & DSGVO-konform.',
  },
};

export default function TriageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
