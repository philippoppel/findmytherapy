import type { Metadata } from 'next'
import { AdaptiveTriageFlow } from './AdaptiveTriageFlow'

export const metadata: Metadata = {
  title: 'Ersteinschätzung – FindMyTherapy',
  description:
    'Wissenschaftlich fundierte Ersteinschätzung mit PHQ-9 und GAD-7. Erhalte in wenigen Minuten eine klare Einschätzung deiner mentalen Gesundheit und personalisierte Empfehlungen.',
}

export default function TriagePage() {
  return <AdaptiveTriageFlow />
}
