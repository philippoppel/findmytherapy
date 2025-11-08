import { Metadata } from 'next'
import { WHO5Flow } from '../WHO5Flow'

export const metadata: Metadata = {
  title: 'WHO-5 Wohlbefindens-Check | Klarthera',
  description:
    'Schneller 5-Fragen Check zu deinem Wohlbefinden. Basierend auf dem WHO-5 Well-Being Index - validiert, wissenschaftlich fundiert und in nur 2 Minuten.',
  keywords: [
    'WHO-5',
    'Well-Being Index',
    'Wohlbefinden',
    'Selbsteinschätzung',
    'Mental Health Screening',
    'Schneller Check',
  ],
  openGraph: {
    title: 'WHO-5 Wohlbefindens-Check',
    description: 'Schneller 5-Fragen Check zu deinem Wohlbefinden - wissenschaftlich validiert.',
    type: 'website',
  },
}

export default function WHO5QuickCheckPage() {
  return <WHO5Flow />
}
