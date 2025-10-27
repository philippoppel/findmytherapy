'use client'

import { AdaptiveTriageFlow } from './AdaptiveTriageFlow'
import { TriageErrorBoundary } from './ErrorBoundary'

export default function TriagePage() {
  return (
    <TriageErrorBoundary>
      <AdaptiveTriageFlow />
    </TriageErrorBoundary>
  )
}
