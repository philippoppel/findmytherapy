import { Suspense } from 'react';
import { MatchingWizardProvider } from '../components/matching/MatchingWizardContext';
import { TherapistsLayoutClient } from './TherapistsLayoutClient';
import TherapistsLoading from './loading';

export default function TherapistsLayout({ children }: { children: React.ReactNode }) {
  return (
    <MatchingWizardProvider>
      <Suspense fallback={<TherapistsLoading />}>
        <TherapistsLayoutClient>
          {children}
        </TherapistsLayoutClient>
      </Suspense>
    </MatchingWizardProvider>
  );
}
