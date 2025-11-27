import { MatchingWizardProvider } from '../components/matching/MatchingWizardContext';
import { TherapistsLayoutClient } from './TherapistsLayoutClient';

export default function TherapistsLayout({ children }: { children: React.ReactNode }) {
  return (
    <MatchingWizardProvider>
      <TherapistsLayoutClient>
        {children}
      </TherapistsLayoutClient>
    </MatchingWizardProvider>
  );
}
