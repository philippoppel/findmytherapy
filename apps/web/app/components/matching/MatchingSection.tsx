'use client'

import { MatchingWizard } from './MatchingWizard'
import { MatchingResults } from './MatchingResults'

/**
 * Section that contains both the matching wizard and results
 * This is the inline expansion area on the landing page
 */
export function MatchingSection() {
  return (
    <div className="w-full">
      <MatchingWizard />
      <MatchingResults />
    </div>
  )
}
