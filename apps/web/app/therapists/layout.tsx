import { MatchingWizardProvider } from '../components/matching/MatchingWizardContext'
import { MatchingSection } from '../components/matching/MatchingSection'

export default function TherapistsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MatchingWizardProvider>
      {/* Matching Wizard & Results - Inline Expansion (hidden by default) */}
      <MatchingSection />
      {children}
    </MatchingWizardProvider>
  )
}
