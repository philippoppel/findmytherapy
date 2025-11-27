import { MatchingWizardProvider } from '../components/matching/MatchingWizardContext';

export default function MatchLayout({ children }: { children: React.ReactNode }) {
  return (
    <MatchingWizardProvider>
      {children}
    </MatchingWizardProvider>
  );
}
